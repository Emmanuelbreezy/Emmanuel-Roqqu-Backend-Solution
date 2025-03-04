import { MigrationInterface, QueryRunner } from "typeorm";

export class NewMigration1741100040382 implements MigrationInterface {
    name = 'NewMigration1741100040382'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_addresses" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "street" varchar(255) NOT NULL, "city" varchar(100) NOT NULL, "state" varchar(100) NOT NULL, "createdAt" text NOT NULL DEFAULT (datetime('now')), "updatedAt" text NOT NULL DEFAULT (datetime('now')), "userId" integer, CONSTRAINT "FK_95c93a584de49f0b0e13f753630" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_addresses"("id", "street", "city", "state", "createdAt", "updatedAt", "userId") SELECT "id", "street", "city", "state", "createdAt", "updatedAt", "userId" FROM "addresses"`);
        await queryRunner.query(`DROP TABLE "addresses"`);
        await queryRunner.query(`ALTER TABLE "temporary_addresses" RENAME TO "addresses"`);
        await queryRunner.query(`CREATE TABLE "temporary_users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "role" text NOT NULL DEFAULT ('ROLE_USER'), "createdAt" text NOT NULL DEFAULT (datetime('now')), "updatedAt" text NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"))`);
        await queryRunner.query(`INSERT INTO "temporary_users"("id", "email", "password", "role", "createdAt", "updatedAt") SELECT "id", "email", "password", "role", "createdAt", "updatedAt" FROM "users"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`ALTER TABLE "temporary_users" RENAME TO "users"`);
        await queryRunner.query(`CREATE TABLE "temporary_addresses" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "street" varchar(255) NOT NULL, "city" varchar(100) NOT NULL, "state" varchar(100) NOT NULL, "createdAt" text NOT NULL DEFAULT (datetime('now')), "updatedAt" text NOT NULL DEFAULT (datetime('now')), "userId" integer, "houseNumber" varchar(25) NOT NULL, CONSTRAINT "FK_95c93a584de49f0b0e13f753630" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_addresses"("id", "street", "city", "state", "createdAt", "updatedAt", "userId") SELECT "id", "street", "city", "state", "createdAt", "updatedAt", "userId" FROM "addresses"`);
        await queryRunner.query(`DROP TABLE "addresses"`);
        await queryRunner.query(`ALTER TABLE "temporary_addresses" RENAME TO "addresses"`);
        await queryRunner.query(`CREATE TABLE "temporary_users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "role" text NOT NULL DEFAULT ('ROLE_USER'), "createdAt" text NOT NULL DEFAULT (datetime('now')), "updatedAt" text NOT NULL DEFAULT (datetime('now')), "firstname" varchar NOT NULL, "lastname" varchar NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"))`);
        await queryRunner.query(`INSERT INTO "temporary_users"("id", "email", "password", "role", "createdAt", "updatedAt") SELECT "id", "email", "password", "role", "createdAt", "updatedAt" FROM "users"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`ALTER TABLE "temporary_users" RENAME TO "users"`);
        await queryRunner.query(`CREATE TABLE "temporary_addresses" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "street" varchar(255) NOT NULL, "city" varchar(100) NOT NULL, "state" varchar(100) NOT NULL, "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "userId" integer, "houseNumber" varchar(25) NOT NULL, CONSTRAINT "FK_95c93a584de49f0b0e13f753630" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_addresses"("id", "street", "city", "state", "createdAt", "updatedAt", "userId", "houseNumber") SELECT "id", "street", "city", "state", "createdAt", "updatedAt", "userId", "houseNumber" FROM "addresses"`);
        await queryRunner.query(`DROP TABLE "addresses"`);
        await queryRunner.query(`ALTER TABLE "temporary_addresses" RENAME TO "addresses"`);
        await queryRunner.query(`CREATE TABLE "temporary_users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "role" text NOT NULL DEFAULT ('ROLE_USER'), "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "firstname" varchar NOT NULL, "lastname" varchar NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"))`);
        await queryRunner.query(`INSERT INTO "temporary_users"("id", "email", "password", "role", "createdAt", "updatedAt", "firstname", "lastname") SELECT "id", "email", "password", "role", "createdAt", "updatedAt", "firstname", "lastname" FROM "users"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`ALTER TABLE "temporary_users" RENAME TO "users"`);
        await queryRunner.query(`CREATE TABLE "temporary_posts" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar(250) NOT NULL, "content" text NOT NULL, "createdAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updatedAt" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "userId" integer, CONSTRAINT "FK_ae05faaa55c866130abef6e1fee" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_posts"("id", "title", "content", "createdAt", "updatedAt", "userId") SELECT "id", "title", "content", "createdAt", "updatedAt", "userId" FROM "posts"`);
        await queryRunner.query(`DROP TABLE "posts"`);
        await queryRunner.query(`ALTER TABLE "temporary_posts" RENAME TO "posts"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" RENAME TO "temporary_posts"`);
        await queryRunner.query(`CREATE TABLE "posts" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar(250) NOT NULL, "content" text NOT NULL, "createdAt" text NOT NULL DEFAULT (datetime('now')), "updatedAt" text NOT NULL DEFAULT (datetime('now')), "userId" integer, CONSTRAINT "FK_ae05faaa55c866130abef6e1fee" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "posts"("id", "title", "content", "createdAt", "updatedAt", "userId") SELECT "id", "title", "content", "createdAt", "updatedAt", "userId" FROM "temporary_posts"`);
        await queryRunner.query(`DROP TABLE "temporary_posts"`);
        await queryRunner.query(`ALTER TABLE "users" RENAME TO "temporary_users"`);
        await queryRunner.query(`CREATE TABLE "users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "role" text NOT NULL DEFAULT ('ROLE_USER'), "createdAt" text NOT NULL DEFAULT (datetime('now')), "updatedAt" text NOT NULL DEFAULT (datetime('now')), "firstname" varchar NOT NULL, "lastname" varchar NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"))`);
        await queryRunner.query(`INSERT INTO "users"("id", "email", "password", "role", "createdAt", "updatedAt", "firstname", "lastname") SELECT "id", "email", "password", "role", "createdAt", "updatedAt", "firstname", "lastname" FROM "temporary_users"`);
        await queryRunner.query(`DROP TABLE "temporary_users"`);
        await queryRunner.query(`ALTER TABLE "addresses" RENAME TO "temporary_addresses"`);
        await queryRunner.query(`CREATE TABLE "addresses" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "street" varchar(255) NOT NULL, "city" varchar(100) NOT NULL, "state" varchar(100) NOT NULL, "createdAt" text NOT NULL DEFAULT (datetime('now')), "updatedAt" text NOT NULL DEFAULT (datetime('now')), "userId" integer, "houseNumber" varchar(25) NOT NULL, CONSTRAINT "FK_95c93a584de49f0b0e13f753630" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "addresses"("id", "street", "city", "state", "createdAt", "updatedAt", "userId", "houseNumber") SELECT "id", "street", "city", "state", "createdAt", "updatedAt", "userId", "houseNumber" FROM "temporary_addresses"`);
        await queryRunner.query(`DROP TABLE "temporary_addresses"`);
        await queryRunner.query(`ALTER TABLE "users" RENAME TO "temporary_users"`);
        await queryRunner.query(`CREATE TABLE "users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "role" text NOT NULL DEFAULT ('ROLE_USER'), "createdAt" text NOT NULL DEFAULT (datetime('now')), "updatedAt" text NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"))`);
        await queryRunner.query(`INSERT INTO "users"("id", "email", "password", "role", "createdAt", "updatedAt") SELECT "id", "email", "password", "role", "createdAt", "updatedAt" FROM "temporary_users"`);
        await queryRunner.query(`DROP TABLE "temporary_users"`);
        await queryRunner.query(`ALTER TABLE "addresses" RENAME TO "temporary_addresses"`);
        await queryRunner.query(`CREATE TABLE "addresses" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "street" varchar(255) NOT NULL, "city" varchar(100) NOT NULL, "state" varchar(100) NOT NULL, "createdAt" text NOT NULL DEFAULT (datetime('now')), "updatedAt" text NOT NULL DEFAULT (datetime('now')), "userId" integer, CONSTRAINT "FK_95c93a584de49f0b0e13f753630" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "addresses"("id", "street", "city", "state", "createdAt", "updatedAt", "userId") SELECT "id", "street", "city", "state", "createdAt", "updatedAt", "userId" FROM "temporary_addresses"`);
        await queryRunner.query(`DROP TABLE "temporary_addresses"`);
        await queryRunner.query(`ALTER TABLE "users" RENAME TO "temporary_users"`);
        await queryRunner.query(`CREATE TABLE "users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "username" varchar NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "role" text NOT NULL DEFAULT ('ROLE_USER'), "createdAt" text NOT NULL DEFAULT (datetime('now')), "updatedAt" text NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"))`);
        await queryRunner.query(`INSERT INTO "users"("id", "email", "password", "role", "createdAt", "updatedAt") SELECT "id", "email", "password", "role", "createdAt", "updatedAt" FROM "temporary_users"`);
        await queryRunner.query(`DROP TABLE "temporary_users"`);
        await queryRunner.query(`ALTER TABLE "addresses" RENAME TO "temporary_addresses"`);
        await queryRunner.query(`CREATE TABLE "addresses" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "street" varchar(255) NOT NULL, "city" varchar(100) NOT NULL, "state" varchar(100) NOT NULL, "zip" varchar(20) NOT NULL, "createdAt" text NOT NULL DEFAULT (datetime('now')), "updatedAt" text NOT NULL DEFAULT (datetime('now')), "userId" integer, CONSTRAINT "FK_95c93a584de49f0b0e13f753630" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "addresses"("id", "street", "city", "state", "createdAt", "updatedAt", "userId") SELECT "id", "street", "city", "state", "createdAt", "updatedAt", "userId" FROM "temporary_addresses"`);
        await queryRunner.query(`DROP TABLE "temporary_addresses"`);
    }

}
