-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('app-icons', 'app-icons', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('app-files', 'app-files', true);

-- Set up storage policies
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

-- Set up CORS policy for storage
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
    ('app-icons', 'app-icons', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/gif']),
    ('app-files', 'app-files', true, 104857600, ARRAY['application/vnd.android.package-archive']);