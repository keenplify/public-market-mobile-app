import { PrismaClient, User } from ".prisma/client";
import { authenticate, sendValidationErrors } from "@shared/functions";
import { Router } from "express";
import { body, check, param } from "express-validator";

const router = Router();
const prisma = new PrismaClient();

router.post(
  "/add",
  body("name").not().isEmpty().isString(),
  body("description").not().isEmpty().isString(),
  body("images").isArray(),
  body("price").not().isEmpty().isString(),
  sendValidationErrors,
  authenticate,
  async (req, res) => {
    const user = req.user as User;

    const product = await prisma.product.create({
      data: {
        name: req.body.name,
        sellerId: user.id,
        description: req.body.description,
        images: req.body.images.length > 0 ? req.body.images : undefined,
        price: req.body.price,
      },
    });

    if (!product)
      return res.status(400).send({ message: "Unable to create product." });

    return res.send({ message: "Success", product });
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
