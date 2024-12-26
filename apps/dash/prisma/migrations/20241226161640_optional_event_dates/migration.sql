/*
  Warnings:

  - You are about to drop the column `orderId` on the `EventRegistration` table. All the data in the column will be lost.
  - You are about to drop the `Order` table. If the table is not empty, all the data it contains will be lost.

*/

-- AlterTable
ALTER TABLE "public"."Event" ALTER COLUMN "dateStart" DROP NOT NULL,
ALTER COLUMN "dateEnd" DROP NOT NULL;
