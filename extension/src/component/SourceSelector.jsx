import { useState } from "react";
import "./SourceSelector.css";

const SOURCE_OPTIONS = [
  { id: "url", label: "URL", icon: "🔗" },
  { id: "pdf", label: "PDF", icon: "📄" },
  { id: "text", label: "Text", icon: "📝" },
];

function SourceSelector({ onProcess, isProcessing, lastSource }) {
  const [sourceType, setSourceType] = useState("text");
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);


   const [isSending, setIsSending] = useState(false);
  const [backendResponse, setBackendResponse] = useState(null);


// Backend server ke saath communication ke liye function

const handleSendToBackend = async () => {
  if (!text.trim()) {
    alert("Please paste or extract text first.");
    return;
  }

  try {
    setIsSending(true);
    setBackendResponse(null);

    const response = await fetch(
      "http://localhost:5000/api/text",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text,
          sourceType: sourceType,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Request failed");
    }

    setBackendResponse(data);
    console.log("Backend response:", data);
  } catch (error) {
    console.error("Backend error:", error);
    alert("Backend connection failed. Check your server.");
  } finally {
    setIsSending(false);
  }
};



const handleExtractText = async () => {
  try {
    // 1. Active browser tab get karo
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (!tab?.id || !tab.url) {
      throw new Error("No active tab found.");
    }

    // 2. Chrome internal pages par extraction allowed nahi hai
    if (
      /^(chrome|edge|about|chrome-extension):/.test(tab.url)
    ) {
      throw new Error(
        "Please open a normal website first."
      );
    }

    // 3. Webpage se clean text extract karo
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },

      func: () => {
        // Main article/content identify karo
        const selectors = [
          "article",
          "main",
          '[role="main"]',
          "#mw-content-text",
          ".post-content",
          ".article-content",
          ".entry-content",
        ];

        let source = null;

        for (const selector of selectors) {
          const element = document.querySelector(selector);

          if (element && element.innerText.trim().length > 200) {
            source = element;
            break;
          }
        }

        // Agar main content nahi mila, body use karo
        source = source || document.body;

        // Original webpage ko change nahi karna:
        // content ka clone banao
        const content = source.cloneNode(true);

        // 4. Unwanted elements remove karo
        const unwantedSelectors = [
          "script",
          "style",
          "noscript",
          "nav",
          "header",
          "footer",
          "aside",
          "form",
          "button",
          "input",
          "select",
          "textarea",
          "iframe",
          "svg",
          "canvas",
          "video",
          "audio",
          "figure",
          "figcaption",
          ".reference",
          ".references",
          ".reflist",
          ".mw-editsection",
          ".navbox",
          ".infobox",
          ".sidebar",
          ".advertisement",
          ".ads",
          ".social-share",
          ".related-articles",
          '[role="navigation"]',
          '[aria-hidden="true"]',
        ];

        content
          .querySelectorAll(unwantedSelectors.join(","))
          .forEach((element) => element.remove());

        // 5. Text extract karo
        let text = content.innerText || content.textContent || "";

        // 6. Text normalize karo
        text = text
          .replace(/\[[^\]]*?\]/g, "") // [1], [edit] etc.
          .replace(/[ \t]+/g, " ")
          .replace(/\n[ \t]+/g, "\n")
          .replace(/\n{3,}/g, "\n\n")
          .trim();

        // 7. Empty lines aur repeated lines clean karo
        const lines = text
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean);

        const cleanedLines = [];
        let previousLine = "";

        for (const line of lines) {
          if (line !== previousLine) {
            cleanedLines.push(line);
          }
          previousLine = line;
        }

        return cleanedLines.join("\n\n");
      },
    });

    const pageText = results?.[0]?.result || "";

    if (!pageText.trim()) {
      throw new Error("No readable webpage content found.");
    }

    // 8. Existing textarea state mein clean text set karo
    setText(pageText);

    console.log("Clean extraction successful");
    console.log("Extracted characters:", pageText.length);
  } catch (error) {
    console.error("Extraction error:", error);
    alert(error.message);
  }
};
const activeSource =
    SOURCE_OPTIONS.find((option) => option.id === sourceType) ??
    SOURCE_OPTIONS[2];

  const handleSourceChange = (type) => {
    setSourceType(type);
  };

  const handleReset = () => {
    setUrl("");
    setText("");
    setFile(null);
  };


const handleProcess = async () => {
  // 1. Validate selected source
  if (sourceType === "text" && !text.trim()) {
    alert("Please enter or extract some text.");
    return;
  }

  if (sourceType === "url" && !url.trim()) {
    alert("Please enter a URL.");
    return;
  }

  if (sourceType === "pdf" && !file) {
    alert("Please select a PDF file.");
    return;
  }

  setIsSending(true);
  setBackendResponse(null);

  try {
    let response;

    // 2. Send TEXT to backend
    if (sourceType === "text") {
      response = await fetch("http://localhost:5000/api/text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text,
          sourceType: "text",
        }),
      });
    }

    // 3. Send PDF to backend
    else if (sourceType === "pdf") {
      const formData = new FormData();
      formData.append("pdf", file);

      response = await fetch("http://localhost:5000/api/pdf", {
        method: "POST",
        body: formData,
      });
    }

    // 4. Send URL to backend
    else if (sourceType === "url") {
      response = await fetch("http://localhost:5000/api/url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: url,
          sourceType: "url",
        }),
      });
    }

    // 4. Send URL to backend
else if (sourceType === "url") {
  response = await fetch("http://localhost:5000/api/url", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: url.trim(),
      sourceType: "url",
    }),
  });
}

    // 5. Handle backend response
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    const result = await response.json();

    setBackendResponse(result);
    console.log("Backend response:", result);

    alert(`${sourceType.toUpperCase()} sent successfully!`);

    if (onProcess) {
      onProcess({
        sourceType,
        text: sourceType === "text" ? text : "",
        url: sourceType === "url" ? url : "",
        file: sourceType === "pdf" ? file : null,
        result,
      });
    }
  } catch (error) {
    console.error("Processing error:", error);
    alert(`Failed to process ${sourceType}: ${error.message}`);
  } finally {
    setIsSending(false);
  }
};

  return (
    <section className="source-section">
      <div className="section-header">
        <h2>Choose a source</h2>

        <span className="status-pill">
          {lastSource
            ? `Last: ${lastSource.toUpperCase()}`
            : "Ready"}
        </span>
      </div>

      {/* SOURCE OPTIONS */}
      <div className="source-options">
        {SOURCE_OPTIONS.map((option) => (
          <button
            key={option.id}
            className={`source-card ${
              sourceType === option.id ? "active" : ""
            }`}
            onClick={() => handleSourceChange(option.id)}
            type="button"
          >
            <span>{option.icon}</span>
            <span>{option.label}</span>
          </button>
        ))}
      </div>

      {/* SELECTED SOURCE */}
      <div className="source-summary">
        <span className="summary-label">Selected</span>
        <strong>{activeSource.label}</strong>
      </div>

      {/* URL INPUT */}
      {sourceType === "url" && (
        <div className="input-area">
          <label>Enter webpage URL</label>

          <input
            type="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
      )}

      {/* PDF INPUT */}
      {sourceType === "pdf" && (
        <div className="input-area">
          <label>Upload PDF</label>

          <div className="pdf-upload">
            <div className="upload-icon">📄</div>

            <p>
              {file
                ? file.name
                : "Drop your PDF here or choose a file"}
            </p>

            <label className="choose-file">
              Choose PDF

              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={(e) =>
                  setFile(e.target.files[0])
                }
                hidden
              />
            </label>
          </div>
        </div>
      )};




      {/* TEXT INPUT */}
      {sourceType === "text" && (
        <div className="input-area">
          <label>Paste your text or extract webpage text</label>

          {/* EXTRACT WEBPAGE BUTTON */}
          <button
            type="button"
            className="extract-button"
            onClick={handleExtractText}
          >
            🌐 Extract Webpage Text
          </button>

          {/* SAME TEXT BOX */}
          <textarea
            placeholder="Paste notes, article, documentation, etc..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows="8"
          />

          <div className="character-count">
            {text.length} characters
          </div>
        </div>
      )}

      {/* ACTION BUTTONS */}
      <div className="action-row">
        <button
          className="secondary-button"
          onClick={handleReset}
          type="button"
        >
          Clear
        </button>

        <button
          className="process-button"
          onClick={handleProcess}
          disabled={isProcessing}
          type="button"
        >
          {isProcessing
            ? "Processing..."
            : `Process ${activeSource.label}`}
        </button>
      </div>
    </section>
  );
}

export default SourceSelector;