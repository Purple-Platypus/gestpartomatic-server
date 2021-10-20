-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "UsersOnBoards" ADD COLUMN     "role" "Role" NOT NULL DEFAULT E'USER';
