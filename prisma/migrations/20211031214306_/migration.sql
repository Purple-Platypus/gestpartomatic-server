/*
  Warnings:

  - Added the required column `isDark` to the `Tag` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tag" ADD COLUMN     "isDark" BOOLEAN NOT NULL;
