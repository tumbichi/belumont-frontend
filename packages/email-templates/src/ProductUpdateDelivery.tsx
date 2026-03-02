import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
  Tailwind,
  Heading,
} from '@react-email/components';
import type { ProductUpdateDeliveryProps } from './types';

export default function ProductUpdateDelivery({
  productName,
  username,
  downloadLink,
}: ProductUpdateDeliveryProps) {
  return (
    <Html lang="es">
      <Head />
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                brand: '#FB923C',
                'brand-dark': '#EA580C',
              },
            },
          },
        }}
      >
        <Body className="bg-gray-100 font-sans py-8">
          <Container className="mx-auto bg-white rounded-xl shadow-lg overflow-hidden" style={{ maxWidth: '600px' }} width="600">
            {/* Header */}
            <Section className="bg-brand px-8 py-10 text-center">
              <Text className="text-5xl m-0 mb-2">🔄✨</Text>
              <Heading
                as="h1"
                className="text-white text-2xl font-bold m-0 mb-1"
              >
                ¡Hola {username}!
              </Heading>
              <Text className="text-orange-100 text-sm m-0">
                Tu recetario fue actualizado
              </Text>
            </Section>

            {/* Content */}
            <Section className="px-8 py-8">
              <Text className="text-gray-600 text-base leading-relaxed m-0 mb-4">
                Te escribo para contarte que actualicé{' '}
                <span className="text-gray-900 font-semibold">
                  {productName}
                </span>
                . Hice algunas mejoras y correcciones para que tu experiencia sea
                aún mejor. 🥳
              </Text>
              <Text className="text-gray-600 text-base leading-relaxed m-0 mb-4">
                Podés descargar la nueva versión haciendo clic en el botón de
                abajo. ¡Espero que la disfrutes!
              </Text>

              <Hr className="border-gray-200 my-8" />

              {/* Download Button */}
              <div style={{ textAlign: 'center' }}>
                <Button
                  href={downloadLink}
                  className="bg-brand text-white text-base font-semibold py-3 px-8 rounded-md no-underline"
                >
                  Descargar versión actualizada
                </Button>
              </div>

              <Hr className="border-gray-200 my-8" />

              {/* Footer */}
              <Text className="text-gray-500 text-sm m-0 mb-4">
                Si tienes alguna consulta, no dudes en escribirme. ¡Estoy para
                ayudarte!
              </Text>
              <Text className="text-gray-500 text-sm m-0">
                Con cariño,
                <br />
                <span className="text-gray-700 font-semibold">Belu Mont</span>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
