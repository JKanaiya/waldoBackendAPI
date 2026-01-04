/*
  Warnings:

  - Made the column `pictureId` on table `Character` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Character" DROP CONSTRAINT "Character_pictureId_fkey";

-- AlterTable
ALTER TABLE "Character" ALTER COLUMN "pictureId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_pictureId_fkey" FOREIGN KEY ("pictureId") REFERENCES "Picture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
