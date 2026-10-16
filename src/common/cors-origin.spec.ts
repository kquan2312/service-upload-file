import { isAllowedCorsOrigin } from './cors-origin';

describe('isAllowedCorsOrigin', () => {
  it.each([
    undefined,
    'http://localhost:5173',
    'https://cosplay-shop-mauve.vercel.app',
    'https://cosplay-shop-git-feature-team.vercel.app',
    'https://preview.vercel.app',
  ])('allows %s', (origin) => {
    expect(isAllowedCorsOrigin(origin)).toBe(true);
  });

  it.each([
    'https://vercel.app',
    'http://preview.vercel.app',
    'https://preview.vercel.app.attacker.com',
    'https://preview.vercel.app:8443',
    'https://preview.vercel.app/path',
    'not an origin',
    'https://untrusted.example.com',
  ])('rejects %s', (origin) => {
    expect(isAllowedCorsOrigin(origin)).toBe(false);
  });
});
