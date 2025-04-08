import { pool } from "./db";

/**
 * @param {String} uuid
 */
export async function getPendingFriendships(uuid) {

    const status = 'PENDING'
    try {
        // Get pending friend requests sent by the user with receiver username
        const { rows } = await pool.query(
            'SELECT f.*, p.img_url as receiver_img_url, p.username as sender_username FROM friendships f ' +
            'JOIN profiles p ON f.sender_uuid = p.uuid ' +
            'WHERE f.receiver_uuid = $1 AND f.status = $2',
            [uuid, status]
        );

        return { success: true, pending: rows }
    } catch (error) {
        console.log(error)
        return { success: false }
    }
}
/**
 * @param {String} uuid
 */
export async function getSentPendingFriendships(uuid) {

    const status = 'PENDING'
    try {

        // Get sent and pending friend requests
        const { rows } = await pool.query(
            'SELECT f.*, p.img_url as receiver_img_url, p.username as receiver_username FROM friendships f ' +
            'JOIN profiles p ON f.receiver_uuid = p.uuid ' +
            'WHERE f.sender_uuid = $1 AND f.status = $2',
            [uuid, status]
        );
        return { success: true, pending: rows }
    } catch (error) {
        console.log(error)
        return { success: false }
    }
}

/**
 * @param {String} searchQuery
 */
export async function searchUser(searchQuery) {
    const LIMIT = 5

    try {
        const query = `
            SELECT name, username, img_url, uuid 
            FROM profiles 
            WHERE username LIKE $1 OR name ILIKE $1
            ORDER BY username 
            LIMIT $2
        `;

        const searchPattern = `%${searchQuery}%`;

        const { rows } = await pool.query(query, [searchPattern, LIMIT]);

        return {
            success: true,
            results: rows
        };
    } catch (error) {
        console.log(error);
        return { success: false };
    }
}

/**
 * @param {String} sender_uuid
 * @param {String} receiver_uuid
 */
export async function sendFriendRequest(sender_uuid, receiver_uuid) {
    const status = 'PENDING'
    try {
        await pool.query('INSERT INTO friendships (sender_uuid, receiver_uuid, status) VALUES ($1, $2, $3)', [sender_uuid, receiver_uuid, status]);

        return true;
    } catch (error) {
        console.log(error)
        return false;
    }
}

/**
 * @param {String} user_uuid
 * @param {String} other_profile_uuid
 */
export async function getFriendshipStatus(user_uuid, other_profile_uuid) {
    try {
        // get uuid from given userId
        const res = await pool.query('SELECT status, created_at FROM friendships WHERE sender_uuid = $1 AND receiver_uuid = $2', [user_uuid, other_profile_uuid])
        if (res.rows.length < 1) {
            return null
        }
        const status = res.rows[0]["status"]

        return status
    } catch (error) {
        console.log(error)
        return false
    }
}
