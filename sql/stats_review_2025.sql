-- Drop everything related to stats_review_2025
DROP TRIGGER IF EXISTS trigger_set_stats_credentials ON stats_review_2025;
DROP TRIGGER IF EXISTS trigger_validate_payment_status ON stats_review_2025;
DROP FUNCTION IF EXISTS set_stats_credentials();
DROP FUNCTION IF EXISTS validate_payment_status_change();
DROP FUNCTION IF EXISTS generate_stats_username(TEXT, TEXT);
DROP FUNCTION IF EXISTS generate_stats_password();
DROP TABLE IF EXISTS stats_review_2025 CASCADE;

-- Recreate the table
CREATE TABLE stats_review_2025 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_name TEXT NOT NULL,
    student_phone TEXT NOT NULL UNIQUE,
    parent_phone TEXT NOT NULL,
    school_type TEXT NOT NULL CHECK (school_type IN ('azhar', 'general_arts')), -- الثانوي الازهري - الثانوي العامة (ادبي)
    attendance_type TEXT NOT NULL DEFAULT 'offline' CHECK (attendance_type IN ('zoom', 'offline')), -- نوع الحضور
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'under_review', 'accepted')),
    payment_proof_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('UTC'::text, now()) NOT NULL
);

-- Indexes
CREATE INDEX idx_stats_review_2025_student_phone ON stats_review_2025(student_phone);
CREATE INDEX idx_stats_review_2025_username ON stats_review_2025(username);

-- Enable Row Level Security
ALTER TABLE stats_review_2025 ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies
DROP POLICY IF EXISTS "Allow public registration" ON stats_review_2025;
DROP POLICY IF EXISTS "Enable read own data" ON stats_review_2025;
DROP POLICY IF EXISTS "Enable update own data" ON stats_review_2025;
DROP POLICY IF EXISTS "Enable all for admin" ON stats_review_2025;

-- Grant necessary permissions to roles
GRANT SELECT, INSERT ON stats_review_2025 TO anon;
GRANT ALL ON stats_review_2025 TO authenticated;

-- Create policies exactly matching the working registration table
-- Allow anyone to insert (register)
CREATE POLICY "Enable insert for anonymous users" ON stats_review_2025
    FOR INSERT TO anon
    WITH CHECK (true);

-- Allow anonymous users to read their own registration data
CREATE POLICY "Enable read own registration" ON stats_review_2025
    FOR SELECT TO anon
    USING (true);

-- Only allow authenticated users (admin) to view all registrations
CREATE POLICY "Enable read access for authenticated users only" ON stats_review_2025
    FOR SELECT TO authenticated
    USING (true);

-- Allow users to update their own payment proof
CREATE POLICY "Enable update payment proof" ON stats_review_2025
    FOR UPDATE TO public
    USING (true)
    WITH CHECK (
        (
            payment_proof_url IS NOT NULL OR
            payment_proof_url IS NULL
        )
    );

-- Functions and triggers for username/password and payment status
CREATE OR REPLACE FUNCTION generate_stats_username(student_name TEXT, student_phone TEXT)
RETURNS TEXT AS $$
DECLARE
    base_username TEXT;
    final_username TEXT;
    counter INTEGER := 0;
BEGIN
    base_username := 'std-' || right(student_phone, 4);
    final_username := base_username;
    WHILE EXISTS (SELECT 1 FROM stats_review_2025 WHERE username = final_username) LOOP
        counter := counter + 1;
        final_username := base_username || counter::text;
    END LOOP;
    RETURN final_username;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_stats_password()
RETURNS TEXT AS $$
DECLARE
    numbers TEXT := '0123456789';
    letters TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    result TEXT := '';
    i INTEGER;
BEGIN
    FOR i IN 1..4 LOOP
        result := result || substr(numbers, floor(random() * length(numbers) + 1)::integer, 1);
    END LOOP;
    result := result || substr(letters, floor(random() * length(letters) + 1)::integer, 1);
    RETURN result;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION set_stats_credentials()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.username IS NULL OR NEW.username = '' THEN
        NEW.username := generate_stats_username(NEW.student_name, NEW.student_phone);
    END IF;
    IF NEW.password IS NULL OR NEW.password = '' THEN
        NEW.password := generate_stats_password();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION validate_payment_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.payment_proof_url IS NOT NULL AND OLD.payment_proof_url IS NULL THEN
        NEW.payment_status := 'under_review';
        RETURN NEW;
    END IF;
    IF NEW.payment_status = 'accepted' AND OLD.payment_status != 'accepted' THEN
        IF auth.uid() != '4dba45ee-33a6-41cd-b0da-af7c1f7d9870' THEN
            RAISE EXCEPTION 'Only admin can accept payments';
        END IF;
    END IF;
    IF auth.uid() != '4dba45ee-33a6-41cd-b0da-af7c1f7d9870' THEN
        IF OLD.payment_status = 'pending' AND NEW.payment_status NOT IN ('pending', 'under_review') THEN
            RAISE EXCEPTION 'Invalid payment status transition';
        END IF;
        IF OLD.payment_status = 'under_review' AND NEW.payment_status != 'under_review' THEN
            RAISE EXCEPTION 'Cannot change status from under_review';
        END IF;
        IF OLD.payment_status = 'accepted' AND NEW.payment_status != 'accepted' THEN
            RAISE EXCEPTION 'Cannot change accepted status';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_set_stats_credentials
    BEFORE INSERT ON stats_review_2025
    FOR EACH ROW
    EXECUTE FUNCTION set_stats_credentials();

CREATE TRIGGER trigger_validate_payment_status
    BEFORE UPDATE ON stats_review_2025
    FOR EACH ROW
    EXECUTE FUNCTION validate_payment_status_change();
