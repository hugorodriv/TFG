import { redirect } from '@sveltejs/kit';
import { isNewAccount } from '$lib/auth.js';

export const load = async (event) => {
    const session = await event.locals.auth();
    const url = event.url;

    // user not logged in and trying to access /signup
    if (!session && url.pathname === '/signup') {
        throw redirect(303, '/');
    }

    // user logged in and is new account
    if (session && await isNewAccount(session.user) && url.pathname !== '/signup') {
        throw redirect(303, '/signup');
    }

    // user logged in, but is not new acc
    if (session && !isNewAccount(session.user) && url.pathname === '/signup') {
        throw redirect(303, '/home');
    }

    return {
        session
    };
};
