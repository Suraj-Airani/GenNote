import db from "../configs/db.js";

export async function createComment({
    blog_id,
    name,
    content,
    is_approved
    }) {
        const insertQuery = 
            `INSERT INTO comments (
            blog_id, name, content, is_approved
            ) VALUES ($1, $2, $3, $4)
            RETURNING *;`;
        const values = [
            blog_id,
            name,
            content,
            is_approved ?? false
        ];
        const result = await db.query(insertQuery, values);
    }

export async function getAllComments(id) {
    const result = await db.query("SELECT * FROM comments WHERE blog_id = $1 AND is_approved = true ORDER BY created_at DESC", [id]);
  return result.rows[0];
}
export async function getAllCommentsAdmin() {
    const result = await db.query("SELECT * FROM comments ORDER BY created_at DESC");
  return result.rows;
}
