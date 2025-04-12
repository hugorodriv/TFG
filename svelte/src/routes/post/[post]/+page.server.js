import { redirect } from '@sveltejs/kit';
import { isNewAccount } from "$lib/auth.js";
import { fetchAccDataFromUsername, getUserUUID, USERNAME_REGEX } from '$lib/db.js';
import { getFriendshipStatus } from '$lib/db_friendships.js';


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

    const userId = session.user?.id

    const pathname = event.url.pathname

    const post_uuid = pathname.substring(6)


}
