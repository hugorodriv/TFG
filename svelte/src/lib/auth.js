import { dev } from '$app/environment';

// Google
import { SvelteKitAuth } from "@auth/sveltekit"
import Google from "@auth/core/providers/google";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, AUTH_SECRET, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from "$env/static/private"

// Postgres
import PostgresAdapter from "@auth/pg-adapter"
import { pool } from '$lib/db';

// Github
import GitHub from "@auth/core/providers/github";

export const { handle, signIn, signOut } = SvelteKitAuth({
    adapter: PostgresAdapter(pool),
    providers: [
        Google({ clientId: GOOGLE_CLIENT_ID, clientSecret: GOOGLE_CLIENT_SECRET }),

        // Only include github config in dev env
        ...(dev ? [GitHub({ clientId: GITHUB_CLIENT_ID, clientSecret: GITHUB_CLIENT_SECRET })] : [])
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
    trustHost: true,
});

/**
 * @param {{ id: Number; }} user
 */
export async function isNewAccount(user) {
    if (!user.id) {
        throw new Error("Invalid user ID");
    }

    const { rowCount } = await pool.query(
        'SELECT 1 FROM profiles WHERE _id = $1',
        [user.id]
    );

    return rowCount === 0;
}
