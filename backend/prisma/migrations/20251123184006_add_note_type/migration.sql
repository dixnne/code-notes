-- DropIndex
DROP INDEX "User_username_key";

-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'markdown',
ALTER COLUMN "content" SET DEFAULT '';
