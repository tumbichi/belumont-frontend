import ResendRepository from '@core/data/resend/resend.repository';
import ProductUpdateDelivery from '@core/emails/ProductUpdateDelivery';
import { z } from 'zod';

const buyerSchema = z.object({
  name: z.string(),
  email: z.string().email(),
});

const bodySchema = z.object({
  productName: z.string(),
  downloadUrl: z.string().url(),
  buyers: z.array(buyerSchema).min(1),
});

export async function POST(request: Request) {
  try {
    const body = bodySchema.parse(await request.json());

    const emails = body.buyers.map((buyer) => ({
      to: buyer.email,
      from: String(process.env.RESEND_FROM_EMAIL),
      subject: `${body.productName} - Nueva versión disponible | @soybelumont`,
      react: ProductUpdateDelivery({
        productName: body.productName,
        username: buyer.name,
        downloadLink: body.downloadUrl,
      }),
    }));

    const response = await ResendRepository().sendBatchEmails(emails);

    if (response.error) {
      return Response.json(
        {
          success: false,
          totalSent: 0,
          totalFailed: body.buyers.length,
          error: response.error.message,
        },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      totalSent: body.buyers.length,
      totalFailed: 0,
      data: response.data,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { success: false, error: 'Invalid request body', details: error.errors },
        { status: 400 }
      );
    }

    const errorMessage =
      error instanceof Error ? error.message : 'Internal server error';
    return Response.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
