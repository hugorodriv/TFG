// Google
import { SvelteKitAuth } from "@auth/sveltekit"
import Google from "@auth/core/providers/google";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, AUTH_SECRET } from "$env/static/private"

// Postgres
import PostgresAdapter from "@auth/pg-adapter"
import { pool } from '$lib/db';

export const { handle, signIn, signOut } = SvelteKitAuth({
    // strategy: "database",
    adapter: PostgresAdapter(pool),
    providers: [
        Google({ clientId: GOOGLE_CLIENT_ID, clientSecret: GOOGLE_CLIENT_SECRET })
    ],
    secret: AUTH_SECRET,
    callbacks: {
        async session({ session, user }) {
            if (user) {
                session.user.id = user.id;
            }
            return session;
        },
    },
});
