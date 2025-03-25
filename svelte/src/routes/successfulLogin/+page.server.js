import { fetchAccData } from "$lib/db.js";
import { isNewAccount } from '$lib/auth.js';
import { redirect } from '@sveltejs/kit';

// import { createCanvas } from 'canvas';

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

    if (accData.img_url) {
        // TODO: populate from S3
        // fetch() accData.img_url ...
        accData.img = "placeholderImageData"
    } else {
        // no user image. will create a blue circle with first letter of the name in white

        const letter = accData.name.slice(0, 1).toUpperCase();
        const svg = `
        <svg width="50" height="50" xmlns="http://www.w3.org/2000/svg">
            <circle cx="25" cy="25" r="25" fill="#007BFF"/>
            <text x="25" y="25" font-size="25" fill="white" font-family="sans-serif"
                  text-anchor="middle" dominant-baseline="central">
                ${letter}
            </text>
        </svg>`;

        accData.img = `data:image/svg+xml;base64,${btoa(svg)}`;
    }

    return {
        accData,
        referer
    };
}
