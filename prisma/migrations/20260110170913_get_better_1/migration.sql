/*
  Warnings:

  - You are about to drop the `tags` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Tag" AS ENUM ('All', 'Tech', 'LifeStyle', 'Travel', 'Games');

-- DropForeignKey
ALTER TABLE "public"."post_tags" DROP CONSTRAINT "post_tags_tagId_fkey";

-- AlterTable
ALTER TABLE "documents" ADD COLUMN     "Tag" "Tag" NOT NULL DEFAULT 'All';

-- DropTable
DROP TABLE "public"."tags";
