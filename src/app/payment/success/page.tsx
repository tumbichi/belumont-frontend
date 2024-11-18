import Link from "next/link";
import { SVGProps } from "react";

export default function PaymentSuccessPage() {
  return (
    <div className="flex min-h-[calc(100dvh-80px)] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto text-center">
        <CircleCheckIcon className="w-12 h-12 mx-auto text-primary" />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">¡Gracias!</h1>
        <p className="mt-4 text-muted-foreground text-pretty">
          Agradecemos mucho tu apoyo. Revisa tu casilla de correo para encontrar tu nuevo recetario digital.
        </p>
        <div className="mt-6">
          <Link
            href="/products"
            className="inline-flex items-center px-4 py-2 text-sm font-medium transition-colors rounded-md shadow-sm bg-primary text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            prefetch={false}
          >
            Ver mas productos
          </Link>
        </div>
      </div>
    </div>
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
