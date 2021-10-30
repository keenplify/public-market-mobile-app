import S3 from "aws-sdk/clients/s3";
import fs from "fs";
import dotenv from "dotenv";
import AWS from "aws-sdk";

dotenv.config();

AWS.config.update({
  credentials: {
    accessKeyId: process.env.AWS_CREDENTIALS_ID!,
    secretAccessKey: process.env.AWS_CREDENTIALS_SECRET!,
  },
});

export const s3 = new AWS.S3({ region: process.env.AWS_BUCKET_REGION });

/**
 * Fetches file of key in `AWS_BUCKET_NAME` bucket and creating read stream on it.
 */
export function getFileStream(fileKey: string) {
  return s3
    .getObject({
      Key: fileKey,
      Bucket: process.env.AWS_BUCKET_NAME!,
    })
    .createReadStream();
}

/**
 * Requests delete file of key to AWS S3 server in `AWS_BUCKET_NAME` bucket.
 */
export function deleteFile(fileKey: string) {
  return s3
    .deleteObject({
      Key: fileKey,
      Bucket: process.env.AWS_BUCKET_NAME!,
    })
    .promise();
}
