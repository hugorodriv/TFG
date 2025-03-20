import { fetchAccData } from "$lib/db.js";
import { isNewAccount } from '$lib/auth.js';
import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
    const session = await event.locals.auth();

    // as this will auto redirect, we dont always want to send the user to "/", maybe they came from somewhere else....
    const referer = event.request.headers.get('referer') || '/';


    // user not logged
    if (!session) {
        throw redirect(303, '/');
    }

    // user logged in but is new account
    if (session && await isNewAccount(session.user)) {
        throw redirect(303, '/signup');
    }

    const accData = await fetchAccData(session?.user?.id)

    // TODO: populate from S3
    // fetch() accData.img_url ...
    accData.img = "placeholderImageData"
    return {
        accData,
        referer
    };
}
