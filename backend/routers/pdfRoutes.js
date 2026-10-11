
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const {
  uploadPDF,
} = require("../controllers/pdfController");

const router = express.Router();

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure PDF storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      ".pdf";

    cb(null, uniqueName);
  },
});

// Validate PDF file
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "application/pdf" &&
    path.extname(file.originalname).toLowerCase() === ".pdf"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"));
  }
};

// Configure Multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
});

// Upload PDF and extract text through controller
router.post("/", upload.single("pdf"), uploadPDF);

module.exports = router;
