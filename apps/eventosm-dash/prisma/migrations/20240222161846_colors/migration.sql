/*
  Warnings:

  - Added the required column `abbreviation` to the `Organization` table without a default value. This is not possible if the table is not empty.
  - Made the column `options` on table `Organization` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "colors";

-- CreateEnum
CREATE TYPE "colors"."ColorId" AS ENUM ('slate_50', 'slate_100', 'slate_200', 'slate_300', 'slate_400', 'slate_500', 'slate_600', 'slate_700', 'slate_800', 'slate_900', 'slate_950', 'gray_50', 'gray_100', 'gray_200', 'gray_300', 'gray_400', 'gray_500', 'gray_600', 'gray_700', 'gray_800', 'gray_900', 'gray_950', 'zinc_50', 'zinc_100', 'zinc_200', 'zinc_300', 'zinc_400', 'zinc_500', 'zinc_600', 'zinc_700', 'zinc_800', 'zinc_900', 'zinc_950', 'neutral_50', 'neutral_100', 'neutral_200', 'neutral_300', 'neutral_400', 'neutral_500', 'neutral_600', 'neutral_700', 'neutral_800', 'neutral_900', 'neutral_950', 'stone_50', 'stone_100', 'stone_200', 'stone_300', 'stone_400', 'stone_500', 'stone_600', 'stone_700', 'stone_800', 'stone_900', 'stone_950', 'red_50', 'red_100', 'red_200', 'red_300', 'red_400', 'red_500', 'red_600', 'red_700', 'red_800', 'red_900', 'red_950', 'orange_50', 'orange_100', 'orange_200', 'orange_300', 'orange_400', 'orange_500', 'orange_600', 'orange_700', 'orange_800', 'orange_900', 'orange_950', 'amber_50', 'amber_100', 'amber_200', 'amber_300', 'amber_400', 'amber_500', 'amber_600', 'amber_700', 'amber_800', 'amber_900', 'amber_950', 'yellow_50', 'yellow_100', 'yellow_200', 'yellow_300', 'yellow_400', 'yellow_500', 'yellow_600', 'yellow_700', 'yellow_800', 'yellow_900', 'yellow_950', 'lime_50', 'lime_100', 'lime_200', 'lime_300', 'lime_400', 'lime_500', 'lime_600', 'lime_700', 'lime_800', 'lime_900', 'lime_950', 'green_50', 'green_100', 'green_200', 'green_300', 'green_400', 'green_500', 'green_600', 'green_700', 'green_800', 'green_900', 'green_950', 'emerald_50', 'emerald_100', 'emerald_200', 'emerald_300', 'emerald_400', 'emerald_500', 'emerald_600', 'emerald_700', 'emerald_800', 'emerald_900', 'emerald_950', 'teal_50', 'teal_100', 'teal_200', 'teal_300', 'teal_400', 'teal_500', 'teal_600', 'teal_700', 'teal_800', 'teal_900', 'teal_950', 'cyan_50', 'cyan_100', 'cyan_200', 'cyan_300', 'cyan_400', 'cyan_500', 'cyan_600', 'cyan_700', 'cyan_800', 'cyan_900', 'cyan_950', 'sky_50', 'sky_100', 'sky_200', 'sky_300', 'sky_400', 'sky_500', 'sky_600', 'sky_700', 'sky_800', 'sky_900', 'sky_950', 'blue_50', 'blue_100', 'blue_200', 'blue_300', 'blue_400', 'blue_500', 'blue_600', 'blue_700', 'blue_800', 'blue_900', 'blue_950', 'indigo_50', 'indigo_100', 'indigo_200', 'indigo_300', 'indigo_400', 'indigo_500', 'indigo_600', 'indigo_700', 'indigo_800', 'indigo_900', 'indigo_950', 'violet_50', 'violet_100', 'violet_200', 'violet_300', 'violet_400', 'violet_500', 'violet_600', 'violet_700', 'violet_800', 'violet_900', 'violet_950', 'purple_50', 'purple_100', 'purple_200', 'purple_300', 'purple_400', 'purple_500', 'purple_600', 'purple_700', 'purple_800', 'purple_900', 'purple_950', 'fuchsia_50', 'fuchsia_100', 'fuchsia_200', 'fuchsia_300', 'fuchsia_400', 'fuchsia_500', 'fuchsia_600', 'fuchsia_700', 'fuchsia_800', 'fuchsia_900', 'fuchsia_950', 'pink_50', 'pink_100', 'pink_200', 'pink_300', 'pink_400', 'pink_500', 'pink_600', 'pink_700', 'pink_800', 'pink_900', 'pink_950', 'rose_50', 'rose_100', 'rose_200', 'rose_300', 'rose_400', 'rose_500', 'rose_600', 'rose_700', 'rose_800', 'rose_900', 'rose_950', 'black', 'dark', 'white', 'dark_zinc', 'dark_white');

-- AlterTable
ALTER TABLE "public"."Organization" ADD COLUMN     "abbreviation" TEXT NOT NULL,
ALTER COLUMN "options" SET NOT NULL;

-- CreateTable
CREATE TABLE "colors"."Color" (
    "id" "colors"."ColorId" NOT NULL,
    "tw" JSONB NOT NULL,
    "hex" TEXT NOT NULL,
    "rgb" TEXT,

    CONSTRAINT "Color_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Color_id_key" ON "colors"."Color"("id");
