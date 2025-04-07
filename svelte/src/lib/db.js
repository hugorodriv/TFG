import pkg from "pg"
const { Pool } = pkg
import { DATABASE_HOST, DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD } from "$env/static/private";
import { removePfpS3 } from "./s3";


//  (?![-_.])           // Prevents the username from starting with -, _, or .
//  [a-zA-Z0-9\-_.]+    // Allows alphanumeric characters, -, _, and .
//  (?<![-_.])          // Prevents the username from ending with -, _, or .
export const USERNAME_REGEX = /^(?![-_.])([a-z0-9\-_.]+)(?<![-_.])$/;
export const NAME_REGEX = /^[a-zA-Z]+(?: [a-zA-Z]+)*$/;

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
 * @param {{ username: String; name: String; }} accData
 */
export async function createUser(userId, accData) {

    const username = accData.username
    const name = accData.name || ""

    try {
        await pool.query('INSERT INTO profiles (_id, username, name) VALUES ($1, $2, $3)', [userId, username, name]);

        return true;
    } catch (error) {
        console.log(error)
        return false;
    }
}


/**
 * @param {Number} userId
 */
export async function fetchAccData(userId) {

    try {
        const res = await pool.query('SELECT * FROM profiles WHERE _id = $1 LIMIT 1', [userId]);
        // TODO: Dont include userId (but the uuid instead)
        const { _id: omittedUserId, ...profile } = res.rows[0];
        return profile;
    } catch (error) {
        console.log(error)
        return false;
    }
}

/**
 * @param {String} username
 */
export async function fetchAccDataFromUsername(username) {
    try {
        const res = await pool.query('SELECT * FROM profiles WHERE username = $1 LIMIT 1', [username]);
        // TODO: Dont include userId (but the uuid instead)
        const { _id: omittedUserId, ...profile } = res.rows[0];
        return profile;
    } catch (error) {
        console.log(error)
        return false;
    }
}


/**
 * @param {any} userId
 * @param {{ name: any; bio: any; }} newData
 */
export async function updateAccDetails(userId, newData) {

    const bio = newData.bio
    const name = newData.name || ""

    if (!NAME_REGEX.test(name)) {
        return false
    }

    try {
        await pool.query('UPDATE profiles SET name = $2, bio = $3 WHERE _id = $1', [userId, name, bio]);

        return true;
    } catch (error) {
        console.log(error)
        return false;
    }
}
/**
 * @param {Number | String | undefined} userId
 */
export async function getUserUUID(userId) {

    try {
        // get uuid from given userId
        const res = await pool.query('SELECT uuid FROM profiles WHERE _id = $1 LIMIT 1', [userId])
        const uuid = res.rows[0]["uuid"]

        return uuid
    } catch (error) {
        console.log(error)
        return false
    }
}

/**
 * @param {any} userId
 */
export async function deleteAccount(userId) {
    try {
        // pfp S3 removal
        const uuid = await getUserUUID(userId)
        removePfpS3(uuid)

        // database cleaning
        const resProfiles = await pool.query('DELETE FROM profiles WHERE _id = $1', [userId]);
        const resSessions = await pool.query('DELETE FROM sessions WHERE "userId" = $1', [userId]);
        const resAccounts = await pool.query('DELETE FROM accounts WHERE "userId" = $1', [userId]);
        const resUsers = await pool.query('DELETE FROM users WHERE id = $1', [userId]);

        // TODO: Delete user posts?


        return resProfiles && resSessions && resUsers && resAccounts
    } catch (error) {
        console.log(error)
        return false;
    }
}

/**
 * @param {string} uuid
 */
export async function removePfpDB(uuid) {

    try {
        await pool.query('UPDATE profiles SET img_url = NULL where uuid = $1', [uuid]);
        return true;
    } catch (error) {
        console.log(error)
        return false;
    }
}
