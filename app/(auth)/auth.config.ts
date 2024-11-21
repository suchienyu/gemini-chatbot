import { NextAuthConfig } from "next-auth";

export const authConfig = {
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
  pages: {
    signIn: "/login",
    newUser: "/",
  },
  providers: [
    // added later in auth.ts since it requires bcrypt which is only compatible with Node.js
    // while this file is also used in non-Node.js environments
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      let isLoggedIn = !!auth?.user;
      let isOnChat = nextUrl.pathname === "/";
      let isOnRegister = nextUrl.pathname === "/register"; 
      let isOnLogin = nextUrl.pathname === "/login";
      console.log("isOnChat",isOnChat,"isOnRegister",isOnRegister,"isOnLogin",isOnLogin)
      console.log("new url",new URL("/", nextUrl))
      console.log("nexturl",nextUrl)
      if (isLoggedIn && (isOnLogin || isOnRegister)) {
        console.log("!!!!")
        return Response.redirect(new URL("/", nextUrl));
      }

      if (isOnRegister || isOnLogin) {
        console.log("#######")
        return true; // Always allow access to register and login pages
      }

      if (isOnChat) {
        console.log("~~~~~~")
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }

      if (isLoggedIn) {
        console.log("@@@@@")
        return Response.redirect(new URL("/", nextUrl));
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
