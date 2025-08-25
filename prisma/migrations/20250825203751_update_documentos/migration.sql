/*
  Warnings:

  - You are about to drop the column `createdAt` on the `documento` table. All the data in the column will be lost.
  - You are about to alter the column `status` on the `documento` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(4))`.
  - A unique constraint covering the columns `[tipo,userId]` on the table `Documento` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tipo` to the `Documento` table without a default value. This is not possible if the table is not empty.
  - Made the column `url` on table `documento` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `documento` DROP FOREIGN KEY `Documento_userId_fkey`;

-- DropIndex
DROP INDEX `Documento_userId_fkey` ON `documento`;

-- AlterTable
ALTER TABLE `documento` DROP COLUMN `createdAt`,
    ADD COLUMN `tipo` ENUM('RG', 'CPF', 'RESIDENCIA') NOT NULL,
    MODIFY `status` ENUM('PENDENTE', 'APROVADO', 'REJEITADO') NOT NULL,
    MODIFY `url` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Documento_tipo_userId_key` ON `Documento`(`tipo`, `userId`);

-- AddForeignKey
ALTER TABLE `Documento` ADD CONSTRAINT `Documento_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
