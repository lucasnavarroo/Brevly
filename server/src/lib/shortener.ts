const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export function generateShortCode(length = 6): string {
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}
