import fetch from 'node-fetch';

export async function handler(event) {
  const { text } = JSON.parse(event.body);

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "openai/gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are an AI that restructures notes and returns clear formatted text." },
        { role: "user", content: text }
      ]
    })
  });

  const data = await response.json();
  const output = data.choices?.[0]?.message?.content || "Error: No output from AI.";

  return {
    statusCode: 200,
    body: JSON.stringify({ result: output })
  };
}
