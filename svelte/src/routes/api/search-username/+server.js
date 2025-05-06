import { json } from "@sveltejs/kit";
import { error } from "@sveltejs/kit";
import { searchUser } from "$lib/db_friendships.js";
const regex = /[a-zA-Z0-9._\- ]+/;

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

    const match = searchQuery.match(regex);

    const clean_string = match?.[0].trim().slice(0, 50);

    if (!clean_string) {
        return json({});
    }

    const response = await searchUser(clean_string)

    if (response?.success) {
        return json({ list: response.results })
    } else {
        error(500)
    }

}

