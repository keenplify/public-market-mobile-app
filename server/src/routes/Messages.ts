import { Router } from "express";
import { Message, PrismaClient, User } from ".prisma/client";
import { body, query } from "express-validator";
import {
  authenticate,
  isCustomer,
  sendValidationErrors,
} from "@shared/functions";

const router = Router();
const prisma = new PrismaClient();

router.post(
  "/add",
  body("message").isString().notEmpty(),
  body("toId").isNumeric(),
  body("images").isArray(),
  authenticate,
  async (req, res) => {
    const user = req.user as User;

    const newMessage = await prisma.message.create({
      data: {
        message: req.body.message,
        toId: req.body.toId,
        fromId: user.id,
      },
    });

    await prisma.image.updateMany({
      where: {
        OR: req.body.images.map((id: number) => ({ id })),
      },
      data: {
        messageId: newMessage.id,
      },
    });

    await prisma.notification.create({
      data: {
        userId: newMessage.toId,
        description: `Message: ${newMessage.message.replace(/\n/g, " ")}`,
        title: `Message from ${user.username}`,
        type: "MESSAGE",
        referencedId: user.id,
      },
    });

    res.send({ message: "Success", newMessage });
  }
);

router.get("/all", authenticate, async (req, res) => {
  let user = req.user as User;

  const messages = await prisma.message.findMany({
    where: {
      OR: [
        {
          fromId: user.id,
        },
        {
          toId: user.id,
        },
      ],
    },
    include: {
      from: true,
      images: true,
      to: true,
    },
    orderBy: {
      id: "desc",
    },
  });

  res.send({ message: "Success", messages });
});

router.get(
  "/cursorpaginate",
  query("cursor").optional().isNumeric(),
  query("toId").isNumeric(),
  sendValidationErrors,
  authenticate,
  async (req, res) => {
    let user = req.user as User;
    let cursor = Number.parseInt(req.query.cursor as string);

    let last: Message[] = [];

    const toId =
      typeof req.query.toId === "string" || typeof req.query.toId === "number"
        ? Number.parseInt(req.query.toId)
        : undefined;

    if (!toId) return res.status(500).send();
    const where = {
      fromId: {
        in: [user.id, toId],
      },
      toId: {
        in: [user.id, toId],
      },
    };
    const include = {
      images: true,
      from: true,
      to: true,
    };

    if (!req.query.cursor) {
      last = await prisma.message.findMany({
        where,
        take: 1,
        include,
        orderBy: { id: "desc" },
      });

      //Check if any messages found
      if (last.length === 0)
        return res.send({
          message: "No messages found",
          messages: [],
          count: 0,
          nextId: false,
        });

      cursor = last[0].id;
    }

    const messages = await prisma.message.findMany({
      take: 5,
      skip: 1,
      cursor: {
        id: cursor,
      },
      // orderBy: {
      //   id: "desc",
      // },
      include,
      orderBy: { id: "desc" },
      where,
    });

    const count = await prisma.message.count();

    if (messages.length === 0)
      return res.send({
        message: "Success",
        messages: [...last, ...messages],
        count,
        nextId: false,
      });

    const nextId = messages[messages.length - 1].id;

    return res.send({
      message: "Success",
      messages: [...last, ...messages],
      count,
      nextId,
    });
  }
);

export default router;
