const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

export async function fetchUrls() {
  const res = await fetch(`${API_BASE_URL}/links`);
  return res.json();
}

export async function createUrl(originalUrl: string, shortCode: string) {
  const res = await fetch(`${API_BASE_URL}/links`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ originalUrl, shortCode }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw data;
  }

  return res.json();
}

export async function deleteUrl(shortCode: string) {
  await fetch(`${API_BASE_URL}/links/${shortCode}`, { method: 'DELETE' });
}

export async function exportCsv(): Promise<{ url: string }> {
  const res = await fetch(`${API_BASE_URL}/export`, { method: 'POST' });
  if (!res.ok) {
    throw new Error('Erro ao exportar');
  }
  return res.json();
}
