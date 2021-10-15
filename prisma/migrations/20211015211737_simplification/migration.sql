/*
  Warnings:

  - You are about to drop the column `deletedAt` on the `Board` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `List` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Todo` table. All the data in the column will be lost.
  - You are about to drop the column `milestoneId` on the `Todo` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `UsersOnBoards` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `UsersOnTodos` table. All the data in the column will be lost.
  - You are about to drop the `Comment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Milestone` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TagsOnTodos` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_todoId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_userId_fkey";

-- DropForeignKey
ALTER TABLE "List" DROP CONSTRAINT "List_boardId_fkey";

-- DropForeignKey
ALTER TABLE "TagsOnTodos" DROP CONSTRAINT "TagsOnTodos_tagId_fkey";

-- DropForeignKey
ALTER TABLE "TagsOnTodos" DROP CONSTRAINT "TagsOnTodos_todoId_fkey";

-- DropForeignKey
ALTER TABLE "Todo" DROP CONSTRAINT "Todo_milestoneId_fkey";

-- AlterTable
ALTER TABLE "Board" DROP COLUMN "deletedAt";

-- AlterTable
ALTER TABLE "List" DROP COLUMN "deletedAt";

-- AlterTable
ALTER TABLE "Todo" DROP COLUMN "deletedAt",
DROP COLUMN "milestoneId";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "deletedAt";

-- AlterTable
ALTER TABLE "UsersOnBoards" DROP COLUMN "deletedAt";

-- AlterTable
ALTER TABLE "UsersOnTodos" DROP COLUMN "deletedAt";

-- DropTable
DROP TABLE "Comment";

-- DropTable
DROP TABLE "Milestone";

-- DropTable
DROP TABLE "Tag";

-- DropTable
DROP TABLE "TagsOnTodos";

-- AddForeignKey
ALTER TABLE "List" ADD CONSTRAINT "List_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;
