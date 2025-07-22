/*
  Warnings:

  - Added the required column `isMale` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isSustian` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "isMale" BOOLEAN NOT NULL,
ADD COLUMN     "isSustian" BOOLEAN NOT NULL;
