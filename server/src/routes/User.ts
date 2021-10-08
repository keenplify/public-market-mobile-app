import { PrismaClient, User } from ".prisma/client";
import {
  authenticate,
  createJWT,
  sendValidationErrors,
} from "@shared/functions";
import { Router } from "express";
import { body, param } from "express-validator";
import bcrypt from "bcrypt";
import logger from "@shared/Logger";

const userRouter = Router();
const prisma = new PrismaClient();

userRouter.post(
  "/add",
  body("email").not().isEmpty().isEmail(),
  body("number").not().isEmpty().isString(),
  body("password").not().isEmpty().isString().isLength({ min: 5 }),
  body("gender").not().isEmpty().isString(),
  body("type").not().isEmpty().isString(),
  body("name").not().isEmpty().isString(),
  body("username").not().isEmpty().isString(),
  sendValidationErrors,
  async (req, res) => {
    req.body;
    const user = await prisma.user.create({
      data: {
        email: req.body.email,
        name: req.body.name,
        number: req.body.number,
        username: req.body.username,
        password: await bcrypt.hash(
          req.body.password,
          await bcrypt.genSalt(10)
        ),
        gender: req.body.gender,
        type: req.body.type,
      },
    });

    if (user) {
      var token = createJWT(user);
      res.send({ message: "User successfully created.", token, user });
    }
  }
);

userRouter.get("/me", authenticate, async (req, res) => {
  const user = req.user as User;

  const { password, ...dUser } = user;

  return res.send({
    message: "User found",
    user: dUser,
  });
});

userRouter.post(
  "/login",
  body("username").isString(),
  body("password").isString(),
  sendValidationErrors,
  async (req, res) => {
    const user = await prisma.user.findFirst({
      where: {
        username: req.body.username,
      },
    });

    if (!user) {
      return res.send({ message: "User not found." });
    }

    if (!(await bcrypt.compare(req.body.password, user.password)))
      return res.send({ message: "Wrong password." });

    var token = createJWT(user);
    res.send({ message: "Successful", token, user });
  }
);

userRouter.get(
  "/:id",
  param("id").isNumeric(),
  sendValidationErrors,
  async (req, res) => {
    const user = await prisma.user.findFirst({
      where: {
        id: Number.parseInt(req.params.id),
      },
    });

    if (!user) {
      return res
        .status(404)
        .send({ message: `User with id ${req.params.id} is not found.` });
    }

    const { password, ...dUser } = user;

    return res.send({
      message: "User found",
      user: dUser,
    });
  }
);

/*
 * Admin can delete any user but user can only delete itself
 */
userRouter.delete(
  "/:id",
  authenticate,
  param("id").isNumeric(),
  async (req, res) => {
    const user = req.user as User;

    if (user.type === "ADMIN") {
      prisma.user.delete({
        where: {
          id: Number.parseInt(req.params?.id),
        },
      });
    }

    const user2 = await prisma.user.findFirst({
      where: {
        id: Number.parseInt(req.params?.id),
      },
    });

    if (user.id !== user2?.id)
      return res.status(403).send({
        message: "You have no privilege to delete user " + user2?.id,
      });

    await prisma.user.delete({
      where: {
        id: user.id,
      },
    });

    return res.send({
      message: "User deleted successfully.",
    });
  }
);

export default userRouter;
