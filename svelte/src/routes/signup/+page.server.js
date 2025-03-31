import { redirect } from '@sveltejs/kit';
import { isNewAccount } from "$lib/auth.js";
import { checkAvailableUsername, checkUsernameCorrect, createUser } from "$lib/db.js"

export async function load(event) {
    const session = await event.locals.auth();

    // user not logged in
    if (!session) {
        throw redirect(303, '/');
    }

    // user exists but not a new acc
    if (!await isNewAccount(session.user)) {
        throw redirect(303, '/profile/');
    }

    // new acc
    return {
        session
    };
}


export const actions = {
    default: async ({ request, locals }) => {
        const session = await locals.auth();
        const userId = session?.user?.id;

        const formData = await request.formData();
        const username = String(formData.get('username') || '');


        // CHECK USERNAME
        const isCorrect = checkUsernameCorrect(username)
        if (!isCorrect) {
            return {
                error: true
            };
        }

        const isAvailable = await checkAvailableUsername(username);
        if (!isAvailable) {
            return {
                error: true
            };
        }

        // Name
        const name = String(formData.get('name') || '').slice(0, 50);
        if (name.length < 1) {
            return { error: true }
        }

        // write new acc to database
        const correct = await createUser(userId, { username: username, name: name })
        if (correct) {
            throw redirect(303, '/profile/');
        }
        return {
            error: true
        }
    }
};
