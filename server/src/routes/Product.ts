import { Image, Prisma, PrismaClient, Product, User } from ".prisma/client";
import {
  authenticate,
  isCustomer,
  isSeller,
  sendValidationErrors,
} from "@shared/functions";
import { Router } from "express";
import { body, check, param, query } from "express-validator";

const router = Router();
const prisma = new PrismaClient();

router.post(
  "/add",
  body("name").isString().notEmpty(),
  body("description").isString().notEmpty(),
  body("images").isArray(),
  body("price").isNumeric().notEmpty(),
  sendValidationErrors,
  authenticate,
  isSeller,
  async (req, res) => {
    const user = req.user as User;

    const product = await prisma.product.create({
      data: {
        name: req.body.name,
        sellerId: user.id,
        description: req.body.description,
        price: Number.parseInt(req.body.price),
      },
      include: {
        seller: true,
        ratings: true,
        images: true,
      },
    });
    if (!product)
      return res.status(400).send({ message: "Unable to create product." });

    await prisma.image.updateMany({
      where: {
        id: {
          in: req.body.images,
        },
      },
      data: {
        productId: product.id,
      },
    });

    return res.send({ message: "Success", product });
  }
);

router.get(
  "/cursorpaginate",
  query("cursor").optional().isNumeric(),
  sendValidationErrors,
  authenticate,
  async (req, res) => {
    let user = req.user as User;
    let cursor = Number.parseInt(req.query.cursor as string);
    let sellerId;
    let last: Product[] = [];

    if (user.type === "SELLER") sellerId = user.id;
    if (!req.query.cursor) {
      last = await prisma.product.findMany({
        where: sellerId
          ? {
              sellerId,
            }
          : undefined,
        take: 1,
        include: {
          images: true,
          seller: true,
          ratings: true,
        },
        orderBy: { createdAt: "desc" },
      });

      //Check if any product found
      if (last.length === 0)
        return res.send({
          message: "No products found",
          products: [],
          count: 0,
          nextId: false,
        });

      cursor = last[0].id;
    }

    const products = await prisma.product.findMany({
      take: 5,
      skip: 1,
      cursor: {
        id: cursor,
      },
      orderBy: {
        id: "desc",
      },
      include: {
        images: true,
        seller: true,
        ratings: true,
      },
    });

    const count = await prisma.product.count();
    const _products = [...last, ...products];

    if (products.length === 0)
      return res.send({
        message: "Success",
        products: _products,
        count,
        nextId: false,
      });

    const nextId = products[products.length - 1].id;

    return res.send({
      message: "Success",
      products: _products,
      count,
      nextId,
    });
  }
);

router.get(
  "/customer/searchpaginate",
  query("keyword").isString().notEmpty(),
  query("cursor").optional().isNumeric(),
  sendValidationErrors,
  authenticate,
  isCustomer,
  async (req, res) => {
    let user = req.user as User;
    let cursor = Number.parseInt(req.query.cursor as string);
    let last: Product[] = [];

    const keyword = req.query.keyword as string;

    const include = {
      images: true,
      seller: true,
      ratings: true,
    };

    if (!req.query.cursor) {
      last = await prisma.product.findMany({
        where: {
          name: {
            contains: keyword,
            mode: "insensitive",
          },
        },
        take: 1,
        include,
        orderBy: { createdAt: "desc" },
      });

      //Check if any product found
      if (last.length === 0)
        return res.send({
          message: "No products found",
          products: [],
          count: 0,
          nextId: false,
        });

      cursor = last[0].id;
    }

    const products = await prisma.product.findMany({
      take: 5,
      skip: 1,
      where: {
        name: {
          contains: keyword,
          mode: "insensitive",
        },
      },
      cursor: {
        id: cursor,
      },
      orderBy: {
        id: "desc",
      },
      include,
    });

    const count = await prisma.product.count();
    const _products = [...last, ...products];

    if (products.length === 0)
      return res.send({
        message: "Success",
        products: _products,
        count,
        nextId: false,
      });

    const nextId = products[products.length - 1].id;

    return res.send({
      message: "Success",
      products: _products,
      count,
      nextId,
    });
  }
);

router.get(
  "/:id",
  param("id").isNumeric(),
  sendValidationErrors,
  async (req, res) => {
    const product = await prisma.product.findFirst({
      where: {
        id: Number.parseInt(req.params?.id),
      },
      include: {
        images: true,
        ratings: true,
        seller: true,
      },
    });

    if (!product)
      return res.status(404).send({ message: "Product not found." });

    const ratings = await prisma.rating.findMany({
      where: {
        productId: product.id,
      },
      select: {
        rating: true,
      },
    });

    const sum = ratings.reduce((a, b) => a + b.rating, 0);
    const avg = sum / ratings.length || 0;

    return res.send({ message: "Success", product, ratingsAverage: avg });
  }
);

router.put(
  "/:id",
  param("id").isNumeric(),
  body("name").optional().not().isEmpty().isString(),
  body("price").optional().not().isEmpty().isString(),
  body("description").optional().not().isEmpty().isString(),
  body("images").optional().isArray(),
  sendValidationErrors,
  authenticate,
  async (req, res) => {
    const product = await prisma.product.update({
      where: {
        id: Number.parseInt(req.params?.id),
      },
      data: {
        name: req.body.name,
        description: req.body.description,
        price: Number.parseInt(req.body.price),
      },
    });

    await prisma.image.updateMany({
      where: {
        OR: req.body.images.map((id: number) => ({ id })),
      },
      data: {
        productId: product.id,
      },
    });

    if (!product)
      return res.status(404).send({ message: "Product not found." });

    return res.send({ message: "Success", product });
  }
);

router.delete(
  "/:id",
  param("id").isNumeric(),
  sendValidationErrors,
  authenticate,
  isSeller,
  async (req, res) => {
    const user = req.user as User;

    const product = await prisma.product.findFirst({
      where: {
        id: Number.parseInt(req.params.id),
      },
    });

    if (!product) return res.status(404).send({ message: "Product not found" });

    if (product.sellerId !== user.id && user.type !== "ADMIN")
      return res.status(403).send({ message: "No permission" });

    // Delete related images
    await prisma.image.deleteMany({
      where: {
        productId: product.id,
      },
    });

    // Delete related ratings
    await prisma.rating.deleteMany({
      where: {
        productId: product.id,
      },
    });

    const del = await prisma.product.delete({
      where: {
        id: product.id,
      },
    });

    if (!del) return res.status(500).send({ message: "Unable to delete" });

    return res.send({ message: "Product deleted successfully." });
  }
);

export default router;
