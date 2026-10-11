// const { extractPdfText } = require("../services/pdfLoader");
// const {cleanText} = require("../services/textCleaner");
// const { createChunks } = require("../services/chunkService");
// const { processDocument } = require("../services/documentProcessingService");
// const uploadPDF = async (req, res, next) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({
//         success: false,
//         message: "Please upload a PDF file",
//       });
//     }

//     console.log("PDF received successfully");
//     console.log("Original filename:", req.file.originalname);
//     console.log("Saved filename:", req.file.filename);
//     console.log("File location:", req.file.path);
//     console.log("File size:", req.file.size, "bytes");

//     // 1. Extract PDF text
//     const result = await extractPdfText(req.file.path);

//     console.log("PDF text received successfully");
//     console.log("Raw PDF text characters:", result.length);

//     // 2. Clean PDF text
//     const cleanedText = cleanText(result);

//     console.log("Cleaned PDF text characters:", cleanedText.length);

//     // 3. Create chunks
//     const chunks = await createChunks(cleanedText, {
//       source: "pdf",
//       filename: req.file.originalname,
//     });

//     console.log("........PDF CHUNKS ........");
//     console.log("Total chunks:", chunks.length);

//     chunks.forEach((chunk, index) => {
//       console.log(`\n......... CHUNK ${index + 1} ......`);
//       console.log(chunk.pageContent);
//       console.log("Metadata:", chunk.metadata);
//     });

//     return res.status(200).json({
//       success: true,
//       message: "PDF uploaded, extracted, cleaned and chunked successfully",

//       filename: req.file.originalname,
//       savedAs: req.file.filename,
//       size: req.file.size,

//       characters: cleanedText.length,
//       chunksCount: chunks.length,

//       chunks: chunks.map((chunk, index) => ({
//         chunkIndex: index,
//         text: chunk.pageContent,
//         metadata: chunk.metadata,
//       })),
//     });

//   } catch (error) {
//     console.error("PDF processing failed:", error.message);
//     next(error);
//   }
// };

// module.exports = { uploadPDF };


const { extractPdfText } = require("../services/pdfLoader");
const { processDocument } = require("../services/documentProcessingService");

const uploadPDF = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a PDF file",
      });
    }

    console.log("PDF received successfully");
    console.log("Original filename:", req.file.originalname);
    console.log("Saved filename:", req.file.filename);
    console.log("File location:", req.file.path);
    console.log("File size:", req.file.size, "bytes");

    // 1. Extract PDF text
    const rawText = await extractPdfText(req.file.path);

    console.log("PDF text received successfully");
    console.log("Raw PDF text characters:", rawText.length);

    // 2. Clean → Chunk → Generate embeddings
    const result = await processDocument(rawText, {
      source: "pdf",
      filename: req.file.originalname,
    });

    // 3. Log processing results
    console.log("...........PDF PROCESSING ...........");
    console.log("Characters:", result.cleanedText.length);
    console.log("Total chunks:", result.chunks.length);
    console.log("Total embeddings:", result.vectors.length);
    console.log("Vector dimensions:", result.vectors[0]?.length);

    // 4. Send response
    return res.status(200).json({
      success: true,
      documentId: result.documentId,
      message: "PDF processed and embedded successfully",
      filename: req.file.originalname,
      savedAs: req.file.filename,
      size: req.file.size,
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
    console.error("PDF processing failed:", error);
    return next(error);
  }
};

module.exports = { uploadPDF };
