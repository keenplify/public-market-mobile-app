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
import { send } from "process";

const userRouter = Router();
const prisma = new PrismaClient();

userRouter.post(
  "/add",
  body("email").isEmail(),
  body("number").isString(),
  body("password").isString().isLength({ min: 5 }),
  body("gender").isString(),
  body("type").isString(),
  body("username").isString(),
  sendValidationErrors,
  async (req, res) => {
    req.body;
    const user = await prisma.user.create({
      data: {
        email: req.body.email,
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
      logger.info(`User ${user.id} created.`);
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

export default userRouter;
