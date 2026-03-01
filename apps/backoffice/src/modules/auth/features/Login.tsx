'use client';

import React from 'react';
import Image from 'next/image';
import { Input } from '@soybelumont/ui/components/input';
import { Button } from '@soybelumont/ui/components/button';
import { Label } from '@soybelumont/ui/components/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@soybelumont/ui/components/card';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const t = useTranslations();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

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
        setLoading(false);
      }
    } catch (_error) {
      setError(t('LOGIN.NETWORK_ERROR'));
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* ── Image panel (desktop only) ── */}
      <div className="relative hidden w-1/2 overflow-hidden lg:block">
        <Image
          src="/login-bg.webp"
          alt="Belu Mont"
          fill
          priority
          className="object-cover"
        />
        {/* Soft dark overlay — lets the image breathe */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Brand wordmark — anchored bottom-left */}
        <div className="absolute bottom-0 left-0 right-0 p-10">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Belu Mont
          </h1>
          <p className="mt-1 text-sm text-white/70">
            {t('LOGIN.PANEL_TAGLINE')}
          </p>
        </div>
      </div>

      {/* ── Form panel ── */}
      <div className="flex w-full items-center justify-center bg-gradient-to-br from-orange-50/60 via-background to-background px-6 lg:w-1/2">
        <div className="w-full max-w-sm">
          {/* Mobile-only brand (hidden on desktop where image panel has it) */}
          <div className="mb-8 text-center lg:hidden">
            <h1 className="text-3xl font-bold tracking-tight text-primary">
              Belu Mont
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">Backoffice</p>
          </div>

          <Card className="border-border/60 shadow-lg">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-xl">{t('LOGIN.TITLE')}</CardTitle>
              <CardDescription>{t('LOGIN.DESCRIPTION')}</CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="flex items-start gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">{t('LOGIN.EMAIL_LABEL')}</Label>
                  <Input
                    id="email"
                    type="text"
                    placeholder={t('LOGIN.EMAIL_PLACEHOLDER')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">{t('LOGIN.PASSWORD_LABEL')}</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder={t('LOGIN.PASSWORD_PLACEHOLDER')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('COMMON.LOADING')}
                    </>
                  ) : (
                    t('LOGIN.SUBMIT')
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            {t('LOGIN.FOOTER')}
          </p>
        </div>
      </div>
    </div>
  );
}
