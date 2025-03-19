import { redirect } from '@sveltejs/kit';
import { isNewAccount } from "$lib/auth.js";
import { fetchAccData, updateAccDetails } from "$lib/db.js"


/**
 * @param {{ locals: { auth: () => any; }; }} event
 */
export async function load(event) {
    const session = await event.locals.auth();

    // user not logged in
    if (!session) {
        throw redirect(303, '/');
    }

    // user exists but not a new acc
    if (await isNewAccount(session.user)) {
        throw redirect(303, '/');
    }

    const accData = await fetchAccData(session?.user?.id)
    const email = session.user?.email

    return {
        accData,
        email
    };
}


export const actions = {

    default: async ({ request, locals }) => {
        const session = await locals.auth();
        const userId = session?.user?.id;

        const formData = await request.formData();
        const name = String(formData.get('name')).slice(0, 20);
        const bio = String(formData.get('bio')).slice(0, 500);
        if (name === '') {
            return { error: true }
        }

        const correct = await updateAccDetails(userId, { name: name, bio: bio })

        if (correct) {
            return {
                success: true,
                data: { name: name, bio: bio }
            }
        }

        return {
            error: true,
            data: { name: name, bio: bio }
        }
    }
}
