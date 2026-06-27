-- AlterTable
ALTER TABLE `profile` ADD COLUMN `educationLogo` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `ProjectTechnology` ADD CONSTRAINT `ProjectTechnology_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
