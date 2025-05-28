import type { ShortenedUrl } from '../types';

export async function fetchUrls(): Promise<ShortenedUrl[]> {
  const res = await fetch('/links');
  return res.json();
}

export async function createUrl(originalUrl: string, shortCode: string) {
  const res = await fetch('/links', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ originalUrl, shortCode }),
  });
  return res.json();
}