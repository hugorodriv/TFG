import { json } from "@sveltejs/kit";
import { error } from "@sveltejs/kit";
import { getUserUUID } from "$lib/db.js";
import { deleteFriendship } from "$lib/db_friendships.js";

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
    const body = await request.json()

    //comes from POST req. have to check
    const receiver_uuid = await body.receiver_uuid

    // safe. managed internally
    const sender_uuid = await getUserUUID(userId)

    if (receiver_uuid === sender_uuid) {
        error(401)
    }
    const res = await deleteFriendship(sender_uuid, receiver_uuid)
    const success = res.success
    if (success) {
        return json({ success: true })
    } else {
        error(500)
    }

}

