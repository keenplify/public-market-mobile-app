/*
  Warnings:

  - The `gender` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `type` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Genders" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "UserTypes" AS ENUM ('ADMIN', 'CUSTOMER', 'SELLER');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "gender",
ADD COLUMN     "gender" "Genders" NOT NULL DEFAULT E'MALE',
DROP COLUMN "type",
ADD COLUMN     "type" "UserTypes" NOT NULL DEFAULT E'CUSTOMER';
