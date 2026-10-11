
const API_URL = "http://localhost:5000/api/question";

export async function askQuestion(question) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      question: question.trim(),
    }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(
      data.error || data.message || "Failed to get answer"
    );
  }

  return data;
}
