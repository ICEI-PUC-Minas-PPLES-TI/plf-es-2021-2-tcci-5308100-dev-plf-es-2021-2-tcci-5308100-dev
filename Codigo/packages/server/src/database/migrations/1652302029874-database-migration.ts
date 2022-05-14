import {MigrationInterface, QueryRunner} from "typeorm";

export class databaseMigration1652302029874 implements MigrationInterface {
    name = 'databaseMigration1652302029874'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "challenge" DROP COLUMN "isHighlighted"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "challenge" ADD "isHighlighted" boolean NOT NULL`);
    }

}
