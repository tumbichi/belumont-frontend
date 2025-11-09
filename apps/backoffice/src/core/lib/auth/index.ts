// auth.ts - Funciones auxiliares para autenticación

import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY || "default_secret_key";

// Verifica el JWT y retorna los datos del usuario si es válido
export function verifyJWT(token: string): Record<string, unknown> | null {
  try {
    return jwt.verify(token, SECRET_KEY) as Record<string, unknown>;
  } catch (_error) {
    return null;
  }
}

// Genera un JWT para un usuario
export function generateJWT(payload: object): string {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
}
