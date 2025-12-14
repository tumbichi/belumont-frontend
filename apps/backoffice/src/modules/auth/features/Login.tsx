// Componente de Login encapsulado en el módulo Auth
'use client';

import React from 'react';
import { Input } from '@soybelumont/ui/components/input';
import { Button } from '@soybelumont/ui/components/button';
import { Label } from '@soybelumont/ui/components/label';
import { useTranslations } from 'next-intl';

import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const t = useTranslations();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push('/');
      } else {
        const data = await res.json();
        setError(data.message || t('LOGIN.ERROR'));
      }
    } catch (_error) {
      setError(t('LOGIN.NETWORK_ERROR'));
    }
  };

  return (
    <div className=" bg-blue-200">
      <div className="w-full h-[calc(100vh-60px)] flex items-center justify-center bg-gray-100">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md p-6 bg-white rounded-lg shadow-md"
        >
          <h1 className="mb-4 text-2xl font-bold ">{t('LOGIN.TITLE')}</h1>
          {error && <p className="mb-4 text-sm text-red-500">{error}</p>}{' '}
          {/* Manejo de errores */}
          <div className="mb-4">
            <Label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              {t('LOGIN.EMAIL_LABEL')}
            </Label>
            <Input
              id="email"
              type="text"
              placeholder={t('LOGIN.EMAIL_PLACEHOLDER')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1"
              required
            />
          </div>
          <div className="mb-4">
            <Label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              {t('LOGIN.PASSWORD_LABEL')}
            </Label>
            <Input
              id="password"
              type="password"
              placeholder={t('LOGIN.PASSWORD_PLACEHOLDER')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            {t('LOGIN.SUBMIT')}
          </Button>
        </form>
      </div>
    </div>
  );
}
