-- AlterTable
ALTER TABLE "UserData" ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "googleId" TEXT,
ALTER COLUMN "password" DROP NOT NULL;
