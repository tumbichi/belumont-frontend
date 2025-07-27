import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-center mb-6">
        Políticas de Privacidad
      </h1>
      <p className="mb-4">
        Desde Soy Belu Mont, nos comprometemos a proteger tu privacidad. Esta
        política de privacidad describe cómo recopilamos, usamos y compartimos
        información sobre ti cuando usas nuestros servicios.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        1. Información que recopilamos
      </h2>
      <p className="mb-4">
        Recopilamos la información que nos proporcionas directamente, como tu
        nombre, dirección de correo electrónico y cualquier otra información que
        decidas compartir cuando interactúas con nosotros. Además, podemos
        recopilar información automáticamente a través de cookies y tecnologías
        similares cuando visitas nuestra plataforma.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        2. Cómo usamos tu información
      </h2>
      <ul className="list-disc list-inside mb-4">
        <li>Para proporcionar y mantener nuestros servicios.</li>
        <li>
          Para comunicarnos contigo, incluidos correos electrónicos o mensajes
          relacionados con el servicio.
        </li>
        <li>
          Para mejorar y personalizar tu experiencia en nuestra plataforma.
        </li>
        <li>Para cumplir con nuestras obligaciones legales.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        3. Cómo compartimos tu información
      </h2>
      <p className="mb-4">
        No compartimos tu información personal con terceros, excepto en las
        siguientes circunstancias:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>
          Con proveedores de servicios que nos ayudan a operar nuestra
          plataforma.
        </li>
        <li>Cuando lo exija la ley o para responder a solicitudes legales.</li>
        <li>
          Si creemos que es necesario para proteger nuestros derechos, propiedad
          o seguridad.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">4. Seguridad</h2>
      <p className="mb-4">
        Implementamos medidas de seguridad para proteger tu información
        personal. Sin embargo, ningún método de transmisión por Internet o
        almacenamiento electrónico es completamente seguro, por lo que no
        podemos garantizar una seguridad absoluta.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        5. Cambios a esta política
      </h2>
      <p className="mb-4">
        Podemos actualizar esta política de privacidad ocasionalmente.
        Publicaremos cualquier cambio en esta página y actualizaremos la fecha
        de &quot;Última actualización&quot; en la parte inferior de esta
        política.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">6. Contacto</h2>
      <p className="mb-4">
        Si tienes preguntas sobre esta política de privacidad, contáctanos en{' '}
        <a
          href="mailto:tuemail@dominio.com"
          className="text-blue-500 hover:underline"
        >
          soybelumont@gmail.com
        </a>
        .
      </p>

      <p className="text-sm text-gray-600 mt-12">
        Última actualización: 12/12/2024
      </p>
    </div>
  );
}
