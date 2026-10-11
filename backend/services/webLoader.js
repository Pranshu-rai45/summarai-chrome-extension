
const cheerio = require("cheerio");
const {cleanText} = require("./textCleaner");

async function extractWebText(url) {
  try {
    // 1. Validate URL
    const parsedUrl = new URL(url);

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      throw new Error("Only HTTP and HTTPS URLs are supported");
    }

    // 2. Fetch webpage
    const response = await fetch(parsedUrl.href, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/154 Safari/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch webpage: ${response.status} ${response.statusText}`
      );
    }

    const html = await response.text();

    // 3. Load HTML using Cheerio
    const $ = cheerio.load(html);

    // 4. Remove unwanted HTML elements BEFORE extracting text
    $(
      "script, style, noscript, template, iframe, svg, canvas"
    ).remove();

    $("nav, header, footer, aside, form").remove();

    // 5. Select main content
    let root;

    const isWikipedia =
      parsedUrl.hostname.endsWith("wikipedia.org");

    if (isWikipedia && $("#mw-content-text").length) {
      root = $("#mw-content-text");
    } else if ($("article").length) {
      root = $("article");
    } else if ($("main").length) {
      root = $("main");
    } else {
      root = $("body");
    }

    // 6. Remove unnecessary content
    root.find(
      ".mw-editsection, .navbox, .vertical-navbox, .metadata, .portal-bar, .sister-bar, .catlinks"
    ).remove();

    // 7. Extract text
    let text = root.text();

    // 8. Clean text
    text = cleanText(text);

    // 9. Validate
    if (!text.trim()) {
      throw new Error("No readable text found on webpage");
    }

    console.log("========== URL TEXT ==========");
    console.log("URL:", url);
    console.log("Characters:", text.length);
    console.log(text);
    console.log("==============================");

    return text;
  } catch (error) {
    console.error("Webpage extraction failed:", error.message);
    throw error;
  }
}

module.exports = { extractWebText };