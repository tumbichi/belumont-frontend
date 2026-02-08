export async function GET() {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return Response.json(
        {
          success: false,
          error: errorData?.message || `Resend API error: ${response.statusText}`,
        },
        { status: response.status }
      );
    }

    const result = await response.json();

    return Response.json({ success: true, data: result?.data ?? [] });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Internal server error';
    return Response.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
