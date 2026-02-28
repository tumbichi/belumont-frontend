import type { Metadata } from 'next';
import Script from 'next/script';
import { Space_Grotesk } from 'next/font/google';

import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import Header from '@core/components/header';
import '@soybelumont/ui/globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'], // Incluye solo los pesos que usas
  variable: '--font-space-grotesk',
});

export const metadata: Metadata = {
  title: {
    default: 'Belu Mont - Recetarios de Cocina Saludable',
    template: '%s | Belu Mont',
  },
  description:
    'Descubrí los recetarios de cocina saludable de Belu Mont. Recetas simples, ricas y nutritivas para tu día a día.',
  keywords: [
    'recetarios',
    'cocina saludable',
    'recetas saludables',
    'Belu Mont',
    'recetarios digitales',
    'cocina fácil',
    'recetas fáciles',
    'alimentación saludable',
  ],
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    siteName: 'Belu Mont',
    title: 'Belu Mont - Recetarios de Cocina Saludable',
    description:
      'Descubrí los recetarios de cocina saludable de Belu Mont. Recetas simples, ricas y nutritivas para tu día a día.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Belu Mont - Recetarios de Cocina Saludable',
    description:
      'Descubrí los recetarios de cocina saludable de Belu Mont. Recetas simples, ricas y nutritivas para tu día a día.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}');
        `}
        </Script>
        {process.env.NEXT_PUBLIC_FACEBOOK_PIXEL && (
          <Script id="facebook-pixel" strategy="afterInteractive">
            {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${process.env.NEXT_PUBLIC_FACEBOOK_PIXEL}');
            fbq('track', 'PageView');
          `}
          </Script>
        )}
        {process.env.NEXT_PUBLIC_FACEBOOK_PIXEL && (
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              src={`https://www.facebook.com/tr?id=${process.env.NEXT_PUBLIC_FACEBOOK_PIXEL}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        )}
      </head>
      <body
        className={`${spaceGrotesk.variable} antialiased bg-[linear-gradient(rgba(0,0,0,0.1),rgba(255,255,255,0.3)),url("/background.webp")] bg-cover bg-no-repeat`}
      >
        <NextIntlClientProvider messages={messages}>
          <Header />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
