import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
  Heading,
  Tailwind,
} from '@react-email/components';

interface ProductDeliveryProps {
  productName: string;
  username: string;
  downloadLink: string;
}

export default function ProductDelivery({
  productName,
  username,
  downloadLink,
}: ProductDeliveryProps) {
  return (
    <Html lang="es">
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
        <Head />
        <Body className="bg-gray-100 font-sans py-8">
          <Container className="mx-auto max-w-xl bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Header */}
            <Section className="bg-brand px-8 py-10 text-center">
              <Text className="text-5xl m-0 mb-2">🧑🏽‍🍳✨</Text>
              <Heading
                as="h1"
                className="text-white text-2xl font-bold m-0 mb-1"
              >
                ¡Hola {username}!
              </Heading>
              <Text className="text-orange-100 text-sm m-0">
                Tu recetario está listo para descargar
              </Text>
            </Section>

            {/* Content */}
            <Section className="px-8 py-8">
              <Text className="text-gray-600 text-base leading-relaxed m-0 mb-4">
                ¡Te doy la bienvenida a mi mundo culinario! Este es el comienzo
                de una experiencia deliciosa con{' '}
                <span className="text-gray-900 font-semibold">
                  {productName}
                </span>
                .
              </Text>
              <Text className="text-gray-600 text-base leading-relaxed m-0">
                Deseo que estas recetas te inspiren tanto como a mí al crearlas.
                🥣✨
              </Text>

              <Hr className="border-gray-200 my-8" />

              <Section className="text-center">
                <Button
                  className="bg-brand text-white text-xs font-semibold py-2 px-4 rounded-md no-underline"
                  href={downloadLink}
                >
                  Descargar mi recetario
                </Button>
              </Section>

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
