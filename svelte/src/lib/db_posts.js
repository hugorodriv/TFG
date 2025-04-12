import { pool } from "./db";
import { getPrivateLinkPost } from "./s3";

/**
 * @param {String} profile_uuid
 * @param {String} text
 */
export async function uploadPost(profile_uuid, text, location) {

    // check profile UUID
    // check location
    // check description
    try {
        const query = `
            INSERT INTO posts
            (profile, text, location) VALUES ($1, $2, $3)
            RETURNING post_uuid`
        const res = await pool.query(query, [profile_uuid, text, location]);

        // return the post UUID
        return res.rows[0].post_uuid;
    } catch (error) {
        console.log(error)
        return false;
    }
}

