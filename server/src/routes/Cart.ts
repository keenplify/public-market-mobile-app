import { CartItem, PrismaClient, User } from ".prisma/client";
import {
  authenticate,
  isCustomer,
  sendValidationErrors,
} from "@shared/functions";
import { Router } from "express";
import { body, param } from "express-validator";

const cartRouter = Router();
const prisma = new PrismaClient();

cartRouter.post(
  "/add",
  body("productId").isNumeric(),
  body("quantity").isNumeric(),
  sendValidationErrors,
  authenticate,
  isCustomer,
  async (req, res) => {
    const user = req.user as User;
    try {
      //check if cartitem already exists. if it does, increment quantity.
      const _cartItem = await prisma.cartItem.findFirst({
        where: {
          customerId: user.id,
          productId: Number.parseInt(req.body.productId),
        },
      });
      var cartItem: CartItem;

      if (_cartItem) {
        cartItem = await prisma.cartItem.update({
          where: {
            id: _cartItem.id,
          },
          data: {
            quantity: _cartItem.quantity + Number.parseInt(req.body.quantity),
          },
        });
      } else {
        cartItem = await prisma.cartItem.create({
          data: {
            quantity: Number.parseInt(req.body.quantity),
            customerId: user.id,
            productId: Number.parseInt(req.body.productId),
          },
        });
      }

      if (!cartItem)
        return res.status(500).send({ message: "Unable to create cart item." });

      return res.send({ message: "Successful", cartItem });
    } catch (error) {
      return res.status(500).send({ message: "Error", error });
    }
  }
);

cartRouter.get("/all", authenticate, isCustomer, async (req, res) => {
  const user = req.user as User;

  try {
    const cartItems = await prisma.cartItem.findMany({
      where: {
        customerId: user.id,
      },
      include: {
        product: true,
      },
    });

    return res.send({
      message: "Successful",
      cartItems,
    });
  } catch (error) {
    return res.status(500).send({ message: "Error", error });
  }
});

cartRouter.delete(
  "/:id",
  param("id").isNumeric(),
  authenticate,
  isCustomer,
  async (req, res) => {
    try {
      const cartItem = await prisma.cartItem.delete({
        where: {
          id: Number.parseInt(req.params.id),
        },
      });

      if (!cartItem)
        return res.status(500).send({ message: "Unable to delete cart item." });

      return res.send({ message: "Cart item deleted successfully." });
    } catch (error) {
      return res.status(500).send({ message: "Error", error });
    }
  }
);

export default cartRouter;
