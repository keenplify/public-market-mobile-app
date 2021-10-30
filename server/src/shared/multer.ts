import multerS3 from "multer-s3";
import dotenv from "dotenv";
import crypto from "crypto";
import { s3 } from "./aws";
import multer, { FileFilterCallback, Multer } from "multer";
import path from "path";
import { Request } from "express";

dotenv.config();
export const bucketName = process.env.AWS_BUCKET_NAME;

export type FileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => void;
interface UploadParams {
  fileFilter?: FileFilter;
}

/* Multer driver with S3 bucket as storage*/
export const upload = ({ fileFilter }: UploadParams) =>
  multer({
    storage: multerS3({
      s3: s3,
      bucket: bucketName!,
      metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
      },
      key: function (req, file, cb) {
        cb(
          null,
          `${Date.now().toString()}-${crypto.randomBytes(64).toString("hex")}`
        );
      },
    }),
    fileFilter,
  });
