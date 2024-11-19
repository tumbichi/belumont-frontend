"use client";
import ReactDOMServer from "react-dom/server";

import ProductDelivery from "@core/emails/ProductDelivery";
import { useEffect, useRef } from "react";

const Page = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      const iframeDocument = iframeRef.current.contentDocument;
      if (iframeDocument) {
        // Renderizar el componente como HTML dentro del iframe
        const html = ReactDOMServer.renderToString(
          <ProductDelivery productName={"Recatario para fiestas saludables"} username="Germán" downloadLink="https://xbfsdgdxghunrkeqzfxi.supabase.co/storage/v1/object/public/private-assets/recipe-ebooks/c5c1532a-c7f4-495a-a4f7-bcd1c9778535.pdf"/>
        );

        iframeDocument.open();
        iframeDocument.write(`
            <!DOCTYPE html>
            <html lang="es">
              <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" />
              </head>
              <body>${html}</body>
            </html>
          `);
        iframeDocument.close();
      }
    }
  }, []);

//   return <ProductDelivery productName={"Recatario para fiestas saludables"} />;
return (
    <div style={{ border: "1px solid #ccc", padding: "10px" }}>
      <iframe ref={iframeRef} style={{ width: "100%", height: "500px", border: "none" }} />
    </div>
  );
};

export default Page;
