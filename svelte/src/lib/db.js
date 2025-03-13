import pkg from "pg"
const { Pool } = pkg
import { DATABASE_HOST, DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD } from "$env/static/private";


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

export async function createAcc(pool) {

    return true
}
