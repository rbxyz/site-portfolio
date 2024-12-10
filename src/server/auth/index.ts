import NextAuth from "next-auth";
import { unstable_cache } from "next/cache"; // Usar o unstable_cache

import { authConfig } from "./config";

const { auth: uncachedAuth, handlers, signIn, signOut } = NextAuth(authConfig);

const auth = unstable_cache(uncachedAuth, ['auth']); // Chave para cache

export { auth, handlers, signIn, signOut };
