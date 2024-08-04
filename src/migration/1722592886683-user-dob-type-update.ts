import { MigrationInterface, QueryRunner } from "typeorm";

export class UserDobTypeUpdate1722592886683 implements MigrationInterface {
    name = 'UserDobTypeUpdate1722592886683'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "dob"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "dob" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "dob"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "dob" date`);
    }

}
