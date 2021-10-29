import { Router } from "express";
import { Message, Notification, PrismaClient, User } from ".prisma/client";
import { body, param, query } from "express-validator";
import { authenticate, sendValidationErrors } from "@shared/functions";

const router = Router();
const prisma = new PrismaClient();

router.get("/all", authenticate, async (req, res) => {
  let user = req.user as User;

  const notifications = await prisma.notification.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  res.send({ message: "Success", notifications });
});

router.get(
  "/cursorpaginate",
  query("cursor").optional().isNumeric(),
  sendValidationErrors,
  authenticate,
  async (req, res) => {
    let user = req.user as User;
    let cursor = Number.parseInt(req.query.cursor as string);

    let last: Notification[] = [];

    const where = {
      userId: user.id,
    };

    if (!req.query.cursor) {
      last = await prisma.notification.findMany({
        where,
        take: 1,
        orderBy: { id: "desc" },
      });

      //Check if any notifications found
      if (last.length === 0)
        return res.send({
          message: "No notifications found",
          notification: [],
          count: 0,
          nextId: false,
        });

      cursor = last[0].id;
    }

    const notifications = await prisma.notification.findMany({
      take: 5,
      skip: 1,
      cursor: {
        id: cursor,
      },
      orderBy: { id: "desc" },
      where,
    });

    if (notifications.length === 0)
      return res.send({
        message: "Success",
        notifications: [...last, ...notifications],
        nextId: false,
      });

    const nextId = notifications[notifications.length - 1].id;

    return res.send({
      message: "Success",
      notifications: [...last, ...notifications],
      nextId,
    });
  }
);

router.put(
  "/:id",
  param("id").isNumeric(),
  sendValidationErrors,
  authenticate,
  async (req, res) => {
    const user = req.user as User;

    const notification = await prisma.notification.update({
      where: {
        id:
          typeof req.params.id === "number" || typeof req.params.id === "string"
            ? Number.parseInt(req.params.id)
            : undefined,
      },
      data: {
        read: true,
      },
    });

    return res.send({ message: "Success", notification });
  }
);

export default router;
