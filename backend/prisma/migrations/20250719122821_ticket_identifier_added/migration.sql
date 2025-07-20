/*
  Warnings:

  - A unique constraint covering the columns `[identifier]` on the table `Ticket` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `identifier` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "identifier" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_identifier_key" ON "Ticket"("identifier");
