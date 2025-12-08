import imagekit from "../configs/imageKit.js";
import * as Blog from "../models/Blog.js";
import * as Comment from "../models/Comment.js";
import db from "../configs/db.js";
// import main from "../configs/gemini.js";

//Blog Section features

export const addBlog = async (req, res) =>{
  try {
    let fileUrl = null;
    if(req.file){ 
      const result = await imagekit.upload({
       file: req.file.buffer, // file buffer from multer
       fileName: req.file.originalname, // original upload name
      });
      fileUrl = result.url;
      console.log("Image uploaded sucessfully");
    }

    // console.log("req.body", req.body);
    const {title, subtitle, description, category, is_published} = JSON.parse(req.body.blog);

    // console.log("req.body",req.body);

    const newBlog = await Blog.createBlog({
      title,
      subtitle,
      description,
      image_url: fileUrl,
      category,
      is_published
    });

    console.log("Blog added to database successfully");

    res.json({ success: true, message: "Blog added successfully", image_url: fileUrl});

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
}

export const getBlogs = async (req, res) =>{
  try {
    const blogs = await Blog.getAllBlogs();    
    res.json({success: true, blogs: blogs});
  } catch(error){
    res.json({success: false, message: error.message});
  }
}

export const getBlog = async (req, res) =>{
  try {
    const { id } = req.params;
    console.log(id);
    
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ success: false, message: "Invalid or missing id" });
    }
    const blog = await Blog.getBlogById(id);
    if(!blog){
      return res.json({success: false, message: "Blog not found"});
    }
    return res.json({success: true, blog});
  } catch (error) {
    res.json({success: false, message: error.message});
  }
}

export const alterBlog = async (req, res) => {
  try {
    const { id } = req.params;
    let updates = req.body; 
    let fileUrl = null; // Variable to hold the new image URL

    // --- NEW CODE: Handle Image Upload ---
    if (req.file) { 
        const result = await imagekit.upload({
            file: req.file.buffer, 
            fileName: req.file.originalname, 
        });
        fileUrl = result.url;
        console.log("New image uploaded sucessfully");
    }

    // Prepare the updates object
    // If a new file was uploaded, add the image_url to the updates object
    if (fileUrl) {
        updates.image_url = fileUrl;
    }

    // --- Check and handle ID in body (Good Practice) ---
    // If the client mistakenly sends 'id' in the body, remove it
    if (updates.id) {
        const { id: excludedId, ...validUpdates } = updates;
        updates = validUpdates;
    }
    
    console.log(`Attempting to update blog ID: ${id}`);
    console.log("Updates received:", updates);

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ success: false, message: "Invalid or missing blog ID" });
    }

    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, message: "No update fields provided in the request body." });
    }

    const updatedBlog = await Blog.updateBlog(id, updates); 
    
    if (!updatedBlog) {
      return res.status(404).json({ success: false, message: "Blog not found or cannot be edited" });
    }
    
    return res.json({ success: true, message: "Blog updated successfully", updatedBlog });
    
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}

export const delBlog = async (req, res) =>{
   try {
    const { id } = req.body;
    await Blog.deleteBlog(id);
    await db.query('DELETE FROM comments WHERE blog_id = $1', [id]);
    return res.json({success: true, message: "Blog deleted successfully"});
   } catch (error) {
    res.json({success: false, message: error.message});
   }
}

export const togglePublish = async (req, res) =>{
  try {
    const { id } = req.body;
    const blog = await Blog.getBlogById(id);
    
    if (!blog) {
      return res.json({ success: false, message: "Blog not found" });
    }
    
    const newStatus = !blog.is_published;

    const updatedBlog = await Blog.updateBlog(id, { ...blog, is_published: newStatus });

    res.json({
      success: true,
      message: "Publish status toggled",
      blog: updatedBlog,
    });
  } catch (error) {
    res.json({success: false, message: error.message});
  }
}

// Comment section

export const addComment = async (req, res) =>{
  try {
    const {blog_id, name, content } = req.body;
    
    const newComment = await Comment.createComment({blog_id, name, content});

    console.log("Comment added successfully");

    res.json({ success: true, message: "Comment added for review"});
    
  } catch (error) {
    res.json({success: false, message: error.message});
  }
}

export const getBlogComments = async (req, res) =>{
  try {
    const { blogId } = req.params;
    const comments = await Comment.getAllComments(blogId);
    res.json({success: true, comments});
  } catch (error) {
    res.json({success: false, message: error.message});
  }
}

export const generateContent = async (req, res)=>{
  try {
    const {prompt} = req.body;
    console.log(prompt);
    
    const content = await main(prompt + ' Generate a blog content for this topic in simple text format')
    res.json({success: true, content})
  } catch (error) {
    res.json({success: false, message: error.message})
  }
}
/*
const imagekit = new ImageKit({
  publicKey : process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey : process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint : process.env.IMAGEKIT_URL_ENDPOINT
});
const buffer = fs.readFileSync('./test.png');
imagekit.upload({
  file: buffer,
  fileName: 'test.jpg'
}).then(res => console.log(res)).catch(err => console.log(err));
*/