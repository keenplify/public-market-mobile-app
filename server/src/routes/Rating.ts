import { Image, Prisma, PrismaClient, Rating, User } from ".prisma/client";
import {
  authenticate,
  isCustomer,
  sendValidationErrors,
} from "@shared/functions";
import { Router } from "express";
import { body, param, query } from "express-validator";

const router = Router();
const prisma = new PrismaClient();

router.post(
  "/add",
  body("rating").notEmpty().isNumeric(),
  body("text").notEmpty().isString(),
  body("images").isArray(),
  body("productId").notEmpty().isNumeric(),
  sendValidationErrors,
  authenticate,
  isCustomer,
  async (req, res) => {
    const user = req.user as User;
    let rating: Rating | null;

    const pastRating = await prisma.rating.findFirst({
      where: {
        userId: user.id,
      },
    });

    if (pastRating) {
      const updated = await prisma.rating.updateMany({
        data: {
          text: req.body.text,
          rating: req.body.rating,
          productId: req.body.productId,
        },
        where: {
          id: pastRating.id,
        },
      });

      rating = await prisma.rating.findFirst({
        where: {
          userId: user.id,
        },
      });
    }

    rating = await prisma.rating.create({
      data: {
        text: req.body.text,
        rating: req.body.rating,
        productId: req.body.productId,
        userId: user.id,
      },
      include: {
        product: true,
      },
    });

    if (!rating || typeof rating === null || rating === null)
      return res.status(400).send({ message: "Unable to create a rating." });

    await prisma.image.updateMany({
      where: {
        OR: req.body.images.map((id: number) => ({ id })),
      },
      data: {
        ratingId: rating?.id,
      },
    });

    //@ts-ignore
    const userId: number = rating.product.sellerId;

    // create notification to seller
    await prisma.notification.create({
      data: {
        userId,
        description: `User ${user.username} has rated your product ${rating.rating}/5.`,
        title: `Rating`,
        type: "REVIEW",
        referencedId: rating.id,
      },
    });

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
  body("images").optional().isArray(),
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

    const promises: Prisma.Prisma__ImageClient<Image>[] = [];

    req.body.images &&
      req.body.images.forEach(async (imgId: number) => {
        promises.push(
          prisma.image.update({
            where: {
              id: imgId,
            },
            data: {
              ratingId: rating.id,
            },
          })
        );
      });

    await Promise.all(promises);

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

router.get(
  "/cursorpaginate",
  query("cursor").optional().isNumeric(),
  query("productId").isNumeric(),
  sendValidationErrors,
  authenticate,
  async (req, res) => {
    let user = req.user as User;
    let cursor = Number.parseInt(req.query.cursor as string);
    let sellerId;
    let last: Rating[] = [];
    const where = {
      productId:
        typeof req.query.productId === "number" ||
        typeof req.query.productId === "string"
          ? Number.parseInt(req.query.productId)
          : undefined,
    };
    const include = {
      images: true,
      user: true,
    };
    if (user.type === "SELLER") sellerId = user.id;
    if (!req.query.cursor) {
      last = await prisma.rating.findMany({
        where,
        take: 1,
        include,
        orderBy: { createdAt: "desc" },
      });

      //Check if any product found
      if (last.length === 0)
        return res.send({
          message: "No ratings found",
          ratings: [],
          count: 0,
          nextId: false,
        });

      cursor = last[0].id;
    }

    const ratings = await prisma.rating.findMany({
      take: 5,
      skip: 1,
      cursor: {
        id: cursor,
      },
      orderBy: {
        id: "desc",
      },
      include,
    });

    const count = await prisma.product.count();

    if (ratings.length === 0)
      return res.send({
        message: "Success",
        ratings: [...last, ...ratings],
        count,
        nextId: false,
      });

    const nextId = ratings[ratings.length - 1].id;

    return res.send({
      message: "Success",
      ratings: [...last, ...ratings],
      count,
      nextId,
    });
  }
);

export default router;
