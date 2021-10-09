import { PrismaClient, User } from ".prisma/client";
import { authenticate, sendValidationErrors } from "@shared/functions";
import logger from "@shared/Logger";
import { Router } from "express";
import { body, param, query } from "express-validator";
import ImgbbClient from "imgbb";
import multer, { memoryStorage } from "multer";

const router = Router();
const prisma = new PrismaClient();
const upload = multer({
  storage: memoryStorage(),
  limits: {
    fields: 1,
    fileSize: 10485760,
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
});

let imgbbClient = new ImgbbClient({
  token: process.env.IMGBB_KEY!,
});

router.post(
  "/add",
  authenticate,
  query("productId").isNumeric(),
  sendValidationErrors,
  upload.single("image"),
  async (req, res) => {
    const user = req.user as User;
    console.log(req.query);
    try {
      if (!req.file) return res.status(403).send({ message: "Invalid image!" });
      const imgbb = await imgbbClient.upload({
        image: req.file?.buffer,
      });

      if (!imgbb.success)
        return res
          .status(500)
          .send({ message: "Unable to upload to hosting!" });

      const image = await prisma.image.create({
        data: {
          url: imgbb.data.url,
          thumbUrl: imgbb.data.thumb.url,
          ownerId: user.id,
          productId: req.query.productId
            ? Number.parseInt(req.query.productId as any)
            : undefined,
        },
      });

      res.send({ message: "Successful", imgbb, image });
    } catch (error) {
      logger.warn({ message: "Adding Image Failed!", error });
      res.status(500).send(error);
    }
  }
);

router.delete(
  "/:id",
  param("id").isNumeric(),
  sendValidationErrors,
  authenticate,
  async (req, res) => {
    const user = req.user as User;
    const image = await prisma.image.findFirst({
      where: {
        id: Number.parseInt(req.params?.id),
      },
    });

    if (!image) return res.status(404).send({ message: "Image not found!" });

    if (image?.ownerId !== user.id && user.type !== "ADMIN")
      return res
        .status(403)
        .send({ message: "You cannot delete an image you do not own!" });

    const deleteImage = await prisma.image.delete({
      where: {
        id: image.id,
      },
    });

    if (!deleteImage)
      return res.status(500).send({ message: "Unable to delete image!" });

    return res.send({ message: "Image deleted successfully." });
  }
);

router.get(
  "/:id",
  param("id").isNumeric(),
  sendValidationErrors,
  async (req, res) => {
    const image = await prisma.image.findFirst({
      where: {
        id: Number.parseInt(req.params.id),
      },
    });

    if (!image) return res.status(404).send({ message: "Image not found!" });

    return res.send({ message: "Success", image });
  }
);

export default router;
