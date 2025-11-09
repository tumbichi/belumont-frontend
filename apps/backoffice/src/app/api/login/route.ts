// Endpoint para manejar el login

import { NextRequest, NextResponse } from 'next/server';
import { generateJWT } from '@core/lib/auth';
import { supabase } from '@core/data/supabase/client';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 401 }
    );
  }

  const token = generateJWT({ email: data.user.email });
  const response = NextResponse.json({ success: true });
  response.cookies.set('auth_token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
  });
  return response;
  //
}
