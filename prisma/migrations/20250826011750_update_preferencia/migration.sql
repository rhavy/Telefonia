/*
  Warnings:

  - The values [NOTIFICACAO] on the enum `Preferencia_tipo` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `preferencia` MODIFY `tipo` ENUM('TEMA', 'IDIOMA', 'NOTIFICACAOEMAIL', 'NOTIFICACAOSMS') NOT NULL;
