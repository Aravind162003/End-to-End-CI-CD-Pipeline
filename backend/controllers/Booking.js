import express from "express";
import mongoose from "mongoose";
import Booking from "../models/Booking.js";

const router = express.Router();

// Middleware to check if user is admin (based on localStorage role, sent in headers)
const checkAdmin = (req, res, next) => {
  const userRole = req.headers["x-user-role"]; // Sent by frontend
  if (!userRole || userRole !== "admin") {
    return res.status(403).json({ message: "Unauthorized: Admin privileges required" });
  }
  next();
};

// POST /api/bookings - Create a new booking (no authentication)
router.post("/", async (req, res) => {
  try {
    const {
      movieId,
      customerName,
      email,
      phone,
      numberOfTickets,
      showDate,
      showTime,
      theater,
    } = req.body;

    // Validate input
    if (
      !movieId ||
      !customerName ||
      !email ||
      !phone ||
      !numberOfTickets ||
      !showDate ||
      !showTime ||
      !theater
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate email format
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    // Validate numberOfTickets
    if (numberOfTickets < 1 || numberOfTickets > 10) {
      return res.status(400).json({
        message: "Number of tickets must be between 1 and 10",
      });
    }

    // Validate showTime
    const validShowTimes = ["10:00 AM", "1:00 PM", "4:00 PM", "7:00 PM", "10:00 PM"];
    if (!validShowTimes.includes(showTime)) {
      return res.status(400).json({
        message: "Invalid show time. Must be one of: " + validShowTimes.join(", "),
      });
    }

    // Verify movie exists
    const Movie = mongoose.model("Movie");
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // Calculate total price
    const totalPrice = movie.ticketPrice * numberOfTickets;

    // Create booking
    const booking = new Booking({
      movieId,
      userId: null, // No authentication
      customerName,
      email,
      phone,
      numberOfTickets,
      showDate,
      showTime,
      theater,
      totalPrice,
      bookingStatus: "confirmed",
    });

    await booking.save();

    res.status(201).json({
      message: "Booking created successfully",
      data: {
        bookingId: booking._id,
        bookingReference: booking.bookingReference,
        movieName: movie.name,
        customerName,
        email,
        phone,
        numberOfTickets,
        showDate,
        showTime,
        theater,
        totalPrice,
        bookingStatus: booking.bookingStatus,
      },
    });
  } catch (error) {
    console.error("Error creating booking:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/bookings - Fetch bookings by email (no authentication)
router.get("/", async (req, res) => {
  try {
    const { email } = req.query;

    // Validate email
    if (!email) {
      return res.status(400).json({ message: "Email query parameter is required" });
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    // Fetch bookings for the provided email
    const bookings = await Booking.find({ email }).populate("movieId", "name");

    res.status(200).json({
      message: "Bookings retrieved successfully",
      data: bookings,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/bookings/all - Fetch all bookings (admin only)
router.get("/all", checkAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find().populate("movieId", "name").sort({ createdAt: -1 });
    res.status(200).json({
      message: "All bookings retrieved successfully",
      data: bookings,
    });
  } catch (error) {
    console.error("Error fetching all bookings:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// PATCH /api/bookings/:id - Update booking status (admin only)
router.patch("/:id", checkAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { bookingStatus } = req.body;

    // Validate status
    const validStatuses = ["confirmed", "cancelled", "pending"];
    if (!bookingStatus || !validStatuses.includes(bookingStatus)) {
      return res.status(400).json({
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    // Find and update booking
    const booking = await Booking.findByIdAndUpdate(
      id,
      { bookingStatus },
      { new: true, runValidators: true }
    ).populate("movieId", "name");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({
      message: "Booking status updated successfully",
      data: booking,
    });
  } catch (error) {
    console.error("Error updating booking status:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/bookings/:id - Delete a booking (admin only)
router.delete("/:id", checkAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByIdAndDelete(id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({
      message: "Booking deleted successfully",
      data: booking,
    });
  } catch (error) {
    console.error("Error deleting booking:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;