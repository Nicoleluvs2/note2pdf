const fetch = require('node-fetch');

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST')
    return { statusCode: 405, body: 'Method Not Allowed' };

  const { note, style } = JSON.parse(event.body || '{}');
  if (!note) return { statusCode: 400, body: 'Missing note' };

  const prompt = `
Reformat the following student's notes into a clean structured HTML document.
Use style: ${style}.
Add headings, spacing, and a "Calculations" section if needed.
Return ONLY HTML (no explanations).

Notes:
${note}
`;

  try {
    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a helpful note formatter.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 1200,
        temperature: 0.2
      })
    });

    const data = await resp.json();
    const html = data.choices?.[0]?.message?.content || 'Error';
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ html })
    };
  } catch (err) {
    return { statusCode: 500, body: 'Server error ' + err.message };
  }
};
