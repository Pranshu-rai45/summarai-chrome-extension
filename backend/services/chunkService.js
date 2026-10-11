const {
  RecursiveCharacterTextSplitter,
} = require("@langchain/textsplitters");

async function createChunks(text, metadata = {}) {
  if (!text || typeof text !== "string") {
    throw new Error("Valid text is required for chunking");
  }

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 150,
  });

  const documents = await splitter.createDocuments(
    [text],
    [metadata]
  );

  return documents;
}

module.exports = { createChunks };