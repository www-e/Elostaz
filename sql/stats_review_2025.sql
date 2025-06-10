-- Check if the table exists and drop it if it does
DROP TABLE IF EXISTS stats_review_2025;

-- Create the table for statistics review registrations
CREATE TABLE stats_review_2025 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_name TEXT NOT NULL,
    student_phone TEXT NOT NULL UNIQUE,
    parent_phone TEXT NOT NULL,
    school_type TEXT NOT NULL CHECK (school_type IN ('azhar', 'general_arts')), -- الثانوي الازهري - الثانوي العامة (ادبي)
    attendance_type TEXT NOT NULL DEFAULT 'offline' CHECK (attendance_type IN ('zoom', 'offline')), -- نوع الحضور
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('UTC'::text, now()) NOT NULL
);

-- Create index on student_phone for faster lookups
CREATE INDEX idx_stats_review_2025_student_phone ON stats_review_2025(student_phone);

-- Create index on username for faster lookups during authentication
CREATE INDEX idx_stats_review_2025_username ON stats_review_2025(username);

-- Enable Row Level Security
ALTER TABLE stats_review_2025 ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies
DROP POLICY IF EXISTS "Enable insert for anonymous users" ON stats_review_2025;
DROP POLICY IF EXISTS "Enable read own data" ON stats_review_2025;
DROP POLICY IF EXISTS "Enable read all for admin" ON stats_review_2025;

-- Create policy to allow anonymous inserts
CREATE POLICY "Enable insert for anonymous users" ON stats_review_2025
    FOR INSERT TO public
    WITH CHECK (true);

-- Create policy to allow anonymous reads
CREATE POLICY "Enable read for anonymous users" ON stats_review_2025
    FOR SELECT TO public
    USING (true);

-- Create policy for admin to manage all data
CREATE POLICY "Enable all for admin" ON stats_review_2025
    FOR ALL TO authenticated
    USING (auth.role() = 'admin');

-- Create function to generate username from student name and phone
CREATE OR REPLACE FUNCTION generate_stats_username(student_name TEXT, student_phone TEXT)
RETURNS TEXT AS $$
DECLARE
    base_username TEXT;
    final_username TEXT;
    counter INTEGER := 0;
BEGIN
    -- Take first name and last 4 digits of phone
    base_username := 'std-' || right(student_phone, 4);
    
    -- Try base username first
    final_username := base_username;
    
    -- If username exists, append numbers until we find a unique one
    WHILE EXISTS (SELECT 1 FROM stats_review_2025 WHERE username = final_username) LOOP
        counter := counter + 1;
        final_username := base_username || counter::text;
    END LOOP;
    
    RETURN final_username;
END;
$$ LANGUAGE plpgsql;

-- Create function to generate a random password
CREATE OR REPLACE FUNCTION generate_stats_password()
RETURNS TEXT AS $$
DECLARE
    numbers TEXT := '0123456789';
    letters TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ'; -- Excluding similar looking characters
    result TEXT := '';
    i INTEGER;
BEGIN
    -- Generate 4 random numbers
    FOR i IN 1..4 LOOP
        result := result || substr(numbers, floor(random() * length(numbers) + 1)::integer, 1);
    END LOOP;
    
    -- Add one random letter
    result := result || substr(letters, floor(random() * length(letters) + 1)::integer, 1);
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically generate username and password
CREATE OR REPLACE FUNCTION set_stats_credentials()
RETURNS TRIGGER AS $$
BEGIN
    -- Generate username and password if not provided
    IF NEW.username IS NULL THEN
        NEW.username := generate_stats_username(NEW.student_name, NEW.student_phone);
    END IF;
    IF NEW.password IS NULL THEN
        NEW.password := generate_stats_password();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop and recreate the trigger
DROP TRIGGER IF EXISTS trigger_set_stats_credentials ON stats_review_2025;
CREATE TRIGGER trigger_set_stats_credentials
    BEFORE INSERT ON stats_review_2025
    FOR EACH ROW
    EXECUTE FUNCTION set_stats_credentials();