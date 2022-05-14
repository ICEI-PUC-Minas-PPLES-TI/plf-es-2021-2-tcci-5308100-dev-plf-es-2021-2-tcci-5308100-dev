import {MigrationInterface, QueryRunner} from "typeorm";

export class databaseMigration1652230179979 implements MigrationInterface {
    name = 'databaseMigration1652230179979'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "background" character varying(20)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "background"`);
    }

}
