/*
  Warnings:

  - You are about to drop the column `isDone` on the `Todo` table. All the data in the column will be lost.
  - Made the column `priority` on table `Todo` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Todo" DROP COLUMN "isDone",
ADD COLUMN     "progression" "Progression" NOT NULL DEFAULT E'TODO',
ALTER COLUMN "priority" SET NOT NULL;
