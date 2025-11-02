export async function handler(event, context) {
  try {
    const { text } = JSON.parse(event.body);

    // Call the OpenRouter API
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful AI that restructures class notes into well-organized, clear study notes." },
          { role: "user", content: text }
        ],
      }),
    });

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content || "No response from AI.";

    return {
      statusCode: 200,
      body: JSON.stringify({ result }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}
