import { checkAvailableUsername, checkUsernameCorrect, MAX_USERNAME_LENGTH, MIN_USERNAME_LENGTH } from "$lib/db.js"
import { json } from '@sveltejs/kit';
import { error } from "@sveltejs/kit";

export async function GET({ url, locals }) {

    // authorize API call
    if (!locals) {
        error(401)
    }
    const session = await locals.auth();

    if (!session?.user) {
        error(401)
    }

    const username = url.searchParams.get('username');
    if (!username) {
        return json({ status: "error" })
    }

    let correct = checkUsernameCorrect(username)
    if (!correct) {
        return json({ status: 'invalid' });
    }
    try {
        const isAvailable = await checkAvailableUsername(username);

        if (isAvailable === true) {
            return json({ status: 'available' });
        } else if (isAvailable === false) {
            return json({ status: 'unavailable' });
        } else {
            return json({ status: 'error' });
        }
    } catch (error) {
        console.error('Error checking username:', error);
        return json({ status: 'error' });
    }
}

