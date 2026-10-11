function cleanText(input) {
  if (!input || typeof input !== "string") {
    throw new Error("Invalid text");
  }

  let text = input;

  // 1. Normalize line breaks
  text = text.replace(/\r\n/g, "\n");
  text = text.replace(/\r/g, "\n");

  // 2. Remove unwanted control characters
  text = text.replace(
    /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g,
    ""
  );

  // 3. Replace tabs and non-breaking spaces
  text = text.replace(/[\t\u00A0]+/g, " ");

  // 4. Remove multiple spaces
  text = text.replace(/[ ]{2,}/g, " ");

  // 5. Remove spaces around line breaks
  text = text.replace(/ *\n */g, "\n");

  // 6. Remove excessive blank lines
  text = text.replace(/\n{3,}/g, "\n\n");

  // 7. Remove unnecessary spaces before punctuation
  text = text.replace(/\s+([,.!?;:])/g, "$1");

  // 8. Trim
  text = text.trim();

  return text;
}

module.exports = { cleanText };