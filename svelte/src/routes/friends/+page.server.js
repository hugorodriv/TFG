import { redirect } from '@sveltejs/kit';
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

    const userId = session?.user?.id;

    if (!userId) {
        throw redirect(303, "/")
    }

    const uuid = await getUserUUID(userId)

    if (!uuid) {
        throw redirect(303, "/")
    }

    try {
        const p_friendships = await getPendingFriendships(uuid)
        const sent_p_frienships = await getSentPendingFriendships(uuid)
        const friendList = await getFriendList(uuid)

        return { pending: p_friendships.pending, sentPending: sent_p_frienships.pending, friendList: friendList?.friendList }

    } catch (error) {
        console.log("Error: ", error)
        return {}
    }

}


