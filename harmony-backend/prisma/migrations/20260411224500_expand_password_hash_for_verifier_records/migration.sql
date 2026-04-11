-- Issue #313
-- Expand password_hash so it can store the verifier scheme prefix + salt + bcrypt hash.
ALTER TABLE "users"
ALTER COLUMN "password_hash" TYPE VARCHAR(255);
