import {MigrationInterface, QueryRunner} from "typeorm";

export class databaseMigration1651965094672 implements MigrationInterface {
    name = 'databaseMigration1651965094672'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "instagram"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "instagram" character varying(20)`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "tikTok"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "tikTok" character varying(20)`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "twitter"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "twitter" character varying(20)`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "facebook"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "facebook" character varying(20)`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "linkedIn"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "linkedIn" character varying(20)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "linkedIn"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "linkedIn" character varying`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "facebook"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "facebook" character varying`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "twitter"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "twitter" character varying`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "tikTok"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "tikTok" character varying`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "instagram"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "instagram" character varying`);
    }

}
