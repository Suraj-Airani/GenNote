import db from "../configs/db.js";

export async function createBlog({
    title,
    subtitle,
    description,
    image_url,
    category,
    is_published
    // ,created_by
    }) {
    const insertQuery = 
        `INSERT INTO blogs (
        title, subtitle, description, image_url, category, is_published
        ) VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;`;
    const values = [
        title,
        subtitle || null,
        description,
        image_url,
        category,
        is_published ?? false
    ];
    const result = await db.query(insertQuery, values);
    return result[0];
    }

export async function getAllBlogs() {
  const result = await db.query("SELECT * FROM blogs WHERE is_published = true ORDER BY created_at DESC");  
  return result;
}

export async function getAllBlogsAdmin() {
    const result = await db.query("SELECT * FROM blogs ORDER BY created_at DESC");
    return result;
}

export async function getBlogById(id) {
  const result = await db.query("SELECT * FROM blogs WHERE id = $1", [id]);
  return result[0];
}

export async function deleteBlog(id) {
  const result = await db.query("DELETE FROM blogs WHERE id = $1 RETURNING *", [id]);
  return result.length > 0;
}

