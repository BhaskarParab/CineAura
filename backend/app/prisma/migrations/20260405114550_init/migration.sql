/*
  Warnings:

  - You are about to alter the column `rating` on the `Review` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `SmallInt`.
  - A unique constraint covering the columns `[userId,tmdbId,mediaType]` on the table `Review` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `mediaType` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('MOVIE', 'TV');

-- DropIndex
DROP INDEX "Review_userId_tmdbId_key";

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "mediaType" "MediaType" NOT NULL,
ALTER COLUMN "rating" SET DATA TYPE SMALLINT;

-- CreateIndex
CREATE INDEX "Review_tmdbId_mediaType_idx" ON "Review"("tmdbId", "mediaType");

-- CreateIndex
CREATE UNIQUE INDEX "Review_userId_tmdbId_mediaType_key" ON "Review"("userId", "tmdbId", "mediaType");
