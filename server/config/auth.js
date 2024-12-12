export const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Use env in production

export const AUTH_CONFIG = {
  tokenExpiration: '24h',
  saltRounds: 10
};