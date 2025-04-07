import { json } from "@sveltejs/kit";
import { error } from "@sveltejs/kit";
import { USERNAME_REGEX } from "$lib/db.js";
import { searchUsername } from "$lib/db_friendships.js";

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
    const username = body.username

    if (!USERNAME_REGEX.test(username)) {
        error(400)
    }

    const response = await searchUsername(username)
    if (response?.success) {
        return json({ list: response.results })
    } else {
        error(500)
    }

}

