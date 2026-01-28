/*
  Warnings:

  - Made the column `excerpt` on table `documents` required. This step will fail if there are existing NULL values in that column.
  - Made the column `featuredImg` on table `documents` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "documents" ALTER COLUMN "excerpt" SET NOT NULL,
ALTER COLUMN "excerpt" SET DEFAULT 'SOMETHING...',
ALTER COLUMN "featuredImg" SET NOT NULL;
