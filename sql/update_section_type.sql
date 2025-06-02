-- First, create a backup of the registrations table (just in case)
CREATE TABLE registrations_2025_2026_backup AS SELECT * FROM registrations_2025_2026;

-- Start a transaction
BEGIN;

-- Add new values to the section_type enum
ALTER TYPE section_type ADD VALUE IF NOT EXISTS 'science';
COMMIT;

BEGIN;
ALTER TYPE section_type ADD VALUE IF NOT EXISTS 'arts';
COMMIT;

-- Verify the changes
SELECT enum_range(NULL::section_type);

-- Note: If you need to rollback, you can use:
-- DROP TABLE registrations_2025_2026;
-- ALTER TYPE section_type RENAME TO section_type_old;
-- CREATE TYPE section_type AS ENUM ('general', 'statistics');
-- ALTER TABLE registrations_2025_2026_backup RENAME TO registrations_2025_2026; 