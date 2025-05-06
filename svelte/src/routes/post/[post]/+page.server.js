import { redirect } from '@sveltejs/kit';
import { checkAndGetPostInfo } from '$lib/db_posts.js';
import { getUserUUID } from '$lib/db.js';

const UUID_REGEX = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/
const LINK_MAX_TIME_MINS = 30

export const load = async (event) => {
    const session = await event.locals.auth();

    // user not logged
    if (!session) {
        throw redirect(303, '/');
    }

    const userId = session.user?.id
    const user_uuid = await getUserUUID(userId)
    if (!user_uuid) {
        throw redirect(303, '/');
    }

    const pathname = event.url.pathname
    const pathData = pathname.substring(6)

    let location
    let post_uuid
    if (!UUID_REGEX.test(pathData)) {
        try {
            const decoded = decodeURIComponent(pathname)
            const decodedData = Buffer.from(decoded.substring(6), 'base64').toString();
            const jsonObj = JSON.parse(decodedData)

            if (jsonObj.u !== user_uuid) {
                console.log("Unallowed user")
                return { success: false }
            } else if (jsonObj.t + LINK_MAX_TIME_MINS * 60 * 1000 <= Date.now()) {
                console.log("Link expired")
                return { success: false }
            }
            location = {
                lat: jsonObj.l[0],
                lon: jsonObj.l[1],
            }
            post_uuid = jsonObj.p
        } catch (error) {
            return { success: false }
        }
    } else {
        post_uuid = pathData
    }

    const postInfo = await checkAndGetPostInfo(post_uuid, user_uuid, location)

    if (postInfo?.success && postInfo.postInfo && postInfo.postInfo.length > 0) {
        let profileIsOwner = postInfo.postInfo[0].profile === user_uuid
        return { success: true, post: postInfo.postInfo[0], isOwner: profileIsOwner }
    }
    return { success: false }
}
