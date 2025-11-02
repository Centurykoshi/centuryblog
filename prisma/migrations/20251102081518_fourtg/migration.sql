/*
  Warnings:

  - You are about to drop the column `contentHTML` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `contentJSON` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `excerpt` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `featuredImg` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `published` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the `PostTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[accountId,providerId]` on the table `accounts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[identifier,value]` on the table `verifications` will be added. If there are existing duplicate values, this will fail.
  - Made the column `banned` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `verifications` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `verifications` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."PostTag" DROP CONSTRAINT "PostTag_postID_fkey";

-- DropForeignKey
ALTER TABLE "public"."PostTag" DROP CONSTRAINT "PostTag_tagID_fkey";

-- DropIndex
DROP INDEX "public"."posts_published_idx";

-- DropIndex
DROP INDEX "public"."posts_slug_idx";

-- DropIndex
DROP INDEX "public"."posts_slug_key";

-- DropIndex
DROP INDEX "public"."posts_status_idx";

-- DropIndex
DROP INDEX "public"."posts_userId_idx";

-- AlterTable
ALTER TABLE "accounts" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "posts" DROP COLUMN "contentHTML",
DROP COLUMN "contentJSON",
DROP COLUMN "excerpt",
DROP COLUMN "featuredImg",
DROP COLUMN "published",
DROP COLUMN "slug",
DROP COLUMN "status",
DROP COLUMN "title";

-- AlterTable
ALTER TABLE "sessions" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- Update existing NULL values to false before making column NOT NULL
UPDATE "users" SET "banned" = false WHERE "banned" IS NULL;

-- Update existing NULL values in verifications before making columns NOT NULL
UPDATE "verifications" SET "createdAt" = CURRENT_TIMESTAMP WHERE "createdAt" IS NULL;
UPDATE "verifications" SET "updatedAt" = CURRENT_TIMESTAMP WHERE "updatedAt" IS NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "emailVerified" SET DEFAULT false,
ALTER COLUMN "banned" SET NOT NULL,
ALTER COLUMN "banned" SET DEFAULT false;

-- AlterTable
ALTER TABLE "verifications" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updatedAt" SET NOT NULL;

-- DropTable
DROP TABLE "public"."PostTag";

-- DropTable
DROP TABLE "public"."Tag";

-- CreateTable
CREATE TABLE "documents" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "slug" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT,
    "contentJSON" JSONB NOT NULL,
    "contentHTML" TEXT NOT NULL,
    "featuredImg" TEXT,
    "status" "PostStatus" NOT NULL DEFAULT 'DRAFT',
    "published" TIMESTAMP(3),

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_tags" (
    "postId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "post_tags_pkey" PRIMARY KEY ("postId","tagId")
);

-- CreateIndex
CREATE UNIQUE INDEX "documents_slug_key" ON "documents"("slug");

-- CreateIndex
CREATE INDEX "documents_status_idx" ON "documents"("status");

-- CreateIndex
CREATE INDEX "documents_published_idx" ON "documents"("published");

-- CreateIndex
CREATE INDEX "documents_userId_idx" ON "documents"("userId");

-- CreateIndex
CREATE INDEX "documents_slug_idx" ON "documents"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_key" ON "tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tags_slug_key" ON "tags"("slug");

-- CreateIndex
CREATE INDEX "tags_name_idx" ON "tags"("name");

-- CreateIndex
CREATE INDEX "tags_slug_idx" ON "tags"("slug");

-- CreateIndex
CREATE INDEX "accounts_userId_idx" ON "accounts"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_accountId_providerId_key" ON "accounts"("accountId", "providerId");

-- CreateIndex
CREATE INDEX "sessions_token_idx" ON "sessions"("token");

-- CreateIndex
CREATE INDEX "sessions_userId_idx" ON "sessions"("userId");

-- CreateIndex
CREATE INDEX "sessions_expiresAt_idx" ON "sessions"("expiresAt");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "verifications_expiresAt_idx" ON "verifications"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "verifications_identifier_value_key" ON "verifications"("identifier", "value");

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_tags" ADD CONSTRAINT "post_tags_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_tags" ADD CONSTRAINT "post_tags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
