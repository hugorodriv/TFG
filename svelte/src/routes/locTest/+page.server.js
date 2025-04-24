import { redirect } from '@sveltejs/kit';
import { isNewAccount } from "$lib/auth.js";
import { getPendingFriendships, getSentPendingFriendships, getFriendList } from '$lib/db_friendships';
import { getUserUUID } from '$lib/db';


/**
 * @param {{ locals: { auth: () => any; }; }} event
 */
export async function load(event) {
    const session = await event.locals.auth();

    // user not logged in
    if (!session) {
        throw redirect(303, '/');
    }

    // user exists but hasnt created acc yet
    if (await isNewAccount(session.user)) {
        throw redirect(303, '/');
    }

    const userId = session?.user?.id;

    if (!userId) {
        throw redirect(303, "/")
    }

    const uuid = await getUserUUID(userId)

    if (!uuid) {
        throw redirect(303, "/")
    }

}


