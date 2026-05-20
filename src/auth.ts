import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const res = await fetch(`${process.env.API_BASE_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            username: credentials.email as string,
            password: credentials.password as string,
          }),
        });

        if (!res.ok) return null;

        const data = await res.json();
        const { access_token, role } = data;

        // Decode JWT payload to get user info
        const payload = JSON.parse(
          Buffer.from(access_token.split(".")[1], "base64").toString(),
        );

        return {
          id: String(payload.sub),
          email: payload.email ?? (credentials.email as string),
          name: payload.username ?? null,
          role,
          accessToken: access_token,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.accessToken = user.accessToken;
        token.sub = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.sub as string;
      session.user.role = token.role as string;
      session.user.accessToken = token.accessToken as string;
      return session;
    },
  },
  pages: { signIn: "/login" },
  session: { maxAge: 86400 },
});
