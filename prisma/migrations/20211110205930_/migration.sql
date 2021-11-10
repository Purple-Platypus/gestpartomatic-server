/*
  Warnings:

  - You are about to drop the column `userId` on the `Todo` table. All the data in the column will be lost.
  - You are about to drop the column `todoId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Todo" DROP CONSTRAINT "Todo_userId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_todoId_fkey";

-- AlterTable
ALTER TABLE "Todo" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "todoId";

-- CreateTable
CREATE TABLE "_assignation" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_assignation_AB_unique" ON "_assignation"("A", "B");

-- CreateIndex
CREATE INDEX "_assignation_B_index" ON "_assignation"("B");

-- AddForeignKey
ALTER TABLE "_assignation" ADD FOREIGN KEY ("A") REFERENCES "Todo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_assignation" ADD FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
