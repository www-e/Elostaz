-- Create storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('statisticsrevision', 'statisticsrevision', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies
DROP POLICY IF EXISTS "Allow users to upload their own payment proofs" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to read their own payment proofs" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin to manage all payment proofs" ON storage.objects;

-- Create policy for users to upload their own payment proofs
CREATE POLICY "Allow users to upload their own payment proofs"
ON storage.objects FOR INSERT TO public
WITH CHECK (
    bucket_id = 'statisticsrevision' AND
    (storage.foldername(name))[1] = 'payment_proofs'
);

-- Create policy for users to read their own payment proofs
CREATE POLICY "Allow users to read their own payment proofs"
ON storage.objects FOR SELECT TO public
USING (
    bucket_id = 'statisticsrevision' AND
    (storage.foldername(name))[1] = 'payment_proofs'
);

-- Create policy for admin to manage all payment proofs
CREATE POLICY "Allow admin to manage all payment proofs"
ON storage.objects FOR ALL TO authenticated
USING (
    bucket_id = 'statisticsrevision' AND
    (storage.foldername(name))[1] = 'payment_proofs'
); 