import express from "express";
import upload from "../middlewares/multer.js";
import { addBlog, addComment, delBlog, generateContent, getBlog, getBlogComments, getBlogs, togglePublish } from "../controllers/blogController.js";
import auth from "../middlewares/auth.js";

const blogRouter = express.Router();

// blog features
blogRouter.post('/add', upload.single('image'), addBlog);
blogRouter.get('/all', getBlogs);
blogRouter.get('/:id', getBlog);
blogRouter.post('/delete', auth, delBlog);
blogRouter.post('/toggle-publish', togglePublish);

//comment features
blogRouter.post('/add-comment', addComment);
blogRouter.post('/comments', getBlogComments);

blogRouter.post('/generate', auth, generateContent);

export default blogRouter;