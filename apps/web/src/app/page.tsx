import { Button } from '@soybelumont/ui/components/button';
import { Card } from '@soybelumont/ui/components/card';
import Container from '@soybelumont/ui/layouts/container';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <Container>
      <div className="h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="flex w-full h-full ">
          <div className="flex flex-col pt-24 mx-auto md:w-full md:place-items-start lg:pt-0 lg:mt-8 lg:items-start md:justify-center">
            {/* <Card className='px-8 pt-24 pb-8 drop-shadow-2xl'> */}
            <h1 className="text-6xl font-bold md:-mt-16 md:text-7xl xl:text-8xl">
              Simple & Deli
            </h1>
            <div className="flex flex-col items-start justify-start gap-4 mt-4 md:mt-6 place-items-start">
              <p className="text-2xl font-light md:text-3xl">¡Todos mis recetarios acá!</p>
              <Link href="/recetarios">
                <Button size="lg" className="px-12 py-6">
                  <p className="text-2xl ">Recetarios </p>
                  <ArrowRight />
                </Button>
              </Link>
            </div>
            {/* </Card> */}
          </div>
          <div className=""></div>
        </div>
      </div>
    </Container>
  );
}
