import pkg from "pg"
const { Pool } = pkg
import { DATABASE_HOST, DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD } from "$env/static/private";


//  (?![-_.])           // Prevents the username from starting with -, _, or .
//  [a-zA-Z0-9\-_.]+    // Allows alphanumeric characters, -, _, and .
//  (?<![-_.])          // Prevents the username from ending with -, _, or .
export const USERNAME_REGEX = /^(?![-_.])([a-zA-Z0-9\-_.]+)(?<![-_.])$/;

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

/**
 * @param {Number} userId
 * @param {{ username: String; bio: String; }} accData
 */
export async function createUser(userId, accData) {

    const username = accData.username
    const bio = accData.bio || ""

    try {
        const res = await pool.query('INSERT INTO profiles (userId, username, bio) VALUES ($1, $2, $3)', [userId, username, bio]);
    } catch (error) {
        console.log(error)
    }
}
