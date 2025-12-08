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
    // return result.rows[0];
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

export async function updateBlog(id, updates) {
  const keys = Object.keys(updates).filter(key => updates[key] !== undefined && updates[key] !== null);
  
  if (keys.length === 0) {
    return null; 
  }

  const setClauses = keys.map((key, index) => {
    return `${key} = $${index + 1}`; 
  });

  setClauses.push(`updated_at = NOW()`);
  
  const values = keys.map(key => updates[key]);
  
  const idPlaceholder = `$${values.length + 1}`;
  values.push(id); 

  const updateQuery = `
    UPDATE blogs SET
      ${setClauses.join(',\n')} 
    WHERE id = ${idPlaceholder}
    RETURNING *;
  `;
  
  try {
    const result = await db.query(updateQuery, values);
    return result?.rows?.[0] || null;
  } catch (error) {
    console.error("Database update error:", error);
    throw error; 
  }
}

export async function deleteBlog(id) {
  const result = await db.query("DELETE FROM blogs WHERE id = $1", [id]);
  return result.rowCount > 0;
}

