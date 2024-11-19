import { Button, Html, Tailwind } from '@react-email/components';

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
      <Tailwind>
        <div className="bg-gray-50 p-6 text-gray-800">
          <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6">
            <h1 className="text-xl font-bold text-gray-900">
              ¡Hola {username}! 🌟
            </h1>
            <p className="text-gray-600 mt-2">
              ¡Qué alegría saber que te has sumado a mi mundo culinario! Este es
              el comienzo de una experiencia deliciosa con{' '}
              <strong>{productName}</strong>.
            </p>
            <p className="text-gray-600 mt-2">
              Haz clic en el botón de abajo para descargar tu recetario. Estoy
              segura de que estas recetas te inspirarán tanto como a mí al
              crearlas. 🥐✨
            </p>
            <div className="mt-4 text-center">
              <Button
                className="bg-[#FB923C] hover:bg-[#EA580C] text-white font-medium py-2 px-4 rounded"
                href={downloadLink}
              >
                Descargar mi recetario
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Si tienes alguna consulta, no dudes en escribirme. ¡Estoy aquí
              para ayudarte!
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Con cariño,
              <br />
              <strong>Belu Mont</strong>
            </p>
          </div>
        </div>
      </Tailwind>
    </Html>
  );
}
