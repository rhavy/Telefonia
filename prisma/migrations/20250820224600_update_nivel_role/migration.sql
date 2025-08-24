/*
  Warnings:

  - You are about to drop the column `email` on the `administrador` table. All the data in the column will be lost.
  - You are about to drop the column `nome` on the `administrador` table. All the data in the column will be lost.
  - You are about to drop the column `senhaHash` on the `administrador` table. All the data in the column will be lost.
  - Added the required column `planoId` to the `Administrador` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Administrador` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `plano` DROP FOREIGN KEY `Plano_adminId_fkey`;

-- DropIndex
DROP INDEX `Administrador_email_key` ON `administrador`;

-- DropIndex
DROP INDEX `Plano_adminId_fkey` ON `plano`;

-- AlterTable
ALTER TABLE `administrador` DROP COLUMN `email`,
    DROP COLUMN `nome`,
    DROP COLUMN `senhaHash`,
    ADD COLUMN `planoId` VARCHAR(191) NOT NULL,
    ADD COLUMN `roleNivel` INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN `userId` VARCHAR(191) NOT NULL,
    MODIFY `ativo` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `ativo` BOOLEAN NOT NULL DEFAULT true,
    MODIFY `role` VARCHAR(191) NULL DEFAULT 'USER';

-- AddForeignKey
ALTER TABLE `Administrador` ADD CONSTRAINT `Administrador_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Administrador` ADD CONSTRAINT `Administrador_planoId_fkey` FOREIGN KEY (`planoId`) REFERENCES `Plano`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
