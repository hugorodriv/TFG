// Google
import { SvelteKitAuth } from "@auth/sveltekit"
import Google from "@auth/core/providers/google";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, AUTH_SECRET } from "$env/static/private"

// Postgres
import PostgresAdapter from "@auth/pg-adapter"
import { pool } from '$lib/db';


export const { handle, signIn, signOut } = SvelteKitAuth({
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

export async function isNewAccount(user) {
    // user.id comes from auth. should be safe 
    // (SQL injection and a malicious actor providing a fake user.id)
    // convert to int just to be super safe
    if (!user.id) {
        throw new Error("Invalid user ID");
    }
    if (isNaN(parseInt(user.id, 10))) {
        throw new Error("Invalid user ID");
    }

    const res = await pool.query('SELECT * FROM profiles WHERE "userId" = $1', [user.id]);

    // if no rows matching user id, we establish that user doesnt have an acc
    const existingUser = res.rows[0];

    return !Boolean(existingUser)
}
