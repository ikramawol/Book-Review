/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Report` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."ReportStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'REMOVED');

-- AlterTable
ALTER TABLE "public"."Report" DROP COLUMN "updatedAt",
ADD COLUMN     "actionTaken" TEXT,
ADD COLUMN     "status" "public"."ReportStatus" NOT NULL DEFAULT 'PENDING';
