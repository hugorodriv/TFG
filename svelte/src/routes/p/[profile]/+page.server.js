import { redirect } from '@sveltejs/kit';
import { fetchAccDataFromUsername, getUserUUID, USERNAME_REGEX } from '$lib/db.js';
import { getFriendshipStatus } from '$lib/db_friendships.js';
import { getUserPosts } from '$lib/db_posts.js';


export const load = async (event) => {
    const session = await event.locals.auth();

    // user not logged
    if (!session) {
        throw redirect(303, '/');
    }

    const userId = session.user?.id

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

        const userUuid = await getUserUUID(userId)
        const friendshipStatus = await getFriendshipStatus(userUuid, userdata.uuid)

        if (friendshipStatus === "ACCEPTED") {
            const friendPosts = await getUserPosts(userdata.uuid)
            if (friendPosts?.success) {
                return { success: true, userdata: userdata, friendshipStatus: friendshipStatus, friendPosts: friendPosts.posts }
            }
        }
        return { success: true, userdata: userdata, friendshipStatus: friendshipStatus }
    } catch (error) {
        return { success: false }
    }

}
