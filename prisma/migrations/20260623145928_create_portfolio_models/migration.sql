-- CreateTable
CREATE TABLE `AdminUser` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL DEFAULT 'admin',
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `lastLoginAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `AdminUser_email_key`(`email`),
    INDEX `AdminUser_email_idx`(`email`),
    INDEX `AdminUser_role_idx`(`role`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Profile` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `shortName` VARCHAR(191) NOT NULL,
    `greeting` VARCHAR(191) NOT NULL,
    `badge` VARCHAR(191) NOT NULL,
    `primaryRole` VARCHAR(191) NOT NULL,
    `secondaryRole` VARCHAR(191) NULL,
    `description` TEXT NOT NULL,
    `about` TEXT NULL,
    `email` VARCHAR(191) NULL,
    `whatsapp` VARCHAR(191) NULL,
    `githubUrl` VARCHAR(191) NULL,
    `linkedinUrl` VARCHAR(191) NULL,
    `location` VARCHAR(191) NULL,
    `profileImage` VARCHAR(191) NULL,
    `cvUrl` VARCHAR(191) NULL,
    `isAvailable` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Project` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `slug` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `shortDescription` TEXT NOT NULL,
    `description` TEXT NULL,
    `role` VARCHAR(191) NULL,
    `category` VARCHAR(191) NULL,
    `image` VARCHAR(191) NULL,
    `githubUrl` VARCHAR(191) NULL,
    `liveUrl` VARCHAR(191) NULL,
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Project_slug_key`(`slug`),
    INDEX `Project_active_idx`(`active`),
    INDEX `Project_featured_idx`(`featured`),
    INDEX `Project_sortOrder_idx`(`sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProjectTechnology` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `projectId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ProjectTechnology_projectId_idx`(`projectId`),
    INDEX `ProjectTechnology_sortOrder_idx`(`sortOrder`),
    UNIQUE INDEX `ProjectTechnology_projectId_name_key`(`projectId`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Skill` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `level` VARCHAR(191) NOT NULL,
    `icon` VARCHAR(191) NULL,
    `description` TEXT NULL,
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Skill_name_key`(`name`),
    INDEX `Skill_category_idx`(`category`),
    INDEX `Skill_level_idx`(`level`),
    INDEX `Skill_active_idx`(`active`),
    INDEX `Skill_sortOrder_idx`(`sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Experience` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `institution` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NULL,
    `startDate` VARCHAR(191) NULL,
    `endDate` VARCHAR(191) NULL,
    `isCurrent` BOOLEAN NOT NULL DEFAULT false,
    `description` TEXT NOT NULL,
    `responsibilities` JSON NULL,
    `technologies` JSON NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Experience_type_idx`(`type`),
    INDEX `Experience_active_idx`(`active`),
    INDEX `Experience_sortOrder_idx`(`sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Certificate` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `issuer` VARCHAR(191) NOT NULL,
    `credentialId` VARCHAR(191) NULL,
    `issueDate` VARCHAR(191) NULL,
    `expiryDate` VARCHAR(191) NULL,
    `image` VARCHAR(191) NULL,
    `credentialUrl` VARCHAR(191) NULL,
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Certificate_featured_idx`(`featured`),
    INDEX `Certificate_active_idx`(`active`),
    INDEX `Certificate_sortOrder_idx`(`sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProjectTechnology` ADD CONSTRAINT `ProjectTechnology_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
