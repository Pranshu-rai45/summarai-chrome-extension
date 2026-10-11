const { cleanText } = require("./textCleaner");
const { PDFLoader } = require(
  "@langchain/community/document_loaders/fs/pdf"
);

async function extractPdfText(filePath) {
  if (!filePath) {
    throw new Error("PDF file path is required");
  }

  const loader = new PDFLoader(filePath);

  // Extract text from every page
  const documents = await loader.load();

  const text = documents
    .map((doc) => doc.pageContent)
    .filter((pageText) => pageText.trim())
    .join("\n\n");

  if (!text.trim()) {
    throw new Error(
      "No readable text found. The PDF may be scanned."
    );
  }

  console.log("PDF pages extracted:", documents.length);
  console.log("PDF text characters:", text.length);
  
  console.log(text);
  

  return text;
}

module.exports = { extractPdfText };
