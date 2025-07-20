/*
  Warnings:

  - Made the column `buyerPhone` on table `Ticket` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `paymentStatus` on the `Ticket` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "ticketPrice" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "maxTickets" DROP NOT NULL,
ALTER COLUMN "maxTickets" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Ticket" ALTER COLUMN "buyerPhone" SET NOT NULL,
DROP COLUMN "paymentStatus",
ADD COLUMN     "paymentStatus" "PaymentStatus" NOT NULL;
