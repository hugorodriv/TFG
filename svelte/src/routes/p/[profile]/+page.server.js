import { redirect } from '@sveltejs/kit';
import { isNewAccount } from "$lib/auth.js";
import { fetchAccDataFromUsername, USERNAME_REGEX } from '$lib/db.js';


export const load = async (event) => {
    const session = await event.locals.auth();

    // user not logged
    if (!session) {
        throw redirect(303, '/');
    }

    // user logged in but is new account
    if (session && await isNewAccount(session.user)) {
        throw redirect(303, '/');
    }


    const pathname = event.url.pathname
    //event.url.pathname is /p/**username***
    const username = pathname.substring(3)


    if (!USERNAME_REGEX.test(username)) {
        return { success: false }
    }


    try {
        const userdata = await fetchAccDataFromUsername(username)
        if (userdata.length < 1) {
            return { success: true, userdata: null }
        }
        return { success: true, userdata: userdata }
    } catch (error) {
        return { success: false }
    }

}
