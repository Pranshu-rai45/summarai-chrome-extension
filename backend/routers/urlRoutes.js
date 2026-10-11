const express = require("express");
const router = express.Router();

const { extractWebText } = require("../services/webLoader");
const { processDocument } = require("../services/documentProcessingService");

router.post("/url", async (req, res) => {
  try {
    const { url } = req.body;

    if (!url || typeof url !== "string") {
      return res.status(400).json({
        success: false,
        message: "URL is required",
      });
    }

    // 1. Extract webpage text
    const rawText = await extractWebText(url);

    // 2. Clean → Chunk → Embeddings
    const result = await processDocument(rawText, {
      source: "url",
      url,
    });

    console.log(".......... URL PROCESSING ..........");
    console.log("Characters:", result.cleanedText.length);
    console.log("Total chunks:", result.chunks.length);
    console.log("Total embeddings:", result.vectors.length);
    console.log("Vector dimensions:", result.vectors[0]?.length);

    return res.status(200).json({
      success: true,
      documentId: result.documentId,
      message: "Webpage extracted, cleaned, chunked and embedded successfully",
      url,
      characters: result.cleanedText.length,
      chunksCount: result.chunks.length,
      embeddingsCount: result.vectors.length,

      chunks: result.chunks.map((chunk, index) => ({
        chunkIndex: index,
        text: chunk.pageContent,
        metadata: chunk.metadata,
      })),
    });
  } catch (error) {
    console.error("Webpage processing failed:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to process webpage",
      error: error.message,
    });
  }
});

module.exports = router;
