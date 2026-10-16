const allowedOrigins = [
  'http://localhost:5173',
  'https://cosplay-shop-mauve.vercel.app',
];

export function isAllowedCorsOrigin(origin?: string): boolean {
  if (!origin) {
    return true;
  }

  if (allowedOrigins.includes(origin)) {
    return true;
  }

  try {
    const parsedOrigin = new URL(origin);
    return (
      parsedOrigin.protocol === 'https:' &&
      parsedOrigin.hostname.endsWith('.vercel.app') &&
      !parsedOrigin.port &&
      parsedOrigin.origin === origin
    );
  } catch {
    return false;
  }
}
