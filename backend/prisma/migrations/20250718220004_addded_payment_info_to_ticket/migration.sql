/*
  Warnings:

  - Added the required column `paymentId` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentMethod` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentStatus` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "paymentId" TEXT NOT NULL,
ADD COLUMN     "paymentMethod" TEXT NOT NULL,
ADD COLUMN     "paymentStatus" TEXT NOT NULL;
