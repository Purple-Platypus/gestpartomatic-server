/*
  Warnings:

  - You are about to drop the column `teamId` on the `Board` table. All the data in the column will be lost.
  - You are about to drop the column `teamId` on the `Tag` table. All the data in the column will be lost.
  - You are about to drop the `Team` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TeamsOnUsers` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `creatorId` to the `Board` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Progression" AS ENUM ('TODO', 'IN_PROGRESS', 'DONE');

-- DropForeignKey
ALTER TABLE "Board" DROP CONSTRAINT "Board_teamId_fkey";

-- DropForeignKey
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_teamId_fkey";

-- DropForeignKey
ALTER TABLE "TeamsOnUsers" DROP CONSTRAINT "TeamsOnUsers_teamId_fkey";

-- DropForeignKey
ALTER TABLE "TeamsOnUsers" DROP CONSTRAINT "TeamsOnUsers_userId_fkey";

-- AlterTable
ALTER TABLE "Board" DROP COLUMN "teamId",
ADD COLUMN     "creatorId" TEXT NOT NULL,
ADD COLUMN     "isPrivate" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "List" ADD COLUMN     "progression" "Progression" NOT NULL DEFAULT E'TODO';

-- AlterTable
ALTER TABLE "Tag" DROP COLUMN "teamId";

-- AlterTable
ALTER TABLE "Todo" ALTER COLUMN "priority" DROP NOT NULL;

-- DropTable
DROP TABLE "Team";

-- DropTable
DROP TABLE "TeamsOnUsers";

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "UsersOnBoards" (
    "userId" TEXT NOT NULL,
    "boardId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "UsersOnBoards_pkey" PRIMARY KEY ("userId","boardId")
);

-- AddForeignKey
ALTER TABLE "Board" ADD CONSTRAINT "Board_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersOnBoards" ADD CONSTRAINT "UsersOnBoards_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersOnBoards" ADD CONSTRAINT "UsersOnBoards_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
