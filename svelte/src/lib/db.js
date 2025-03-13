import pkg from "pg"
const { Pool } = pkg
import { DATABASE_HOST, DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD } from "$env/static/private";


// check validity of username for creating and modifying 
export const USERNAME_REGEX = /^[a-zA-Z0-9\-_.]+$/;
export const MIN_USERNAME_LENGTH = 4
export const MAX_USERNAME_LENGTH = 20

export const pool = new Pool({
    host: DATABASE_HOST,
    port: 5432,
    user: DATABASE_USER,
    password: DATABASE_PASSWORD,
    database: DATABASE_NAME,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
})


/**
 * @param {{ id: string; }} user
 */
async function isNewAccount(user) {
    // user.id comes from auth. should be safe 
    // (SQL injection and a malicious actor providing a fake user.id)
    // convert to int just to be super safe
    if (!user.id) {
        throw new Error("Invalid user ID");
    }
    if (isNaN(parseInt(user.id, 10))) {
        throw new Error("Invalid user ID");
    }

    const res = await pool.query('SELECT * FROM profiles WHERE userId = $1', [user.id]);

    // if no rows matching user id, we establish that user doesnt have an acc
    const existingUser = res.rows[0];

    return !Boolean(existingUser)
}


/**
 * @param {string} username
 */
export function checkUsernameCorrect(username) {
    if (!USERNAME_REGEX.test(username)) {
        return false
    }
    if (username.length < MIN_USERNAME_LENGTH) {
        return false
    }
    if (username.length > MAX_USERNAME_LENGTH) {
        return false
    }
    return true
}

/**
 * @param {string} username
 */
export async function checkAvailableUsername(username) {

    // check again just in case
    if (!checkUsernameCorrect(username)) {
        return false
    }

    try {
        const { rows } = await pool.query(
            'SELECT username FROM profiles WHERE username = $1 LIMIT 1',
            [username]
        );
        return rows?.length === 0;
    } catch (error) {
        console.log(error)
        return false
    }
}

export async function createUser(userId, accData) {

    const username = accData.username
    const bio = accData.bio || ""

    try {
        const res = await pool.query('INSERT INTO profiles (userId, username, bio) VALUES ($1, $2, $3)', [userId, username, bio]);
    } catch (error) {
        console.log(error)
    }
}
