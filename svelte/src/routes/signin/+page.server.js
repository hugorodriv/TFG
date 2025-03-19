import { signIn } from "$lib/auth.js"

export const actions = {
    default: async (event) => {
        return await signIn(event)
    }
};
