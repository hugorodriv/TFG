import { json } from "@sveltejs/kit";
import { error } from "@sveltejs/kit";
import { removePfpS3, removePostS3, uploadPresignedPfp } from "$lib/s3.js";
import { getUserUUID, removePfpDB } from "$lib/db.js";
import { checkAndChangePostText, checkAndRemovePost } from "$lib/db_posts.js";

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

    const body = await request.json()
    const post_uuid = await body.post_uuid
    const newText = await body.newText

    const res = await checkAndChangePostText(post_uuid, user_uuid, newText)

    if (res?.success) {
        const ress3 = await removePostS3(post_uuid)
        if (ress3?.success) {
            return json({ "success": true })
        }
    }
    error(500)

}

