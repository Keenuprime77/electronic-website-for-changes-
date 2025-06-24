-- AlterTable
ALTER TABLE `product` ALTER COLUMN `quantity` DROP DEFAULT;

-- AlterTable
ALTER TABLE `user` MODIFY `password` VARCHAR(191) NULL;
