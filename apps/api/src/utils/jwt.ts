/**
 * Utilitaires JWT pour l'authentification Supabase
 */

import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.SUPABASE_JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('SUPABASE_JWT_SECRET must be provided');
}

// Conversion de la clé secrète en format utilisable par jose
const secret = new TextEncoder().encode(JWT_SECRET);

/**
 * Vérifie et décode un JWT Supabase
 */
export async function verifyJWT(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    throw new Error('Invalid JWT token');
  }
}

/**
 * Extrait l'ID utilisateur depuis un JWT
 */
export async function getUserIdFromToken(token: string): Promise<string | null> {
  try {
    const payload = await verifyJWT(token);
    return payload.sub || null;
  } catch {
    return null;
  }
}
