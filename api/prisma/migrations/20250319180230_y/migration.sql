/*
  Warnings:

  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductExchangeRate` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProductExchangeRate" DROP CONSTRAINT "ProductExchangeRate_productId_fkey";

-- DropTable
DROP TABLE "Product";

-- DropTable
DROP TABLE "ProductExchangeRate";

-- CreateTable
CREATE TABLE "products" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "code" TEXT,
    "price" DECIMAL(10,2),
    "expiration" TIMESTAMP(3),

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_exchange_rates" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "currency" VARCHAR(3) NOT NULL,
    "exchange_rate" DECIMAL(10,6) NOT NULL,
    "converted_price" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "product_exchange_rates_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "product_exchange_rates" ADD CONSTRAINT "product_exchange_rates_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
