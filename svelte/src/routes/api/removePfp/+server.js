import { json } from "@sveltejs/kit";
import { error } from "@sveltejs/kit";
import { removePfpS3, uploadPresignedPfp } from "$lib/s3.js";
import { getUserUUID, removePfpDB } from "$lib/db.js";

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
    const res_aws = await removePfpS3(uuid)
    const success_db = await removePfpDB(uuid)


    if (res_aws.success && success_db) {
        return json({ "success": true })
    } else {
        console.log("Error while removing pfp: ", res_aws.error)
        error(500)
    }


}

