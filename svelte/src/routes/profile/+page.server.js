import { redirect } from '@sveltejs/kit';
import { getUserUUID } from '$lib/db';
import { getUserPosts } from '$lib/db_posts';


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


    const posts = await getUserPosts(uuid)
    if (posts?.success) {
        return { posts: posts.posts }
    }

}


