import { PrismaClient, User } from ".prisma/client";
import { authenticate, sendValidationErrors } from "@shared/functions";
import logger from "@shared/Logger";
import { Router } from "express";
import { body, param, query } from "express-validator";
import ImgbbClient from "imgbb";
import multer, { memoryStorage } from "multer";
//@ts-ignore
import FreeImageJS from "freeimage.js";

const router = Router();
const prisma = new PrismaClient();

const upload = multer({
  storage: multer.diskStorage({
    destination: "./static/uploaded",
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
    },
  }),
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

const fihClient = new FreeImageJS({
  key: process.env.FIH_KEY,
});

router.post(
  "/add",
  authenticate,
  query("productId").optional().isNumeric(),
  sendValidationErrors,
  upload.single("image"),
  async (req, res) => {
    const user = req.user as User;
    // let extracted;

    if (!req.file) return res.status(403).send({ message: "Invalid image!" });

    // try {
    //   const fih = await fihClient.upload(
    //     Buffer.from(req.file.buffer).toString("base64")
    //   );
    //   extracted = {
    //     url: fih.data.image.url,
    //     thumbUrl: fih.data.thumb.url,
    //     success: fih.success,
    //   };
    // } catch (error1) {
    //   console.log({ message: "Adding Image Failed!", error1 });
    //   try {
    //     const imgbb = await imgbbClient.upload({
    //       image: req.file?.buffer,
    //     });
    //     extracted = {
    //       url: imgbb.data.url,
    //       thumbUrl: imgbb.data.thumb.url,
    //       success: imgbb.success,
    //     };
    //   } catch (error2) {
    //     console.log({ message: "Adding Image Failed!", error2 });
    //     res.status(500).send({ error1, error2 });
    //   }
    // }

    // if (!extracted?.success)
    //   return res.status(500).send({ message: "Unable to upload to hosting!" });

    const image = await prisma.image.create({
      data: {
        // url: extracted.url,
        // thumbUrl: extracted.thumbUrl,
        url: req.file.path,
        thumbUrl: req.file.path,
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
