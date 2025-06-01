-- Create enum types for grade levels and sections
CREATE TYPE grade_level AS ENUM ('first', 'second', 'third');
CREATE TYPE section_type AS ENUM ('general', 'statistics');
CREATE TYPE days_group AS ENUM (
    'sat_tue',      -- السبت والثلاثاء
    'sun_wed',      -- الأحد والأربعاء
    'mon_thu',      -- الاثنين والخميس
    'sat_tue_thu',  -- السبت والثلاثاء والخميس
    'sun_wed_fri'   -- الأحد والأربعاء والجمعة
);

-- Create the registration table
CREATE TABLE registrations_2025_2026 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_name TEXT NOT NULL,
    student_phone TEXT NOT NULL,
    parent_phone TEXT NOT NULL,
    grade grade_level NOT NULL,
    section section_type,
    days_group days_group NOT NULL,
    time_slot TIME NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('UTC'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('UTC'::text, now()) NOT NULL
);

-- Create an index on created_at for better query performance
CREATE INDEX idx_registrations_created_at ON registrations_2025_2026(created_at);

-- Enable Row Level Security
ALTER TABLE registrations_2025_2026 ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow anyone to insert (register)
CREATE POLICY "Enable insert for anonymous users" ON registrations_2025_2026
    FOR INSERT TO anon
    WITH CHECK (true);

-- Only allow authenticated users (admin) to view all registrations
CREATE POLICY "Enable read access for authenticated users only" ON registrations_2025_2026
    FOR SELECT TO authenticated
    USING (true);

-- Create a function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('UTC'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update updated_at
CREATE TRIGGER update_registrations_updated_at
    BEFORE UPDATE ON registrations_2025_2026
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create a unique constraint to prevent duplicate registrations
CREATE UNIQUE INDEX idx_unique_student_registration 
ON registrations_2025_2026(student_phone, grade)
WHERE grade != 'third';

-- For third grade students, allow registration in both sections
CREATE UNIQUE INDEX idx_unique_third_grade_registration 
ON registrations_2025_2026(student_phone, grade, section)
WHERE grade = 'third'; 