import { json } from "@sveltejs/kit";
import { error } from "@sveltejs/kit";
import { getUserUUID } from "$lib/db.js";
import { getPostsWithinDistance } from "$lib/db_posts.js";
import { getViewableLinks } from "$lib/s3.js";

export async function POST({ locals, request }) {

    // authorize API call
    if (!locals) {
        error(401)
    }
    const session = await locals.auth();
    const userId = session?.user?.id

    if (!userId) {
        error(401)
    }



    // PFP are encoded using UUIDs rather than userids, which are incremental
    const user_uuid = await getUserUUID(userId)

    if (!user_uuid) {
        error(500)
    }

    const { userPosition, bounds, number } = await request.json();

    const resDB = await getPostsWithinDistance(bounds.NE.lat, bounds.NE.lng, bounds.SW.lat, bounds.SW.lng, userPosition, number, user_uuid)
    if (!resDB?.posts?.length || !resDB?.success) {
        return json({ "success": true })
    }

    // now we have to grab a viewable link for each post
    const img_urls = await getViewableLinks(resDB.posts.map(row => row.post_uuid))
    if (!img_urls) {
        error(500)
    }
    const postsWithLink = resDB.posts.map((post, index) => ({
        ...post,
        post_url: "/post/" + post.post_uuid,
        img_url: img_urls[index] || null,
    }));
    return json({ "success": true, posts: postsWithLink })


}

