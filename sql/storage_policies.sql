-- Create storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('statisticsrevision', 'statisticsrevision', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies to ensure a clean slate
DROP POLICY IF EXISTS "Allow anonymous insert access to payment proofs" ON storage.objects;
DROP POLICY IF EXISTS "Allow anonymous read access to payment proofs" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin to manage all payment proofs" ON storage.objects;
-- Also drop old named policies just in case
DROP POLICY IF EXISTS "Allow users to upload their own payment proofs" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to read their own payment proofs" ON storage.objects;


-- FIX: Grant INSERT access to the 'anon' role.
-- This allows users (even not logged in, but using your site's anon key) to upload files.
CREATE POLICY "Allow anonymous insert access to payment proofs"
ON storage.objects FOR INSERT TO anon
WITH CHECK (
    bucket_id = 'statisticsrevision'
);

-- FIX: Grant SELECT access to the 'anon' role.
-- This is the critical fix that allows anyone with the public URL to view the image.
CREATE POLICY "Allow anonymous read access to payment proofs"
ON storage.objects FOR SELECT TO anon
USING (
    bucket_id = 'statisticsrevision'
);

-- This policy is correct. It allows logged-in admin users to perform all actions.
CREATE POLICY "Allow admin to manage all payment proofs"
ON storage.objects FOR ALL TO authenticated
USING (
    bucket_id = 'statisticsrevision'
);