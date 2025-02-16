-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create apps table
CREATE TABLE IF NOT EXISTS apps (
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
AS $$
BEGIN
    UPDATE apps
    SET downloads = downloads + 1
    WHERE id = app_id;
END;
$$;

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for both tables
DROP TRIGGER IF EXISTS update_apps_updated_at ON apps;
CREATE TRIGGER update_apps_updated_at
    BEFORE UPDATE ON apps
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_admin_users_updated_at ON admin_users;
CREATE TRIGGER update_admin_users_updated_at
    BEFORE UPDATE ON admin_users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Set up Row Level Security (RLS)
ALTER TABLE apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for apps table
DROP POLICY IF EXISTS "Allow public read access" ON apps;
CREATE POLICY "Allow public read access"
    ON apps FOR SELECT
    TO public
    USING (true);

DROP POLICY IF EXISTS "Allow admin insert" ON apps;
CREATE POLICY "Allow admin insert"
    ON apps FOR INSERT
    TO authenticated
    WITH CHECK (EXISTS (
        SELECT 1 FROM admin_users
        WHERE admin_users.email = auth.jwt() ->> 'email'
    ));

DROP POLICY IF EXISTS "Allow admin update" ON apps;
CREATE POLICY "Allow admin update"
    ON apps FOR UPDATE
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM admin_users
        WHERE admin_users.email = auth.jwt() ->> 'email'
    ));

DROP POLICY IF EXISTS "Allow admin delete" ON apps;
CREATE POLICY "Allow admin delete"
    ON apps FOR DELETE
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM admin_users
        WHERE admin_users.email = auth.jwt() ->> 'email'
    ));

-- Create policies for admin_users table
DROP POLICY IF EXISTS "Allow admin read" ON admin_users;
CREATE POLICY "Allow admin read"
    ON admin_users FOR SELECT
    TO authenticated
    USING (email = auth.jwt() ->> 'email');

-- Insert a default admin user
INSERT INTO admin_users (email, password_hash)
VALUES ('admin@example.com', 'not_used_directly_using_supabase_auth')
ON CONFLICT (email) DO NOTHING;

-- Insert sample apps
INSERT INTO apps (name, version, description, icon_url, apk_url, downloads)
VALUES 
('Sample App 1', '1.0.0', 'A powerful application that helps you be more productive.', 
 'https://api.dicebear.com/7.x/avataaars/svg?seed=app1', '/apps/sample1.apk', 150),
('Sample App 2', '2.1.0', 'An entertainment app that brings joy to your daily life.', 
 'https://api.dicebear.com/7.x/avataaars/svg?seed=app2', '/apps/sample2.apk', 300)
ON CONFLICT DO NOTHING;