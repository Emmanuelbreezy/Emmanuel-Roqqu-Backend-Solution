import { MigrationInterface, QueryRunner } from "typeorm";

export class NewMigration1741114251269 implements MigrationInterface {
    name = 'NewMigration1741114251269'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_addresses" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "street" varchar(255) NOT NULL, "city" varchar(100) NOT NULL, "state" varchar(100) NOT NULL, "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "userId" integer, "houseNumber" varchar(25) NOT NULL)`);
        await queryRunner.query(`INSERT INTO "temporary_addresses"("id", "street", "city", "state", "createdAt", "updatedAt", "userId", "houseNumber") SELECT "id", "street", "city", "state", "createdAt", "updatedAt", "userId", "houseNumber" FROM "addresses"`);
        await queryRunner.query(`DROP TABLE "addresses"`);
        await queryRunner.query(`ALTER TABLE "temporary_addresses" RENAME TO "addresses"`);
        await queryRunner.query(`CREATE TABLE "temporary_addresses" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "street" varchar(255) NOT NULL, "city" varchar(100) NOT NULL, "state" varchar(100) NOT NULL, "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "houseNumber" varchar(25) NOT NULL)`);
        await queryRunner.query(`INSERT INTO "temporary_addresses"("id", "street", "city", "state", "createdAt", "updatedAt", "houseNumber") SELECT "id", "street", "city", "state", "createdAt", "updatedAt", "houseNumber" FROM "addresses"`);
        await queryRunner.query(`DROP TABLE "addresses"`);
        await queryRunner.query(`ALTER TABLE "temporary_addresses" RENAME TO "addresses"`);
        await queryRunner.query(`CREATE TABLE "temporary_users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" varchar NOT NULL, "role" text NOT NULL DEFAULT ('ROLE_USER'), "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "firstname" varchar NOT NULL, "lastname" varchar NOT NULL, "addressId" integer, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_b15f0be80b63328d942a7058c5c" UNIQUE ("addressId"))`);
        await queryRunner.query(`INSERT INTO "temporary_users"("id", "email", "role", "createdAt", "updatedAt", "firstname", "lastname") SELECT "id", "email", "role", "createdAt", "updatedAt", "firstname", "lastname" FROM "users"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`ALTER TABLE "temporary_users" RENAME TO "users"`);
        await queryRunner.query(`CREATE TABLE "temporary_addresses" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "street" varchar NOT NULL, "city" varchar NOT NULL, "state" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "houseNumber" varchar(25) NOT NULL)`);
        await queryRunner.query(`INSERT INTO "temporary_addresses"("id", "street", "city", "state", "createdAt", "updatedAt", "houseNumber") SELECT "id", "street", "city", "state", "createdAt", "updatedAt", "houseNumber" FROM "addresses"`);
        await queryRunner.query(`DROP TABLE "addresses"`);
        await queryRunner.query(`ALTER TABLE "temporary_addresses" RENAME TO "addresses"`);
        await queryRunner.query(`CREATE TABLE "temporary_users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" varchar NOT NULL, "role" text NOT NULL DEFAULT ('ROLE_USER'), "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "firstname" varchar NOT NULL, "lastname" varchar NOT NULL, "addressId" integer, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_b15f0be80b63328d942a7058c5c" UNIQUE ("addressId"), CONSTRAINT "FK_bafb08f60d7857f4670c172a6ea" FOREIGN KEY ("addressId") REFERENCES "addresses" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_users"("id", "email", "role", "createdAt", "updatedAt", "firstname", "lastname", "addressId") SELECT "id", "email", "role", "createdAt", "updatedAt", "firstname", "lastname", "addressId" FROM "users"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`ALTER TABLE "temporary_users" RENAME TO "users"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME TO "temporary_users"`);
        await queryRunner.query(`CREATE TABLE "users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" varchar NOT NULL, "role" text NOT NULL DEFAULT ('ROLE_USER'), "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "firstname" varchar NOT NULL, "lastname" varchar NOT NULL, "addressId" integer, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_b15f0be80b63328d942a7058c5c" UNIQUE ("addressId"))`);
        await queryRunner.query(`INSERT INTO "users"("id", "email", "role", "createdAt", "updatedAt", "firstname", "lastname", "addressId") SELECT "id", "email", "role", "createdAt", "updatedAt", "firstname", "lastname", "addressId" FROM "temporary_users"`);
        await queryRunner.query(`DROP TABLE "temporary_users"`);
        await queryRunner.query(`ALTER TABLE "addresses" RENAME TO "temporary_addresses"`);
        await queryRunner.query(`CREATE TABLE "addresses" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "street" varchar(255) NOT NULL, "city" varchar(100) NOT NULL, "state" varchar(100) NOT NULL, "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "houseNumber" varchar(25) NOT NULL)`);
        await queryRunner.query(`INSERT INTO "addresses"("id", "street", "city", "state", "createdAt", "updatedAt", "houseNumber") SELECT "id", "street", "city", "state", "createdAt", "updatedAt", "houseNumber" FROM "temporary_addresses"`);
        await queryRunner.query(`DROP TABLE "temporary_addresses"`);
        await queryRunner.query(`ALTER TABLE "users" RENAME TO "temporary_users"`);
        await queryRunner.query(`CREATE TABLE "users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" varchar NOT NULL, "role" text NOT NULL DEFAULT ('ROLE_USER'), "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "firstname" varchar NOT NULL, "lastname" varchar NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"))`);
        await queryRunner.query(`INSERT INTO "users"("id", "email", "role", "createdAt", "updatedAt", "firstname", "lastname") SELECT "id", "email", "role", "createdAt", "updatedAt", "firstname", "lastname" FROM "temporary_users"`);
        await queryRunner.query(`DROP TABLE "temporary_users"`);
        await queryRunner.query(`ALTER TABLE "addresses" RENAME TO "temporary_addresses"`);
        await queryRunner.query(`CREATE TABLE "addresses" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "street" varchar(255) NOT NULL, "city" varchar(100) NOT NULL, "state" varchar(100) NOT NULL, "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "userId" integer, "houseNumber" varchar(25) NOT NULL)`);
        await queryRunner.query(`INSERT INTO "addresses"("id", "street", "city", "state", "createdAt", "updatedAt", "houseNumber") SELECT "id", "street", "city", "state", "createdAt", "updatedAt", "houseNumber" FROM "temporary_addresses"`);
        await queryRunner.query(`DROP TABLE "temporary_addresses"`);
        await queryRunner.query(`ALTER TABLE "addresses" RENAME TO "temporary_addresses"`);
        await queryRunner.query(`CREATE TABLE "addresses" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "street" varchar(255) NOT NULL, "city" varchar(100) NOT NULL, "state" varchar(100) NOT NULL, "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "userId" integer, "houseNumber" varchar(25) NOT NULL, CONSTRAINT "FK_95c93a584de49f0b0e13f753630" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "addresses"("id", "street", "city", "state", "createdAt", "updatedAt", "userId", "houseNumber") SELECT "id", "street", "city", "state", "createdAt", "updatedAt", "userId", "houseNumber" FROM "temporary_addresses"`);
        await queryRunner.query(`DROP TABLE "temporary_addresses"`);
    }

}
