import { pool } from "./db";
import { getViewableLinks } from "./s3";

const ALLOWED_RADIUS = 10_000

/**
 * @param {String} profile_uuid
 * @param {String} text
 * @param {{ type: string; coordinates: any[]; }} location
 * @param {any} resolved_location
 */
export async function uploadPost(profile_uuid, text, location, resolved_location) {

    // check profile UUID
    // check location
    // check description
    try {
        const query = `
            INSERT INTO posts
            (profile, text, location, resolved_location) VALUES ($1, $2, $3, $4)
            RETURNING post_uuid`
        const res = await pool.query(query, [profile_uuid, text, location, resolved_location]);

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
        const query = `
            SELECT post_uuid, text, location, created_at FROM posts
            WHERE profile = $1 ORDER BY created_at DESC`
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

/**
 * @param {string} post_uuid
 * @param {any} user_uuid
 * @param {any} location
 */
export async function checkAndGetPostInfo(post_uuid, user_uuid, location) {

    // User has permission to view post if:

    // Is the poster
    // Is poster's friend
    // Is close to the post
    let queryStr, args
    if (location?.lat && location?.lon) {
        queryStr = `
        SELECT post_uuid, text, resolved_location, created_at, profile FROM posts
        WHERE post_uuid = $1 AND ST_DWithin(
            location::geography,
            ST_MakePoint($3, $2)::geography,
            $4
        )
        LIMIT 1
        `
        args = [post_uuid, location.lat, location.lon, ALLOWED_RADIUS]
    } else {
        queryStr = `
        SELECT post_uuid, text, resolved_location, created_at, profile FROM posts
        WHERE post_uuid = $1 AND (
            profile = $2 OR are_friends(profile, $2)
        )
        LIMIT 1
        `
        args = [post_uuid, user_uuid]
    }
    try {
        const res = await pool.query(queryStr, args);
        let { rows } = res
        // now, with this object that contains all the posts UUIDs, we have to
        // generate an array of links with which the user can see the objects

        const img_url_arr = await getViewableLinks([post_uuid])
        if (!img_url_arr) {
            return { success: false }
        }

        rows = rows.map((row, index) => ({
            ...row,
            img_url: img_url_arr[index],
        }));

        return { success: true, postInfo: rows }
    } catch (error) {
        console.log(error)
        return { success: false }
    }
}

/**
 * @param {any} post_uuid
 * @param {any} user_uuid
 */
export async function checkAndRemovePost(post_uuid, user_uuid) {
    // function also checks if user_uuid is actually the owner of the post
    const query = `
        DELETE FROM posts WHERE post_uuid = $1 AND profile = $2
    `
    try {
        const res = await pool.query(query, [post_uuid, user_uuid]);
        if (res && res.rowCount && res.rowCount > 0) {
            return { success: true }
        }
        return { success: false }
    } catch (error) {
        console.log(error)
        return { success: false }
    }

}

/**
 * @param {String} post_uuid
 * @param {String} user_uuid
 * @param {String} newText
 */
export async function checkAndChangePostText(post_uuid, user_uuid, newText) {
    // function also checks if user_uuid is actually the owner of the post

    const query = `
        UPDATE posts
        SET text = $3
        WHERE post_uuid = $1 AND profile = $2
    `;
    try {
        const res = await pool.query(query, [post_uuid, user_uuid, newText]);
        if (res && res.rowCount && res.rowCount > 0) {
            return { success: true }
        }
        return { success: false }
    } catch (error) {
        console.log(error)
        return { success: false }
    }

}

/**
 * @param {any} neLat
 * @param {any} neLng
 * @param {any} swLat
 * @param {any} swLng
 * @param {{ lng: any; lat: any; }} userPosition
 * @param {any} number
 * @param {any} user_uuid
 */
export async function getPostsWithinDistance(neLat, neLng, swLat, swLng, userPosition, number, user_uuid) {
    const query = `
        SELECT 
            post_uuid, 
            profile,
            ST_X(location::geometry) AS lon,
            ST_Y(location::geometry) AS lat
        FROM posts
        WHERE ST_DWithin(
            location::geography,
            ST_MakePoint($1, $2)::geography,
            $3
        ) AND ST_Within(
            location::geometry,
            ST_MakeEnvelope($4, $5, $6, $7, 4326)::geometry
            ) AND profile != $9
        ORDER BY created_at DESC
        LIMIT $8 + 1;
    `;
    try {

        const res = await pool.query(query, [
            userPosition.lng,
            userPosition.lat,
            ALLOWED_RADIUS,
            neLng,
            neLat,
            swLng,
            swLat,
            number,
            user_uuid
        ]);
        if (res && res.rowCount) {
            return { success: true, posts: res.rows }
        }
        return { success: true }
    } catch (error) {
        console.log(error)
        return { success: false }
    }
}

/**
 * @param {{ lng: any; lat: any; }} userPosition
 * @param {number} starting
 * @param {number} ending
 * @param {any} user_uuid
 */
export async function getPostsClose(userPosition, starting, ending, user_uuid) {
    const limit = ending - starting + 1
    const query = `
        SELECT 
            post_uuid, 
            profile,
            created_at,
            ST_X(location::geometry) AS lon,
            ST_Y(location::geometry) AS lat
        FROM (
            SELECT *,
                ST_Distance(
                    location::geography,
                    ST_MakePoint($1, $2)::geography
                ) AS dist
            FROM posts
        WHERE ST_DWithin(
            location::geography,
            ST_MakePoint($1, $2)::geography,
            $3
        ) AND profile != $6
        )
        ORDER BY dist ASC
        LIMIT $4 OFFSET $5;
    `;
    try {

        const res = await pool.query(query, [
            userPosition.lng,
            userPosition.lat,
            ALLOWED_RADIUS,
            limit,
            starting,
            user_uuid
        ]);
        if (res && res.rowCount) {
            return { success: true, posts: res.rows }
        }
        return { success: true }
    } catch (error) {
        console.log(error)
        return { success: false }
    }
}
