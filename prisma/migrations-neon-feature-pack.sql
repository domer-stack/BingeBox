-- Run in Neon SQL Editor after deploying the feature pack (or use: npm run db:push)
-- Makes password optional for OAuth users, adds OAuth accounts + show reviews.

ALTER TABLE "User" ALTER COLUMN "password" DROP NOT NULL;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "name" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "emailVerified" TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "image" TEXT;

CREATE TABLE IF NOT EXISTS "Account" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "providerAccountId" TEXT NOT NULL,
  "refresh_token" TEXT,
  "access_token" TEXT,
  "expires_at" INTEGER,
  "token_type" TEXT,
  "scope" TEXT,
  "id_token" TEXT,
  "session_state" TEXT,
  CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Account_provider_providerAccountId_key"
  ON "Account"("provider", "providerAccountId");

ALTER TABLE "Account" DROP CONSTRAINT IF EXISTS "Account_userId_fkey";
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE IF NOT EXISTS "ShowReview" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "tmdbShowId" INTEGER NOT NULL,
  "showName" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "rating" DOUBLE PRECISION,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ShowReview_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "ShowReview_userId_tmdbShowId_key"
  ON "ShowReview"("userId", "tmdbShowId");
CREATE INDEX IF NOT EXISTS "ShowReview_tmdbShowId_idx" ON "ShowReview"("tmdbShowId");

ALTER TABLE "ShowReview" DROP CONSTRAINT IF EXISTS "ShowReview_userId_fkey";
ALTER TABLE "ShowReview" ADD CONSTRAINT "ShowReview_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE INDEX IF NOT EXISTS "DiaryEntry_userId_tmdbShowId_idx" ON "DiaryEntry"("userId", "tmdbShowId");
