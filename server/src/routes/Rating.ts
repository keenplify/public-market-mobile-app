import { PrismaClient, User } from ".prisma/client";
import {
  authenticate,
  isCustomer,
  sendValidationErrors,
} from "@shared/functions";
import { Router } from "express";
import { body, param } from "express-validator";

const router = Router();
const prisma = new PrismaClient();

router.post(
  "/add",
  body("rating").notEmpty().isNumeric(),
  body("text").notEmpty().isString(),
  body("productId").notEmpty().isNumeric(),
  sendValidationErrors,
  authenticate,
  isCustomer,
  async (req, res) => {
    const user = req.user as User;

    const rating = await prisma.rating.create({
      data: {
        text: req.body.text,
        rating: req.body.ratin,
        productId: req.body.productId,
        userId: user.id,
      },
    });

    if (!rating)
      return res.status(400).send({ message: "Unable to create a rating." });

    res.send({
      message: "Success",
      rating,
    });
  }
);

/*
 * Edit rating
 */
router.put(
  "/:id",

  body("rating").optional().notEmpty().isNumeric(),
  body("text").optional().notEmpty().isString(),
  body("productId").optional().notEmpty().isNumeric(),
  authenticate,
  async (req, res) => {
    const rating = await prisma.rating.update({
      where: {
        id: Number.parseInt(req.params?.id),
      },
      data: {
        rating: req.body.rating,
        text: req.body.text,
        productId: req.body.productId,
      },
    });

    if (!rating)
      return res.status(404).send({ message: "Unable to update rating." });

    return res.send({
      message: "Success",
      rating,
    });
  }
);

router.delete(
  "/:id",
  param("id").isNumeric(),
  authenticate,
  async (req, res) => {
    const rating = await prisma.rating.delete({
      where: {
        id: req.params?.id,
      },
    });

    res.send({
      message: "Successfully deleted " + req.params?.id,
      rating,
    });
  }
);

export default router;
