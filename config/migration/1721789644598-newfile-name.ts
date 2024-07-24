import { MigrationInterface, QueryRunner } from "typeorm";

export class NewfileName1721789644598 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "entry" ALTER COLUMN "resume" RENAME TO "resumes"`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
