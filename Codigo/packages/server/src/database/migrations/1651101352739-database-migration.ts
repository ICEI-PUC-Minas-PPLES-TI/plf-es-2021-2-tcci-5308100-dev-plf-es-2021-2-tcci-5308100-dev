import {MigrationInterface, QueryRunner} from "typeorm";

export class databaseMigration1651101352739 implements MigrationInterface {
    name = 'databaseMigration1651101352739'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" ADD "url" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "url"`);
    }

}
