import { MigrationInterface, QueryRunner } from 'typeorm';

export class databaseMigration1651710553602 implements MigrationInterface {
  name = 'databaseMigration1651710553602';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."notification_status_enum" AS ENUM('READ', 'UNREAD')`,
    );
    await queryRunner.query(
      `CREATE TABLE "notification" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "text" character varying NOT NULL, "status" "public"."notification_status_enum" NOT NULL, "userId" integer, CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."profile_type_enum" AS ENUM('SUPER_ADMINISTRATOR', 'ADMINISTRATOR', 'EXPLORER')`,
    );
    await queryRunner.query(
      `CREATE TABLE "profile" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "type" "public"."profile_type_enum" NOT NULL, CONSTRAINT "PK_3dd8bfc97e4a77c70971591bdcb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_status_enum" AS ENUM('ACTIVE', 'INACTIVE')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_typeentity_enum" AS ENUM('SUPER_ADMINISTRATOR', 'ADMINISTRATOR', 'EXPLORER')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "nickname" character varying NOT NULL, "email" character varying NOT NULL, "name" character varying NOT NULL, "password" character varying, "isSuper" boolean, "status" "public"."user_status_enum", "token" character varying, "biography" character varying, "favoriteProduct" character varying, "instagram" character varying, "tikTok" character varying, "twitter" character varying, "facebook" character varying, "linkedIn" character varying, "typeEntity" "public"."user_typeentity_enum" NOT NULL, "profileId" integer, "avatarId" integer, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "REL_58f5c71eaab331645112cf8cfa" UNIQUE ("avatarId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c366fbdb4f298f4307866dfb4c" ON "user" ("typeEntity") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."saved_file_type_enum" AS ENUM('ATTACHMENT', 'PHOTO')`,
    );
    await queryRunner.query(
      `CREATE TABLE "saved_file" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying NOT NULL, "filename" character varying NOT NULL, "type" "public"."saved_file_type_enum" NOT NULL, "challengeAcceptedResponseId" integer, CONSTRAINT "PK_9be0f89ffdf149c7c08bcc4bffe" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "challenge_accepted_response" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "response" character varying(2000) NOT NULL, "challengeAcceptedId" integer, CONSTRAINT "PK_ca508cfe614c8eb0b2f21a65bd1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "comment" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "text" character varying(200) NOT NULL, "userId" integer, "acceptedChallengeId" integer, CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."challenge_accepted_status_enum" AS ENUM('UNDER_REVIEW', 'PENDING', 'COMPLETE')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."challenge_accepted_recompensestatus_enum" AS ENUM('REDEEMED', 'WAITING')`,
    );
    await queryRunner.query(
      `CREATE TABLE "challenge_accepted" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "status" "public"."challenge_accepted_status_enum" NOT NULL, "recompenseStatus" "public"."challenge_accepted_recompensestatus_enum" NOT NULL, "explorerId" integer, "challengeId" integer, CONSTRAINT "PK_ba103e5e3c520fb14ea86e1aece" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."recompense_type_enum" AS ENUM('DISCOUNT_COUPON', 'GENERAL', 'GIFT_CARD')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."recompense_status_enum" AS ENUM('ACTIVE', 'INACTIVE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "recompense" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying NOT NULL, "instructions" character varying(2000) NOT NULL, "type" "public"."recompense_type_enum" NOT NULL, "code" character varying, "status" "public"."recompense_status_enum" NOT NULL, CONSTRAINT "PK_e673349c2bb61be26d474430e16" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."challenge_status_enum" AS ENUM('OPEN', 'CLOSED', 'DRAFT')`,
    );
    await queryRunner.query(
      `CREATE TABLE "challenge" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "status" "public"."challenge_status_enum" NOT NULL, "isHighlighted" boolean NOT NULL, "title" character varying NOT NULL, "description" character varying(2000) NOT NULL, "coverId" integer, "challengedExplorerId" integer, "recompenseId" integer, CONSTRAINT "REL_3a41f10b231f88087437b8b030" UNIQUE ("coverId"), CONSTRAINT "PK_5f31455ad09ea6a836a06871b7a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."social_media_param_type_enum" AS ENUM('HASHTAG', 'ACCOUNT')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."social_media_param_status_enum" AS ENUM('ACTIVE', 'INACTIVE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "social_media_param" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "param" character varying NOT NULL, "type" "public"."social_media_param_type_enum" NOT NULL, "status" "public"."social_media_param_status_enum" NOT NULL, "approveAll" boolean NOT NULL, CONSTRAINT "PK_56cb3bd783ed608c2458506c4b0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."social_media_name_enum" AS ENUM('INSTAGRAM', 'TIKTOK', 'TWITTER', 'FACEBOOK', 'LINKEDIN')`,
    );
    await queryRunner.query(
      `CREATE TABLE "social_media" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" "public"."social_media_name_enum" NOT NULL, CONSTRAINT "PK_54ac0fd97432069e7c9ab567f8b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."post_status_enum" AS ENUM('APPROVED', 'REFUSED', 'UNDER_REVIEW')`,
    );
    await queryRunner.query(
      `CREATE TABLE "post" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "status" "public"."post_status_enum" NOT NULL, "token" character varying NOT NULL, "url" character varying NOT NULL, "socialMediaId" integer, CONSTRAINT "UQ_54857c75c96536117ace76ca5f3" UNIQUE ("token"), CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_access" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "accessDate" TIMESTAMP NOT NULL, "userId" integer, CONSTRAINT "PK_9404e012dec46d1faa719fd9bd7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "social_media_param_social_medias_social_media" ("socialMediaParamId" integer NOT NULL, "socialMediaId" integer NOT NULL, CONSTRAINT "PK_a29628bf1ba59dda8e0b44eec2e" PRIMARY KEY ("socialMediaParamId", "socialMediaId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f5eb2f5090a7a349ee0c5f683f" ON "social_media_param_social_medias_social_media" ("socialMediaParamId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_648cab12d7151c09e5233ac026" ON "social_media_param_social_medias_social_media" ("socialMediaId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ADD CONSTRAINT "FK_1ced25315eb974b73391fb1c81b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_9466682df91534dd95e4dbaa616" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_58f5c71eaab331645112cf8cfa5" FOREIGN KEY ("avatarId") REFERENCES "saved_file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "saved_file" ADD CONSTRAINT "FK_70a423a87c0eb58471058f070be" FOREIGN KEY ("challengeAcceptedResponseId") REFERENCES "challenge_accepted_response"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "challenge_accepted_response" ADD CONSTRAINT "FK_4ce646deaea1474ad10d0c7e8d8" FOREIGN KEY ("challengeAcceptedId") REFERENCES "challenge_accepted"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD CONSTRAINT "FK_af9d68a86b709e9f8df543c163a" FOREIGN KEY ("acceptedChallengeId") REFERENCES "challenge_accepted"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "challenge_accepted" ADD CONSTRAINT "FK_36b7540bcb5a76aaac00fdb6f5d" FOREIGN KEY ("explorerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "challenge_accepted" ADD CONSTRAINT "FK_cb6cbc4ae8043f6fdbae1e73f80" FOREIGN KEY ("challengeId") REFERENCES "challenge"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "challenge" ADD CONSTRAINT "FK_3a41f10b231f88087437b8b030d" FOREIGN KEY ("coverId") REFERENCES "saved_file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "challenge" ADD CONSTRAINT "FK_6569ddb780b4fffc1e1215a2afe" FOREIGN KEY ("challengedExplorerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "challenge" ADD CONSTRAINT "FK_afd674a1928f7951822728ba1e1" FOREIGN KEY ("recompenseId") REFERENCES "recompense"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post" ADD CONSTRAINT "FK_b0c83d7721f2ae1dfa5fff22135" FOREIGN KEY ("socialMediaId") REFERENCES "social_media"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_access" ADD CONSTRAINT "FK_95da52cd2e73d533819048acfba" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "social_media_param_social_medias_social_media" ADD CONSTRAINT "FK_f5eb2f5090a7a349ee0c5f683f1" FOREIGN KEY ("socialMediaParamId") REFERENCES "social_media_param"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "social_media_param_social_medias_social_media" ADD CONSTRAINT "FK_648cab12d7151c09e5233ac026b" FOREIGN KEY ("socialMediaId") REFERENCES "social_media"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "social_media_param_social_medias_social_media" DROP CONSTRAINT "FK_648cab12d7151c09e5233ac026b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "social_media_param_social_medias_social_media" DROP CONSTRAINT "FK_f5eb2f5090a7a349ee0c5f683f1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_access" DROP CONSTRAINT "FK_95da52cd2e73d533819048acfba"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post" DROP CONSTRAINT "FK_b0c83d7721f2ae1dfa5fff22135"`,
    );
    await queryRunner.query(
      `ALTER TABLE "challenge" DROP CONSTRAINT "FK_afd674a1928f7951822728ba1e1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "challenge" DROP CONSTRAINT "FK_6569ddb780b4fffc1e1215a2afe"`,
    );
    await queryRunner.query(
      `ALTER TABLE "challenge" DROP CONSTRAINT "FK_3a41f10b231f88087437b8b030d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "challenge_accepted" DROP CONSTRAINT "FK_cb6cbc4ae8043f6fdbae1e73f80"`,
    );
    await queryRunner.query(
      `ALTER TABLE "challenge_accepted" DROP CONSTRAINT "FK_36b7540bcb5a76aaac00fdb6f5d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" DROP CONSTRAINT "FK_af9d68a86b709e9f8df543c163a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" DROP CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "challenge_accepted_response" DROP CONSTRAINT "FK_4ce646deaea1474ad10d0c7e8d8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "saved_file" DROP CONSTRAINT "FK_70a423a87c0eb58471058f070be"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_58f5c71eaab331645112cf8cfa5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_9466682df91534dd95e4dbaa616"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" DROP CONSTRAINT "FK_1ced25315eb974b73391fb1c81b"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_648cab12d7151c09e5233ac026"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f5eb2f5090a7a349ee0c5f683f"`,
    );
    await queryRunner.query(
      `DROP TABLE "social_media_param_social_medias_social_media"`,
    );
    await queryRunner.query(`DROP TABLE "user_access"`);
    await queryRunner.query(`DROP TABLE "post"`);
    await queryRunner.query(`DROP TYPE "public"."post_status_enum"`);
    await queryRunner.query(`DROP TABLE "social_media"`);
    await queryRunner.query(`DROP TYPE "public"."social_media_name_enum"`);
    await queryRunner.query(`DROP TABLE "social_media_param"`);
    await queryRunner.query(
      `DROP TYPE "public"."social_media_param_status_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."social_media_param_type_enum"`,
    );
    await queryRunner.query(`DROP TABLE "challenge"`);
    await queryRunner.query(`DROP TYPE "public"."challenge_status_enum"`);
    await queryRunner.query(`DROP TABLE "recompense"`);
    await queryRunner.query(`DROP TYPE "public"."recompense_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."recompense_type_enum"`);
    await queryRunner.query(`DROP TABLE "challenge_accepted"`);
    await queryRunner.query(
      `DROP TYPE "public"."challenge_accepted_recompensestatus_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."challenge_accepted_status_enum"`,
    );
    await queryRunner.query(`DROP TABLE "comment"`);
    await queryRunner.query(`DROP TABLE "challenge_accepted_response"`);
    await queryRunner.query(`DROP TABLE "saved_file"`);
    await queryRunner.query(`DROP TYPE "public"."saved_file_type_enum"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c366fbdb4f298f4307866dfb4c"`,
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TYPE "public"."user_typeentity_enum"`);
    await queryRunner.query(`DROP TYPE "public"."user_status_enum"`);
    await queryRunner.query(`DROP TABLE "profile"`);
    await queryRunner.query(`DROP TYPE "public"."profile_type_enum"`);
    await queryRunner.query(`DROP TABLE "notification"`);
    await queryRunner.query(`DROP TYPE "public"."notification_status_enum"`);
  }
}
