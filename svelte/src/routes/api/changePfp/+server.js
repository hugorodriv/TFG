import { json } from "@sveltejs/kit";
import { error } from "@sveltejs/kit";
import { uploadPresignedPfp } from "$lib/s3.js";
import { getUserUUID, pool } from "$lib/db.js";

export async function GET({ locals }) {

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
    const uuid = await getUserUUID(userId)

    if (!uuid) {
        error(500)
    }


    // get pfp link
    const { uploadUrl, filename, publicUrl } = await uploadPresignedPfp(uuid)
        .catch(async () => {
            error(500)
        })

    // update DB with new link
    // TODO: probably redundant, as it is the same URL every time (only depends on user)
    try {
        await pool.query('UPDATE profiles SET img_url = $2 WHERE userId = $1', [userId, publicUrl]);
    } catch (e) {
        error(500)
    }

    return json({ "success": true, "url": uploadUrl, "filename": filename })
}

