export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      admin_users: {
        Row: {
          id: string;
          email: string;
          password_hash: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          password_hash: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          password_hash?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      apps: {
        Row: {
          id: string;
          name: string;
          version: string;
          description: string;
          icon_url: string;
          apk_url: string;
          downloads: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          version: string;
          description: string;
          icon_url: string;
          apk_url: string;
          downloads?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          version?: string;
          description?: string;
          icon_url?: string;
          apk_url?: string;
          downloads?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
