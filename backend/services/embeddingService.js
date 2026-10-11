require("dotenv").config();

const {
  GoogleGenerativeAIEmbeddings,
} = require("@langchain/google-genai");

const embeddings = new GoogleGenerativeAIEmbeddings({
  model: "gemini-embedding-001",
  apiKey: process.env.GOOGLE_API_KEY,
});

async function createEmbeddings(texts) {
  if (!Array.isArray(texts) || texts.length === 0) {
    throw new Error("Texts are required for embeddings");
  }

  const vectors = await embeddings.embedDocuments(texts);

  console.log("Embedding response count:", vectors.length);
  console.log("First vector type:", typeof vectors[0]);
  console.log("First vector dimensions:", vectors[0]?.length);

  if (!vectors.length || !vectors[0]?.length) {
    throw new Error("Embedding model returned empty vectors");
  }

  return vectors;
}

async function createQueryEmbedding(question) {
  if (!question || typeof question !== "string") {
    throw new Error("Valid question is required");
  }

  const vector = await embeddings.embedQuery(question);

  if (!vector.length) {
    throw new Error("Question embedding is empty");
  }

  return vector;
}

module.exports = {
  embeddings,
  createEmbeddings,
  createQueryEmbedding,
};