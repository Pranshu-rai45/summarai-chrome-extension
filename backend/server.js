const { cleanText } = require("./services/textCleaner");
const { createChunks } = require("./services/chunkService");
const { processDocument } = require("./services/documentProcessingService");
const questionRoutes = require("./routers/questionRoutes");
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("dotenv").config();


const app = express();
const PORT = 5000;
const pdfRoutes = require("./routers/pdfRoutes");
const urlRoutes = require("./routers/urlRoutes");
// Middleware
app.use(cors());
app.use(express.json());

// Create uploads folder if it doesn't exist
const uploadDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Routes
app.use("/api/pdf", pdfRoutes);
app.use("/api", urlRoutes);
app.use("/api/question", questionRoutes);
// Check server status
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "SummarAI backend is running",
  });
});

// Receive text


app.post("/api/text", async (req, res) => {
  try {
    const { text, sourceType } = req.body;

    console.log("Data received from frontend!");
    console.log("Source Type:", sourceType);
    console.log("Characters:", text?.length);

    if (typeof text !== "string" || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide some text",
      });
    }

    // Clean → Chunk → Embedding
    const result = await processDocument(text, {
      source: sourceType || "text",
    });

    console.log("Total chunks:", result.chunks.length);
    console.log("Total embeddings:", result.vectors.length);
    console.log("Vector dimensions:", result.vectors[0]?.length);

    return res.status(200).json({
      success: true,
      documentId: result.documentId,
      sourceType: sourceType || "text",
      characters: result.cleanedText.length,
      chunksCount: result.chunks.length,
      embeddingsCount: result.vectors.length,

      chunks: result.chunks.map((chunk, index) => ({
        chunkIndex: index,
        text: chunk.pageContent,
        metadata: chunk.metadata,
      })),

      message: "Text cleaned, chunked and embedded successfully",
    });
  } catch (error) {
    console.error("Text processing failed:", error);

    return res.status(500).json({
      success: false,
      message: "Text processing failed",
      error: error.message,
    });
  }
});



// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});