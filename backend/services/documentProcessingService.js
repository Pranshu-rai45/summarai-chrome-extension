const { cleanText } = require("./textCleaner");
const { createChunks } = require("./chunkService");
const { createEmbeddings } = require("./embeddingService");
const {
  saveToVectorStore,
} = require("./vectorStoreService");
const { randomUUID } = require("crypto");
async function processDocument(rawText, metadata = {}) {
  // 1. Validate input
  if (typeof rawText !== "string" || !rawText.trim()) {
    throw new Error("Valid document text is required");
  }

  const documentId = metadata.documentId || randomUUID();

const documentMetadata = {
  ...metadata,
  documentId,
};
  // 2. Clean text
  const cleanedText = cleanText(rawText);

  // 3. Create chunks
const chunks = await createChunks(cleanedText, documentMetadata);

  if (chunks.length === 0) {
    throw new Error("No chunks were generated");
  }

  // 4. Convert chunks into embeddings
  const texts = chunks.map((chunk) => chunk.pageContent);

  const vectors = await createEmbeddings(texts);

  // 5. Check embedding count
  if (vectors.length !== chunks.length) {
    throw new Error("Chunk and embedding counts do not match");
  }

  console.log("............. DOCUMENT PROCESSING ............");
  console.log("Source:", metadata.source || "unknown");
  console.log("Characters:", cleanedText.length);
  console.log("Total chunks:", chunks.length);
  console.log("Total embeddings:", vectors.length);
  console.log("Vector dimensions:", vectors[0]?.length);
await saveToVectorStore(chunks, vectors);
  return {
    cleanedText,
    chunks,
    vectors,
    documentId,
  };
}

module.exports = { processDocument };
