export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text } = req.body || {};

  if (!text) {
    return res.status(400).json({ error: "No text provided" });
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an AI that restructures and formats handwritten or messy notes into clean, structured text for nursing and biochemistry students.",
          },
          {
            role: "user",
            content: text,
          },
        ],
      }),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error });
    }

    const aiResult = data.choices?.[0]?.message?.content || "No response from AI.";
    return res.status(200).json({ result: aiResult });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
