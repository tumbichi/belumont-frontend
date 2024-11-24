import { ConfettiSideCannons } from '@core/components/ui/confetti-side-cannons';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { SVGProps } from 'react';

export default function PaymentSuccessPage() {
  const t = useTranslations('PAYMENT_SUCCESS');

  return (
    <ConfettiSideCannons>
      <div className="flex min-h-[calc(100dvh-80px)] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-lg mx-auto text-center">
          <CircleCheckIcon className="w-16 h-16 mx-auto text-green-500 animate-bounce" />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t('TITLE')}
          </h1>
          <p className="mt-4 text-muted-foreground text-pretty">
            {t('DESCRIPTION_1')}
            <br />
            <br />
            {t('DESCRIPTION_2')}
          </p>
          <div className="mt-6 space-y-4">
            <Link
              href="/recetarios"
              className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium transition-colors rounded-md shadow-sm bg-primary text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              prefetch={false}
            >
              {t('BUTTON_1')}
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-semibold transition-colors rounded-md shadow-sm text-primary hover:bg-primary-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              prefetch={false}
            >
              {t('BUTTON_2')}
            </Link>
          </div>
        </div>
      </div>
    </ConfettiSideCannons>
  );
}

function CircleCheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
