-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create apps table
CREATE TABLE apps (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR NOT NULL,
    version VARCHAR NOT NULL,
    description TEXT NOT NULL,
    icon_url TEXT NOT NULL,
    apk_url TEXT NOT NULL,
    downloads INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create function to increment downloads
CREATE OR REPLACE FUNCTION increment_downloads(app_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $
BEGIN
    UPDATE apps
    SET downloads = downloads + 1
    WHERE id = app_id;
END;
$;

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$ language 'plpgsql';

CREATE TRIGGER update_apps_updated_at
    BEFORE UPDATE ON apps
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Set up Row Level Security (RLS)
ALTER TABLE apps ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access"
    ON apps FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Allow authenticated insert"
    ON apps FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated update"
    ON apps FOR UPDATE
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated delete"
    ON apps FOR DELETE
    TO authenticated
    USING (true);