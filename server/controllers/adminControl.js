import jwt from 'jsonwebtoken'
import * as Blog from '../models/Blog.js'
import * as Comment from '../models/Comment.js'
import db from '../configs/db.js'

export const adminLogin = async (req,res) =>{
    try{
        const {email, password} = req.body;
        // console.log("hello");        
        if(email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD){
            return res.json({success: false , message: "Invalid Credentials"})
        }
        const token = jwt.sign({email}, process.env.JWT_SECRET)
        res.json({success: true, token})
    } catch(error){
        res.json({success: false, message: error.message})
    }
}

export const getBlogsAdmin = async (req, res) => {
    try {
        const blogs = await Blog.getAllBlogsAdmin();
        res.json({success: true, blogs});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

export const getCommentsAdmin = async (req, res) => {
    try {
        const comments = await Comment.getAllCommentsAdmin();
        res.json({success: true, comments});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

export const getDashboard = async (req, res) => {
  try {
    const recentBlogsRes = await db.query(
      'SELECT * FROM blogs ORDER BY created_at DESC LIMIT 5'
    );
    const recentBlogs = recentBlogsRes.rows;

    const blogsCountRes = await db.query('SELECT COUNT(*) FROM blogs');
    const blogs = parseInt(blogsCountRes.rows[0].count, 10);

    const commentsCountRes = await db.query('SELECT COUNT(*) FROM comments');
    const comments = parseInt(commentsCountRes.rows[0].count, 10);

    const draftsCountRes = await db.query(
      'SELECT COUNT(*) FROM blogs WHERE is_published = false'
    );
    const drafts = parseInt(draftsCountRes.rows[0].count, 10);

    const dashboardData = {
      blogs,
      comments,
      drafts,
      recentBlogs
    };

    res.json({ success: true, dashboardData });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
}

export const deleteCommentById = async (req, res) => {
  try {
    const { id } = req.body;

    const result = await db.query('DELETE FROM comments WHERE id = $1 RETURNING *', [id]);

    if (result.rowCount === 0) {
      return res.json({ success: false, message: "No comment found with this id" });
    }

    res.json({ success: true, message: "Comment deleted successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
}

export const approveCommentById = async (req, res) => {
  try {
    const { id } = req.body;

    const result = await db.query(
      'UPDATE comments SET is_approved = true WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rowCount === 0) {
      return res.json({ success: false, message: "No comment found with this id" });
    }

    res.json({ success: true, message: "Comment approved successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};