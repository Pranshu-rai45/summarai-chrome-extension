# SummarAI — AI-Powered Chrome Extension

SummarAI is an AI-powered Chrome extension that helps users understand and ask questions about text, PDF documents, and webpages using Retrieval-Augmented Generation (RAG).

## Features

- Extract content from webpages
- Upload PDF documents
- Process user-provided text
- Extract webpage text by submitting a URL link
- Clean and split text into chunks
- Generate embeddings using the Gemini API
- Store and retrieve document vectors using FAISS
- Ask questions and receive AI-generated answers

## Tech Stack

**Frontend:** React, Vite, JavaScript, CSS

**Backend:** Node.js, Express.js

**AI & RAG:** LangChain, Google Gemini API

**Vector Store:** FAISS

## Project Structure

```text
SummarAI/
├── backend/
│   ├── controllers/
│   ├── routers/
│   ├── services/
│   ├── uploads/
│   ├── vectorstore/
│   └── server.js
├── extension/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── manifest.json
└── README.md
```

*Note: The structure above is illustrative; actual files may differ.*

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/summarai-chrome-extension.git
cd summarai-chrome-extension
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Start the backend using the start script defined in `package.json`, for example:

```bash
npm start
```

### 3. Set up the extension

Open a new terminal:

```bash
cd extension
npm install
npm run build
```

### 4. Load the extension in Chrome

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select the extension's generated build folder, usually `dist`, if that folder contains the built extension and `manifest.json`.

## Environment Variables

Keep API keys in your local `.env` file. Never commit API keys or other secrets to GitHub.

## Future Improvements

- Persistent chat history
- Improved document retrieval
- Production backend deployment
- Chrome Web Store publication

## Author

Developed as an AI-powered Chrome extension project.