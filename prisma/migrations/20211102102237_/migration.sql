/*
  Warnings:

  - You are about to drop the `UsersOnTodos` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UsersOnTodos" DROP CONSTRAINT "UsersOnTodos_todoId_fkey";

-- DropForeignKey
ALTER TABLE "UsersOnTodos" DROP CONSTRAINT "UsersOnTodos_userId_fkey";

-- AlterTable
ALTER TABLE "Todo" ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "todoId" INTEGER;

-- DropTable
DROP TABLE "UsersOnTodos";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_todoId_fkey" FOREIGN KEY ("todoId") REFERENCES "Todo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Todo" ADD CONSTRAINT "Todo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
