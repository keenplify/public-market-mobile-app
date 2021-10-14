import { Image, Prisma, PrismaClient, Product, User } from ".prisma/client";
import { authenticate, sendValidationErrors } from "@shared/functions";
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
  async (req, res) => {
    const user = req.user as User;

    const product = await prisma.product.create({
      data: {
        name: req.body.name,
        sellerId: user.id,
        description: req.body.description,
        price: Number.parseInt(req.body.price),
      },
    });
    if (!product)
      return res.status(400).send({ message: "Unable to create product." });

    const promises: Prisma.Prisma__ImageClient<Image>[] = [];

    req.body.images &&
      req.body.images.forEach(async (imgId: number) => {
        promises.push(
          prisma.image.update({
            where: {
              id: imgId,
            },
            data: {
              productId: product.id,
            },
          })
        );
      });

    await Promise.all(promises);

    return res.send({ message: "Success", product });
  }
);

// router.get(
//   "/paginate",
//   query("skip").isNumeric(),
//   query("take").isNumeric(),
//   sendValidationErrors,
//   authenticate,
//   async (req, res) => {
//     const products = await prisma.product.findMany({
//       take: Number.parseInt(req.query.take as string),
//       skip: Number.parseInt(req.query.skip as string),
//       orderBy: {
//         id: "desc",
//       },
//     });
//     const count = await prisma.product.count();

//     return res.send({ message: "Success", products, count });
//   }
// );

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
      take: 6,
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

    if (products.length === 0)
      return res.send({
        message: "Success",
        products: [...last, ...products],
        count,
        nextId: false,
      });

    const nextId = products[products.length - 1].id;

    return res.send({
      message: "Success",
      products: [...last, ...products],
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

    return res.send({ message: "Success", product });
  }
);

router.put(
  "/:id",
  param("id").isNumeric(),
  body("name").optional().not().isEmpty().isString(),
  body("price").optional().not().isEmpty().isString(),
  body("description").optional().not().isEmpty().isString(),
  body("images").optional().not().isEmpty().isArray(),
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
        images: req.body.images.length > 0 ? req.body.images : undefined,
        price: req.body.price,
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
