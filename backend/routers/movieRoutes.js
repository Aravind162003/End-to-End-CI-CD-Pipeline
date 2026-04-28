import express from "express";
import { createMovie, editMovie, deleteMovie, getMovies } from "../controllers/Movie.js";
import movieUpload from "../middlewares/multer.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getMovies);

router.post("/", authMiddleware, movieUpload, createMovie);
router.put("/:id", authMiddleware, movieUpload, editMovie);
router.delete("/:id", authMiddleware, deleteMovie);

export default router; 