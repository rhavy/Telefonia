/*
  Warnings:

  - You are about to drop the column `cpf` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `genero` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `user` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `user_cpf_key` ON `user`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `cpf`,
    DROP COLUMN `genero`,
    DROP COLUMN `password`;

-- CreateTable
CREATE TABLE `perfil` (
    `id` VARCHAR(191) NOT NULL,
    `cpf` VARCHAR(191) NULL,
    `genero` TEXT NULL,
    `nascimento` DATETIME(3) NULL,
    `userId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `perfil_cpf_key`(`cpf`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Endereco` (
    `id` VARCHAR(191) NOT NULL,
    `cep` TEXT NOT NULL,
    `logradouro` TEXT NOT NULL,
    `numero` TEXT NOT NULL,
    `complemento` TEXT NULL,
    `bairro` TEXT NOT NULL,
    `cidade` TEXT NOT NULL,
    `estado` TEXT NOT NULL,
    `pais` TEXT NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `perfil` ADD CONSTRAINT `perfil_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Endereco` ADD CONSTRAINT `Endereco_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
