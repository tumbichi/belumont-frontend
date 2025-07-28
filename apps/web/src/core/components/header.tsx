import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Container from '@soybelumont/ui/layouts/container';

/**
 * A simple header component with a logo and navigation links.
 *
 * @returns The header component.
 */
const Header: React.FC = () => {
  const t = useTranslations('HEADER');
  return (
    <Container>
      <header className="flex items-center w-full h-20 px-4 shrink-0 md:px-6">
        <Link href="/" className="mr-6">
          <p className="text-2xl font-medium">Belu Mont</p>
        </Link>
        <div className="flex gap-2 ml-auto">
          <Link
            href="/"
            className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-3 py-1 text-md lg:text-lg font-normal transition-colors hover:bg-black/5 hover:text-gray-900 hover:scale-125 hover:font-semibold focus:bg-black/20 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
          >
            {t('HOME')}
          </Link>
          <Link
            href="/recetarios"
            className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-md lg:text-lg font-normal transition-colors hover:bg-black/5 hover:text-gray-900 hover:scale-105 hover:font-semibold focus:bg-black/20 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
          >
            {t('PRODUCTS')}
          </Link>
          {/* <Link
            href="#"
            className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
          >
            Sobre mí
          </Link> */}
          {/* <Link
            href="#"
            className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
          >
            Contacto
          </Link> */}
          {/* <Button variant="outline" className="justify-self-end">
            Sign in
          </Button>
          <Button className="justify-self-end">Sign Up</Button> */}
        </div>
      </header>
    </Container>
  );
};

export default Header;
