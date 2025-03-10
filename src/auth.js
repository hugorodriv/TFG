import { SvelteKitAuth } from "@auth/sveltekit";
import Google from "@auth/core/providers/google";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "$env/static/private"

export const { handle } = SvelteKitAuth({
    providers: [
        Google({
            clientId: GOOGLE_CLIENT_ID, clientSecret: GOOGLE_CLIENT_SECRET
        })
    ],
    session: { strategy: "jwt", },

    // This runs everytime "something" happens
    callbacks: {
        // JWT get sent to server?
        async jwt({ token, account, profile }) {
            if (account) {
                token.accessToken = account.access_token;
                token.id = profile?.sub;
                token.email = profile?.email;
            }
            return token
        },
        async session({ session, token, user }) {
            session.user.id = token.accessToken;
            session.user.email = token.email;
            return session
        }
        // JWT changed? (to update session)

    }

    // TODO: JWT handling

})
