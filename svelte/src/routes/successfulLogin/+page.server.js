import { fetchAccData } from "$lib/db.js";
import { isNewAccount } from '$lib/auth.js';
import { redirect } from '@sveltejs/kit';

// import { createCanvas } from 'canvas';

export const load = async (event) => {
    const session = await event.locals.auth();

    // user not logged
    if (!session) {
        throw redirect(303, '/');
    }

    // user logged in but is new account
    if (session && await isNewAccount(session.user)) {
        throw redirect(303, '/signup');
    }

    const accData = await fetchAccData(session?.user?.id)

    return {
        accData
    };
}
