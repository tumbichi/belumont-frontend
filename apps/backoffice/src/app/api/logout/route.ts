// Endpoint para manejar el logout

import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set("auth_token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 0, // Expira inmediatamente
  });
  return response;
}
