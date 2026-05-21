import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    role: string;
    accessToken: string;
    is_active?: boolean;
    about_me?: string | null;
    profile?: string | null;
    created_at?: string;
  }
  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    accessToken: string;
  }
}
