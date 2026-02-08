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

    const results: {
      email: string;
      success: boolean;
      error?: string;
    }[] = [];

    for (const buyer of body.buyers) {
      try {
        const emailReactComponent = ProductUpdateDelivery({
          productName: body.productName,
          username: buyer.name,
          downloadLink: body.downloadUrl,
        });

        const response = await ResendRepository().sendEmail({
          to: buyer.email,
          from: String(process.env.RESEND_FROM_EMAIL),
          subject: `${body.productName} - Nueva versión disponible | @soybelumont`,
          react: emailReactComponent,
        });

        if (response.error) {
          results.push({
            email: buyer.email,
            success: false,
            error: response.error.message,
          });
        } else {
          results.push({ email: buyer.email, success: true });
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        results.push({
          email: buyer.email,
          success: false,
          error: errorMessage,
        });
      }
    }

    const successCount = results.filter((r) => r.success).length;
    const failedCount = results.filter((r) => !r.success).length;

    return Response.json({
      success: failedCount === 0,
      totalSent: successCount,
      totalFailed: failedCount,
      results,
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
