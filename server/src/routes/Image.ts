import { PrismaClient } from ".prisma/client";
import { Router } from "express";
import { body } from "express-validator";
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
});

let imgbbClient = new ImgbbClient({
  token: process.env.IMGBB_KEY!,
});

router.post(
  "/add",
  body("productId").notEmpty().isString(),
  upload.single("image"),
  async (req, res) => {
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
        },
      });

      res.send({ message: "Successful", imgbb, image });
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

export default router;
