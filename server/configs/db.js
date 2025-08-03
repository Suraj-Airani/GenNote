import { neon } from '@neondatabase/serverless'
import env from "dotenv"
env.config();

const db = neon(`${process.env.DATABASE_URL}`);

export default db;