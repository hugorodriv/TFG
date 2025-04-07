import { redirect } from '@sveltejs/kit';
import { isNewAccount } from "$lib/auth.js";
import { getPendingFriendships, getSentPendingFriendships } from '$lib/db_friendships';


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

    // TODO: Load friend requests that are pending for the current user
    try {
        const p_friendships = await getPendingFriendships(userId)
        const sent_p_frienships = await getSentPendingFriendships(userId)

        // return { pending: p_friendships, sentPending: sent_p_frienships }
        //
        return { pending: p_friendships, sentPending: sent_p_frienships }

    } catch (error) {
        console.log("Error: ", error)
        return {}
    }

}


