/*
  Warnings:

  - Made the column `apartment` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `city` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `country` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `postalCode` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `user` 
    MODIFY `apartment` VARCHAR(191) NOT NULL,
    MODIFY `city` VARCHAR(191) NOT NULL,
    MODIFY `country` VARCHAR(191) NOT NULL,
    MODIFY `postalCode` VARCHAR(191) NOT NULL;
