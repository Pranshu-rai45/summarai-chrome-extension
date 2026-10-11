
console.log("SummarAI content script loaded!");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "EXTRACT_TEXT") {
    // Extract webpage text, excluding scripts and styles
    const pageText = document.body?.innerText || "";

    sendResponse({ text: pageText });
  }
});