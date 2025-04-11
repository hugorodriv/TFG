import { pool } from "./db";

/**
 * @param {String} uuid
 */
export async function getPendingFriendships(uuid) {

    const status = 'PENDING'
    try {
        // Get pending friend requests sent by the user with receiver username
        const { rows } = await pool.query(
            'SELECT f.*, p.name as sender_name, p.img_url as sender_img_url, p.username as sender_username FROM friendships f ' +
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
            'SELECT f.*, p.name as receiver_name, p.img_url as receiver_img_url, p.username as receiver_username FROM friendships f ' +
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
        // get status of friendship, with the small change of detecting when the user is still missing accepting said
        // friendship, to display a button on the profile page too

        const res = await pool.query(`
        SELECT 
            (
                CASE 
                WHEN sender_uuid = $2 AND receiver_uuid = $1 AND status = 'PENDING' THEN 'PENDING_YOU'
                ELSE status::text 
                END
            ) AS status, 

            created_at 
        FROM friendships 
        WHERE 
            (sender_uuid = $1 AND receiver_uuid = $2) 
            OR 
            (sender_uuid = $2 AND receiver_uuid = $1)
        `, [user_uuid, other_profile_uuid])
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

/**
 * @param {String} uuid
 */
export async function getFriendList(uuid) {

    try {
        const status = 'ACCEPTED'

        // kinda complicated query:
        // The problem is a given user can either be the sender or the reciever of the friendship
        // depending if they were the ones that sent it, or not
        // This is why a simple JOIN wouldnt work
        const res = await pool.query(
            `SELECT 
            p.uuid as friend_uuid,
            p.name as friend_name,
            p.img_url as friend_img_url,
            p.username as friend_username
        FROM friendships f
        JOIN profiles p ON f.receiver_uuid = p.uuid
        WHERE f.sender_uuid = $1 AND f.status = $2

        UNION

        SELECT 
            p.uuid as friend_uuid,
            p.name as friend_name,
            p.img_url as friend_img_url,
            p.username as friend_username
        FROM friendships f
        JOIN profiles p ON f.sender_uuid = p.uuid
        WHERE f.receiver_uuid = $1 AND f.status = $2`,
            [uuid, status]
        );

        const friendships = res.rows
        return { friendList: friendships }
    } catch (error) {
        console.log(error)
        return null
    }
}

/**
 * @param {String} sender_uuid
 * @param {String} receiver_uuid
 */
export async function acceptFriendship(sender_uuid, receiver_uuid) {
    try {
        const status = 'ACCEPTED'

        const res = await pool.query('UPDATE friendships SET status = $3 WHERE sender_uuid = $1 AND receiver_uuid = $2', [sender_uuid, receiver_uuid, status])

        if (res?.rowCount && res.rowCount > 0) {
            return { success: true }
        }
        return { success: false }
    } catch (error) {
        console.log(error)
        return { success: false }
    }
}

/**
 * @param {String} sender_uuid
 * @param {String} receiver_uuid
 */
export async function deleteFriendship(sender_uuid, receiver_uuid) {
    try {
        const res = await pool.query('DELETE FROM friendships WHERE (sender_uuid = $1 AND receiver_uuid = $2) OR (sender_uuid = $2 AND receiver_uuid = $1)', [sender_uuid, receiver_uuid])

        if (res?.rowCount && res.rowCount > 0) {
            return { success: true }
        }
        return { success: false }
    } catch (error) {
        console.log(error)
        return { success: false }
    }
}
