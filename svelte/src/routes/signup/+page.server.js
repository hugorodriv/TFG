import { redirect } from '@sveltejs/kit';
import { isNewAccount } from "$lib/auth.js";
import { checkAvailableUsername, checkUsernameCorrect, createUser } from "$lib/db.js"

/**
 * @type {any}
 */
let userId;
export async function load(event) {
    const session = await event.locals.auth();

    // user not logged in
    if (!session) {
        throw redirect(303, '/');
    }

    // user exists but not a new acc
    if (!isNewAccount(session.user)) {
        throw redirect(303, '/home');
    }

    // new acc
    userId = session.user.id
    return {
        session
    };
}


// check if username is avaliable
// & dynamically update tag to let user know + colors!
// also update tag with length constraints (lets say 4 chars min, 20 max. symbols allowed _ - . )
// but also check on submission
//
// grab first 500 chars of Bio
// !!!! HIGH SQL injection potential. gotta b very careful here

// async function checkUsername(username) {
//
//     return true
// }
//
//
//
export const actions = {
    default: async ({ request, locals }) => {
        const formData = await request.formData();
        const username = String(formData.get('username') || '');

        // enforce 500 char limit
        const bio = String(formData.get('bio') || '').slice(0, 500);

        // CHECK USERNAME
        const isCorrect = checkUsernameCorrect(username)
        if (!isCorrect) {
            return {
                error: 'Username must be between 4 and 20 characters and can only contain letters, numbers and - _ symbols',
                username: username,
                bio: bio
            };
        }

        const isAvailable = await checkAvailableUsername(username);
        if (!isAvailable) {
            return {
                error: 'Username is already in use',
                username: username,
                bio: bio
            };
        }


        // write to database new acc
        await createUser(userId, { username: username, bio: bio })
    }
};
