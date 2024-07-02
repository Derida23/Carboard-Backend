-- AlterTable
ALTER TABLE "fuels" ALTER COLUMN "created_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "marks" ALTER COLUMN "created_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "products" ALTER COLUMN "created_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "transmissions" ALTER COLUMN "created_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "types" ALTER COLUMN "created_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "created_at" DROP NOT NULL;
