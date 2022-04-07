import {MigrationInterface, QueryRunner} from "typeorm";

export class databaseMigration1649221070077 implements MigrationInterface {
    name = 'databaseMigration1649221070077'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_access" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "accessDate" TIMESTAMP NOT NULL, "userId" integer, CONSTRAINT "PK_9404e012dec46d1faa719fd9bd7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_access" ADD CONSTRAINT "FK_95da52cd2e73d533819048acfba" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_access" DROP CONSTRAINT "FK_95da52cd2e73d533819048acfba"`);
        await queryRunner.query(`DROP TABLE "user_access"`);
    }

}
