const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { executeProcedure } = require("./db.service"); 
const router = require("./user");


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, "uploads/"); // Directory to store uploaded files
  },
  filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to filename
  }
});

// Initialize multer with the storage configuration
const upload = multer({ storage: storage });

// Create the uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Endpoint for file upload
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
      if (!req.file) {
          return res.status(400).json({ error: "No file uploaded" });
      }

      // Extract form data and file information
      const { user_id } = req.body; // Assuming user_id is sent in the form data
      const file_name = req.file.originalname;
      const file_path = req.file.path; // Path to the uploaded file

      // Check if user_id is provided
      if (!user_id) {
          return res.status(400).json({ error: "User ID is required" });
      }

      // Call the stored procedure to insert the file details
      const result = await executeProcedure("sp_file_upload", [user_id, file_name, file_path]);

      // Return a success response
      res.status(200).json({
          message: "File uploaded successfully",
          data: result,
      });
  } catch (error) {
      console.error("File upload error:", error);
      res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = router;