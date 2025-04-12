import { redirect } from '@sveltejs/kit';
import { isNewAccount } from "$lib/auth.js";
import { getPostInfo } from '$lib/db_posts.js';
import { getUserUUID } from '$lib/db.js';


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
    const user_uuid = await getUserUUID(userId)
    if (!user_uuid) {
        throw redirect(303, '/');
    }

    const pathname = event.url.pathname

    const post_uuid = pathname.substring(6)

    const location = event.url.searchParams.get("location")
    const postInfo = await getPostInfo(post_uuid, user_uuid, location)

    if (postInfo?.success && postInfo.postInfo && postInfo.postInfo.length > 0) {
        let profileIsOwner = postInfo.postInfo[0].profile === user_uuid
        return { success: true, post: postInfo.postInfo[0], isOwner: profileIsOwner }
    }
    return { success: false }


}
