import { json } from "@sveltejs/kit";
import { error } from "@sveltejs/kit";
import { USERNAME_REGEX, NAME_REGEX } from "$lib/db.js";
import { searchUser } from "$lib/db_friendships.js";

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
    const searchQuery = body.searchQuery

    if (!USERNAME_REGEX.test(searchQuery) && !NAME_REGEX.test(searchQuery)) {
        error(400)
    }

    const response = await searchUser(searchQuery)
    if (response?.success) {
        return json({ list: response.results })
    } else {
        error(500)
    }

}

