/*
  Warnings:

  - You are about to drop the column `productCode` on the `Product` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Product_productCode_key";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "productCode",
ADD COLUMN     "code" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Product_code_key" ON "Product"("code");
