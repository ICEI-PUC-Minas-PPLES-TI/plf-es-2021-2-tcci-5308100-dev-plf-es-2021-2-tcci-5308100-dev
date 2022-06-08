import {MigrationInterface, QueryRunner} from "typeorm";

export class databaseMigration1652224006753 implements MigrationInterface {
    name = 'databaseMigration1652224006753'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" ADD "title" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "title"`);
    }

}
