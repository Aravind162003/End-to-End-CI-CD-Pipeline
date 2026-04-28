import mongoose from "mongoose";
import Movie from "../models/Movies.js";
import fs from "fs/promises";
import path from "path";

const isLocalPath = (filePath) => {
  return filePath && !filePath.startsWith("http") && filePath.startsWith("uploads/");
};

export const createMovie = async (req, res) => {
  try {
    const { name, director, description } = req.body;
    const poster = req.files?.poster ? path.join("uploads", req.files.poster[0].filename) : null;
    const trailer = req.files?.trailer ? path.join("uploads", req.files.trailer[0].filename) : null;
    const ticketPrice = req.body.ticketPrice;

    if (!name || !director || !poster || !description) {
      if (poster) await fs.unlink(path.join(process.cwd(), poster));
      if (trailer) await fs.unlink(path.join(process.cwd(), trailer));
      return res.status(400).json({ success: false, message: "Movie title, director, poster, and description are required" });
    }

    if (!req.user || !req.user._id) {
      if (poster) await fs.unlink(path.join(process.cwd(), poster));
      if (trailer) await fs.unlink(path.join(process.cwd(), trailer));
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const existingMovie = await Movie.findOne({ name });
    if (existingMovie) {
      if (poster) await fs.unlink(path.join(process.cwd(), poster));
      if (trailer) await fs.unlink(path.join(process.cwd(), trailer));
      return res.status(400).json({ success: false, message: "Movie with this name already exists" });
    }

    const movie = new Movie({
      name,
      director,
      poster,
      trailer,
      description,
      ticketPrice,
      createdBy: req.user._id,
    });

    await movie.save();
    res.status(201).json({ success: true, message: "Movie created successfully", data: movie });
  } catch (error) {
    console.error("Error creating movie:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const editMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, director, description } = req.body;
    const newPoster = req.files?.poster ? path.join("uploads", req.files.poster[0].filename) : null;
    const newTrailer = req.files?.trailer ? path.join("uploads", req.files.trailer[0].filename) : null;
    const ticketPrice = req.body.ticketPrice;

    if (!mongoose.isValidObjectId(id)) {
      if (newPoster) await fs.unlink(path.join(process.cwd(), newPoster));
      if (newTrailer) await fs.unlink(path.join(process.cwd(), newTrailer));
      return res.status(400).json({ success: false, message: "Invalid MongoDB ID" });
    }

    if (!req.user || !req.user._id) {
      if (newPoster) await fs.unlink(path.join(process.cwd(), newPoster));
      if (newTrailer) await fs.unlink(path.join(process.cwd(), newTrailer));
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const movie = await Movie.findOne({ _id: id, createdBy: req.user._id });
    if (!movie) {
      if (newPoster) await fs.unlink(path.join(process.cwd(), newPoster));
      if (newTrailer) await fs.unlink(path.join(process.cwd(), newTrailer));
      return res.status(404).json({ success: false, message: "Movie not found or unauthorized" });
    }

    if (name && name !== movie.name) {
      const existingMovie = await Movie.findOne({ name });
      if (existingMovie) {
        if (newPoster) await fs.unlink(path.join(process.cwd(), newPoster));
        if (newTrailer) await fs.unlink(path.join(process.cwd(), newTrailer));
        return res.status(400).json({ success: false, message: "Movie with this name already exists" });
      }
    }

    const updateData = {
      name: name || movie.name,
      director: director || movie.director,
      description: description || movie.description,
      poster: newPoster || movie.poster,
      trailer: newTrailer || movie.trailer,
      ticketPrice: ticketPrice || movie.ticketPrice,
    };

    if (newPoster && isLocalPath(movie.poster)) {
      await fs.unlink(path.join(process.cwd(), movie.poster)).catch(console.error);
    }

    if (newTrailer && isLocalPath(movie.trailer)) {
      await fs.unlink(path.join(process.cwd(), movie.trailer)).catch(console.error);
    }

    const updatedMovie = await Movie.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, message: "Movie updated", data: updatedMovie });
  } catch (error) {
    console.error("Error updating movie:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid MongoDB ID" });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const movie = await Movie.findById(id);
    if (!movie) {
      return res.status(404).json({ success: false, message: "Movie not found" });
    }

    if (isLocalPath(movie.poster)) {
      await fs.unlink(path.join(process.cwd(), movie.poster)).catch(console.error);
    }
    if (isLocalPath(movie.trailer)) {
      await fs.unlink(path.join(process.cwd(), movie.trailer)).catch(console.error);
    }

    await Movie.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Movie deleted" });
  } catch (error) {
    console.error("Error deleting movie:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getMovies = async (req, res) => {
  try {
    const { createdBy } = req.query;
    const query = createdBy ? { createdBy } : {};
    const movies = await Movie.find(query).populate("createdBy", "username email");
    res.status(200).json({ success: true, data: movies });
  } catch (error) {
    console.error("Error fetching movies:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}; 