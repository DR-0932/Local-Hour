-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Admin', 'normie');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role";
