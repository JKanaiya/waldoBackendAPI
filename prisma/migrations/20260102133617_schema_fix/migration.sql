/*
  Warnings:

  - You are about to drop the column `dimensionId` on the `Character` table. All the data in the column will be lost.
  - You are about to drop the `Coords` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `characterId` to the `Dimension` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Dimension` table without a default value. This is not possible if the table is not empty.
  - Added the required column `range` to the `Dimension` table without a default value. This is not possible if the table is not empty.
  - Added the required column `x` to the `Dimension` table without a default value. This is not possible if the table is not empty.
  - Added the required column `y` to the `Dimension` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Character" DROP CONSTRAINT "Character_dimensionId_fkey";

-- DropForeignKey
ALTER TABLE "Coords" DROP CONSTRAINT "Coords_dimensionId_fkey";

-- AlterTable
ALTER TABLE "Character" DROP COLUMN "dimensionId",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Character_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Dimension" ADD COLUMN     "characterId" INTEGER NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "range" INTEGER NOT NULL,
ADD COLUMN     "x" INTEGER NOT NULL,
ADD COLUMN     "y" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Coords";

-- AddForeignKey
ALTER TABLE "Dimension" ADD CONSTRAINT "Dimension_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
