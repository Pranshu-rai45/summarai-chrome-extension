
const fs = require("fs");
const path = require("path");

const { FaissStore } = require("@langchain/community/vectorstores/faiss");
const { embeddings } = require("./embeddingService");

// Local folder where FAISS index will be stored
const VECTOR_STORE_PATH = path.join(
  __dirname,
  "..",
  "vectorstore",
  "summarai"
);

async function saveToVectorStore(chunks, vectors) {
  if (!Array.isArray(chunks) || chunks.length === 0) {
    throw new Error("Chunks are required");
  }

  if (!Array.isArray(vectors) || vectors.length !== chunks.length) {
    throw new Error("Chunks and vectors must have the same length");
  }

  fs.mkdirSync(VECTOR_STORE_PATH, { recursive: true });

  let vectorStore;

  // Load existing FAISS index, if available
  const indexPath = path.join(VECTOR_STORE_PATH, "faiss.index");

  if (fs.existsSync(indexPath)) {
    vectorStore = await FaissStore.load(
      VECTOR_STORE_PATH,
      embeddings
    );

    // Add already-generated vectors without embedding again
    await vectorStore.addVectors(vectors, chunks);
  } else {
    // Create a new FAISS store using existing embeddings
    vectorStore = new FaissStore(embeddings, {});

    await vectorStore.addVectors(vectors, chunks);
  }

  // Persist index and documents to local disk
  await vectorStore.save(VECTOR_STORE_PATH);

  console.log("FAISS vector store saved successfully");
  console.log("Stored chunks:", chunks.length);
  console.log("Storage path:", VECTOR_STORE_PATH);

  return {
    storedChunks: chunks.length,
    storagePath: VECTOR_STORE_PATH,
  };
}

async function loadVectorStore() {
  const indexPath = path.join(VECTOR_STORE_PATH, "faiss.index");

  if (!fs.existsSync(indexPath)) {
    throw new Error(
      "FAISS index not found. Process a document first."
    );
  }

  return await FaissStore.load(VECTOR_STORE_PATH, embeddings);
}

module.exports = {
  saveToVectorStore,
  loadVectorStore,
};
