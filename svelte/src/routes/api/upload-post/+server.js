import { json } from "@sveltejs/kit";
import { error } from "@sveltejs/kit";
import { getUserUUID } from "$lib/db.js";
import { uploadPost } from "$lib/db_posts.js";
import { getUploadPostLink } from "$lib/s3.js";

export async function POST({ locals, request }) {

    // Stategy: Recieve all info, put on database.
    // Generate S3 upload url, send to user, they will upload clientside

    if (!locals) {
        error(401)
    }
    const session = await locals.auth();
    const userId = session?.user?.id

    if (!userId) {
        error(401)
    }
    const profile_uuid = await getUserUUID(userId)
    if (!profile_uuid) {
        error(401)
    }

    const body = await request.json()

    // const location = await body.location
    const recievedLocation = await body.location
    const resolved_location = await body.resolved_location
    const location =
    {
        "type": "Point",
        "coordinates": [recievedLocation.long, recievedLocation.lat]
    }
    const text = await body.postText

    const post_uuid = await uploadPost(profile_uuid, text, location, resolved_location)

    if (!post_uuid) {
        error(500)
    }

    // Now, generate upload post link for sending to user

    const uploadLink = await getUploadPostLink(post_uuid)
    if (uploadLink) {
        return json({ success: true, uploadLink: uploadLink.uploadUrl, post_uuid: post_uuid })
    }
    error(500)

}

