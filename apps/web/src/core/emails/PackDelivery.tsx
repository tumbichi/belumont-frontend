import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
  Row,
  Column,
  Tailwind,
  Heading,
} from '@react-email/components';

interface DownloadItem {
  name: string;
  downloadUrl: string;
}

interface PackDeliveryProps {
  packName: string;
  username: string;
  items: DownloadItem[];
}

export default function PackDelivery({
  packName,
  username,
  items,
}: PackDeliveryProps) {
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
              <Heading as="h1" className="text-white text-2xl font-bold m-0 mb-1">
                ¡Hola {username}!
              </Heading>
              <Text className="text-orange-100 text-sm m-0">
                Tu pack está listo para descargar
              </Text>
            </Section>

            {/* Content */}
            <Section className="px-8 py-8">
              <Text className="text-gray-600 text-base leading-relaxed m-0 mb-4">
                ¡Te doy la bienvenida a mi mundo culinario! Este es el comienzo
                de una experiencia deliciosa con{' '}
                <span className="text-gray-900 font-semibold">{packName}</span>.
              </Text>
              <Text className="text-gray-600 text-base leading-relaxed m-0">
                Deseo que estas recetas te inspiren tanto como a mí al crearlas.
                🥣✨
              </Text>

              <Hr className="border-gray-200 my-8" />

              {/* Pack contents */}
              <Heading as="h2" className="text-gray-900 text-lg font-semibold m-0 mb-6">
                📦 Tu pack incluye {items.length} productos:
              </Heading>

              {items.map((item, index) => (
                <Section
                  key={item.downloadUrl}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-3"
                >
                  <Row>
                    <Column className="w-10" style={{ verticalAlign: 'middle' }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          backgroundColor: '#fed7aa',
                          borderRadius: '50%',
                          color: '#c2410c',
                          fontSize: '14px',
                          fontWeight: 700,
                          lineHeight: '32px',
                          textAlign: 'center',
                        }}
                      >
                        {index + 1}
                      </div>
                    </Column>
                    <Column className="align-middle pl-3">
                      <Text className="text-gray-700 text-sm font-medium m-0">
                        {item.name}
                      </Text>
                    </Column>
                    <Column className="w-28 align-middle text-right">
                      <Button
                        href={item.downloadUrl}
                        className="bg-brand text-white text-xs font-semibold py-2 px-4 rounded-md no-underline"
                      >
                        Descargar
                      </Button>
                    </Column>
                  </Row>
                </Section>
              ))}

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
