import {MigrationInterface, QueryRunner} from "typeorm";

export class databaseMigration1651348159621 implements MigrationInterface {
    name = 'databaseMigration1651348159621'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "UQ_54857c75c96536117ace76ca5f3" UNIQUE ("token")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "UQ_54857c75c96536117ace76ca5f3"`);
    }

}
