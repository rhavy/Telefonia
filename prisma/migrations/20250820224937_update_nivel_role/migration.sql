-- DropForeignKey
ALTER TABLE `administrador` DROP FOREIGN KEY `Administrador_planoId_fkey`;

-- DropIndex
DROP INDEX `Administrador_planoId_fkey` ON `administrador`;

-- AddForeignKey
ALTER TABLE `Plano` ADD CONSTRAINT `Plano_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `Administrador`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
