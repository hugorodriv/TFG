import { redirect } from '@sveltejs/kit';
import { isNewAccount } from "$lib/auth.js";

export async function load(event) {
    const session = await event.locals.auth();

    // user not logged in
    if (!session) {
        throw redirect(303, '/');
    }

    // user exists but not a new acc
    if (!isNewAccount(session.user)) {
        throw redirect(303, '/home');
    }

    // new acc
    return {
        session
    };
}
