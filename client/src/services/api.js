const API_BASE_URL = 'http://localhost:4000/api';

export async function analyzeWebsite(url) {
  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to analyze website.');
  }

  return data;
}
