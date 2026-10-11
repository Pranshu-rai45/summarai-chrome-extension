
const { askQuestion } = require("../services/ragService");

async function questionController(req, res) {
  try {
    const { question } = req.body;

    if (typeof question !== "string" || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide a question",
      });
    }

    const result = await askQuestion(question);

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Question processing failed:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to answer the question",
      error: error.message,
    });
  }
}

module.exports = { questionController };
