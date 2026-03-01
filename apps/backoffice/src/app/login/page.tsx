import { cookies } from 'next/headers';
import { verifyJWT } from '@core/lib/auth';
import { redirect } from 'next/navigation';
import Login from '@modules/auth/features/Login';

export default async function LoginPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (token && verifyJWT(token)) {
    redirect('/');
  }

  return <Login />;
}
