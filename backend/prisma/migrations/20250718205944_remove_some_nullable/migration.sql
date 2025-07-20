/*
  Warnings:

  - Made the column `description` on table `Event` required. This step will fail if there are existing NULL values in that column.
  - Made the column `imageUrl` on table `Event` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `Organization` required. This step will fail if there are existing NULL values in that column.
  - Made the column `logoUrl` on table `Organization` required. This step will fail if there are existing NULL values in that column.
  - Made the column `address` on table `Organization` required. This step will fail if there are existing NULL values in that column.
  - Made the column `websiteUrl` on table `Organization` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "imageUrl" SET NOT NULL;

-- AlterTable
ALTER TABLE "Organization" ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "logoUrl" SET NOT NULL,
ALTER COLUMN "address" SET NOT NULL,
ALTER COLUMN "websiteUrl" SET NOT NULL;
