import { PrismaClient, User } from ".prisma/client";
import { authenticate, sendValidationErrors } from "@shared/functions";
import logger from "@shared/Logger";
import { Router } from "express";
import { body, param, query } from "express-validator";
import ImgbbClient from "imgbb";
import multer, { memoryStorage } from "multer";
import { FileFilter, upload } from "@shared/multer";
import path from "path";
import { getFileStream } from "@shared/aws";

const router = Router();
const prisma = new PrismaClient();

const fileFilter: FileFilter = (req, file, cb) => {
  if (file.size > 1024 * 1024 * 5) {
    console.log("too much");
    return cb(new Error("We dont accept file size more than 5mb"));
  }

  var ext = path.extname(file.originalname);
  if (ext !== ".png" && ext !== ".jpg" && ext !== ".gif" && ext !== ".jpeg") {
    return cb(new Error("Only images are allowed"));
  }
  cb(null, true);
};

// const upload = multer({
//   storage: multer.diskStorage({
//     destination: "./static/uploaded",
//     filename: (req, file, cb) => {
//       cb(null, Date.now() + "-" + file.originalname);
//     },
//   }),
//   limits: {
//     fields: 1,
//     fileSize: 10485760,
//   },
//   fileFilter: (req, file, cb) => {
//     if (
//       file.mimetype == "image/png" ||
//       file.mimetype == "image/jpg" ||
//       file.mimetype == "image/jpeg"
//     ) {
//       cb(null, true);
//     } else {
//       cb(null, false);
//       return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
//     }
//   },
// });

// let imgbbClient = new ImgbbClient({
//   token: process.env.IMGBB_KEY!,
// });

// const fihClient = new FreeImageJS({
//   key: process.env.FIH_KEY,
// });

router.post(
  "/add",
  authenticate,
  query("productId").optional().isNumeric(),
  sendValidationErrors,
  upload({ fileFilter }).single("image"),
  async (req, res) => {
    const user = req.user as User;
    // let extracted;

    if (!req.file) return res.status(403).send({ message: "Invalid image!" });

    const file = req.file as any;

    const image = await prisma.image.create({
      data: {
        url: file.key,
        thumbUrl: file.key,
        ownerId: user.id,
        productId: req.query.productId
          ? Number.parseInt(req.query.productId as any)
          : undefined,
      },
    });

    res.send({ message: "Successful", image });
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

    return res.send({ message: "Success." });
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

router.get(
  "/file/:id",
  param("id").isNumeric(),
  sendValidationErrors,
  async (req, res) => {
    const image = await prisma.image.findFirst({
      where: {
        id: req.params.id ? Number.parseInt(req.params.id) : undefined,
      },
    });

    if (!image) return res.status(404).send();

    return getFileStream(image.url).pipe(res);
  }
);

export default router;
