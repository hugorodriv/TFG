import { redirect } from '@sveltejs/kit';
import { isNewAccount } from '$lib/auth.js';



export const load = async (event) => {
    const session = await event.locals.auth();
    const url = event.url;

    // user logged in and is new account
    if (session && await isNewAccount(session.user) && url.pathname !== '/signup') {
        throw redirect(303, '/signup');
    }

    return {
        session,
    };
};
