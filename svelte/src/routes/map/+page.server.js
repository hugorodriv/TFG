import { redirect } from '@sveltejs/kit';


/**
 * @param {{ locals: { auth: () => any; }; }} event
 */
export async function load(event) {
    const session = await event.locals.auth();

    // user not logged in
    if (!session) {
        throw redirect(303, '/');
    }

    const userId = session?.user?.id;

    if (!userId) {
        throw redirect(303, "/")
    }

}


