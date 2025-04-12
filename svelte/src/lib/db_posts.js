import { pool } from "./db";
import { getPrivateLinkPost, getViewableLinks } from "./s3";

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

/**
 * @param {String} uuid
 */
export async function getUserPosts(uuid) {
    try {
        // Get pending friend requests sent by the user with receiver username
        const query = `
            SELECT post_uuid, text, location, created_at FROM posts
            WHERE profile = $1`
        let { rows } = await pool.query(query, [uuid]);

        // now, with this object that contains all the posts UUIDs, we have to
        // generate an array of links with which the user can see the objects

        const img_url_arr = await getViewableLinks(rows.map(row => row.post_uuid))
        if (!img_url_arr) {
            return
        }

        rows = rows.map((row, index) => ({
            ...row,
            img_url: img_url_arr[index],
        }));

        return { success: true, posts: rows }
    } catch (error) {
        console.log(error)
        return { success: false }
    }
}
