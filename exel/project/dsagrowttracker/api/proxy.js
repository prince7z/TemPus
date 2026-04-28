export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Vercel serverless uses process.env without VITE_ prefix
  const SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL || process.env.VITE_GOOGLE_SCRIPT_URL;

  if (!SCRIPT_URL) {
    return res.status(500).json({ 
      success: false, 
      error: 'GOOGLE_SCRIPT_URL environment variable not set' 
    });
  }

  try {
    let url = SCRIPT_URL;
    let options = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (req.method === 'GET') {
      const action = req.query.action;
      url = `${SCRIPT_URL}?action=${action}`;
    } else if (req.method === 'POST') {
      options.body = JSON.stringify(req.body);
    }

    const response = await fetch(url, options);
    const data = await response.json();

    return res.status(200).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}
