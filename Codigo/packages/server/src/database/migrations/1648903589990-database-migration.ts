import {MigrationInterface, QueryRunner} from "typeorm";

export class databaseMigration1648903589990 implements MigrationInterface {
    name = 'databaseMigration1648903589990'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_a1d2615649aa21a894d5bbf2d95"`);
        await queryRunner.query(`ALTER TABLE "saved_file" ADD "challengeAcceptedResponseId" integer`);
        await queryRunner.query(`ALTER TABLE "saved_file" ADD CONSTRAINT "FK_70a423a87c0eb58471058f070be" FOREIGN KEY ("challengeAcceptedResponseId") REFERENCES "challenge_accepted_response"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_af9d68a86b709e9f8df543c163a" FOREIGN KEY ("acceptedChallengeId") REFERENCES "challenge_accepted"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_af9d68a86b709e9f8df543c163a"`);
        await queryRunner.query(`ALTER TABLE "saved_file" DROP CONSTRAINT "FK_70a423a87c0eb58471058f070be"`);
        await queryRunner.query(`ALTER TABLE "saved_file" DROP COLUMN "challengeAcceptedResponseId"`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_a1d2615649aa21a894d5bbf2d95" FOREIGN KEY ("acceptedChallengeId") REFERENCES "challenge_accepted"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
