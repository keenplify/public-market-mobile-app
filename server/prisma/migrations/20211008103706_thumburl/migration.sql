/*
  Warnings:

  - Added the required column `thumbUrl` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "thumbUrl" TEXT NOT NULL;
