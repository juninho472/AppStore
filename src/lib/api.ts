import { supabase, uploadFile } from "./supabase";

export interface App {
  id: string;
  name: string;
  version: string;
  description: string;
  icon: string;
  apkUrl: string;
  downloads: number;
  created_at?: string;
  updated_at?: string;
}

class ApiService {
  async getApps(): Promise<App[]> {
    const { data, error } = await supabase
      .from("apps")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data.map((app) => ({
      ...app,
      icon: app.icon_url,
      apkUrl: app.apk_url,
    }));
  }

  async searchApps(query: string): Promise<App[]> {
    const { data, error } = await supabase
      .from("apps")
      .select("*")
      .or(`name.ilike.%${query}%,version.ilike.%${query}%`);

    if (error) throw error;
    return data.map((app) => ({
      ...app,
      icon: app.icon_url,
      apkUrl: app.apk_url,
    }));
  }

  async addApp(appData: {
    name: string;
    version: string;
    description: string;
    icon: File;
    apk: File;
  }): Promise<App> {
    const iconUrl = await uploadFile(appData.icon, "app-icons");
    const apkUrl = await uploadFile(appData.apk, "app-files");

    const { data, error } = await supabase
      .from("apps")
      .insert({
        name: appData.name,
        version: appData.version,
        description: appData.description,
        icon_url: iconUrl,
        apk_url: apkUrl,
        downloads: 0,
      })
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      icon: data.icon_url,
      apkUrl: data.apk_url,
    };
  }

  async deleteApp(id: string): Promise<void> {
    const { error } = await supabase.from("apps").delete().eq("id", id);

    if (error) throw error;
  }

  async incrementDownload(id: string): Promise<void> {
    const { error } = await supabase.rpc("increment_downloads", { app_id: id });
    if (error) throw error;
  }

  async signIn(email: string, password: string): Promise<boolean> {
    try {
      // First try to sign in with Supabase Auth
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (authError) {
        console.error("Auth error:", authError.message);
        return false;
      }

      // Then check if the user is in admin_users table
      const { data: adminUser, error: adminError } = await supabase
        .from("admin_users")
        .select("*")
        .eq("email", email)
        .single();

      if (adminError || !adminUser) {
        console.error("Not an admin user");
        await this.signOut(); // Sign out if not an admin
        return false;
      }

      return true;
    } catch (error) {
      console.error("Unexpected error during sign in:", error);
      return false;
    }
  }

  async signOut(): Promise<void> {
    await supabase.auth.signOut();
  }
}

export const api = new ApiService();
