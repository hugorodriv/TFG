import { PostgresAdapter } from "@auth/pg-adapter";
import { Pool } from "pg";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});
