// Vercel serverless function — replaces the Azure Functions version.
// Vercel auto-detects any file in /api as a serverless endpoint.
// This becomes reachable at: https://your-site.vercel.app/api/chat

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ reply: 'Method not allowed' });
  }

  const { message, systemPrompt } = req.body;

  try {
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT.replace(/\/+$/, ''); // strip trailing slash(es)
    const url = `${endpoint}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT}/chat/completions?api-version=${process.env.AZURE_OPENAI_API_VERSION}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.AZURE_OPENAI_KEY
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 300
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Azure OpenAI error:', data);
      return res.status(500).json({ reply: 'Sorry, something went wrong talking to the AI. Please try again.' });
    }

    return res.status(200).json({ reply: data.choices[0].message.content });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ reply: 'Sorry, something went wrong talking to the AI. Please try again.' });
  }
}
