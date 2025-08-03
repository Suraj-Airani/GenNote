import express from "express";
import { adminLogin, approveCommentById, deleteCommentById, getBlogsAdmin, getCommentsAdmin, getDashboard } from "../controllers/adminControl.js";
import auth from "../middlewares/auth.js";

const adminRoute = express.Router();

adminRoute.post("/login", adminLogin);
adminRoute.get("/comments", auth, getCommentsAdmin);
adminRoute.get("/blogs", auth, getBlogsAdmin);
adminRoute.post("/delete-comment", auth, deleteCommentById);
adminRoute.post("/approve-comment", auth, approveCommentById);
adminRoute.get("/dashboard", auth, getDashboard);

export default adminRoute;