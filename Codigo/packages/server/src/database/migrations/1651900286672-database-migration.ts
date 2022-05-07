import { MigrationInterface, QueryRunner } from 'typeorm';

export class databaseMigration1651900286672 implements MigrationInterface {
  name = 'databaseMigration1651900286672';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."user_status_enum" RENAME TO "user_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_status_enum" AS ENUM('ACTIVE', 'INACTIVE', 'UNDER_REVIEW', 'BANNED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "status" TYPE "public"."user_status_enum" USING "status"::"text"::"public"."user_status_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."user_status_enum_old"`);
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "status" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "status" DROP NOT NULL`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_status_enum_old" AS ENUM('ACTIVE', 'INACTIVE')`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "status" TYPE "public"."user_status_enum_old" USING "status"::"text"::"public"."user_status_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "public"."user_status_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."user_status_enum_old" RENAME TO "user_status_enum"`,
    );
  }
}
