-- Create storage buckets if they don't exist
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('app-icons', 'app-icons', true),
    ('app-files', 'app-files', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete" ON storage.objects;

-- Create new policies
CREATE POLICY "Public Access"
    ON storage.objects FOR SELECT
    USING (bucket_id IN ('app-icons', 'app-files'));

CREATE POLICY "Authenticated users can upload"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id IN ('app-icons', 'app-files'));

CREATE POLICY "Authenticated users can delete"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id IN ('app-icons', 'app-files'));

-- Update bucket configurations
UPDATE storage.buckets
SET public = true,
    file_size_limit = CASE 
        WHEN id = 'app-icons' THEN 5242880  -- 5MB for icons
        WHEN id = 'app-files' THEN 104857600  -- 100MB for APK files
    END,
    allowed_mime_types = CASE
        WHEN id = 'app-icons' THEN ARRAY['image/jpeg', 'image/png', 'image/gif']
        WHEN id = 'app-files' THEN ARRAY['application/vnd.android.package-archive']
    END
WHERE id IN ('app-icons', 'app-files');