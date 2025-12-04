import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  pickup?: string;
  dropoff?: string;
  passengers?: number;
  dates?: string;
  message: string;
}

serve(async (req: Request): Promise<Response> => {
  console.log("Contact email function invoked");
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: ContactEmailRequest = await req.json();
    console.log("Received contact form data:", { name: data.name, email: data.email });

    const adminEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #1B3B80, #052465); padding: 30px; border-radius: 10px 10px 0 0;">
          <h1 style="color: #FED600; margin: 0; font-size: 24px;">Sunuvan - Nouvelle demande</h1>
        </div>
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #052465; margin-top: 0;">Informations du client</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Nom:</strong></td><td style="padding: 10px 0; border-bottom: 1px solid #eee;">${data.name}</td></tr>
            <tr><td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Email:</strong></td><td style="padding: 10px 0; border-bottom: 1px solid #eee;"><a href="mailto:${data.email}">${data.email}</a></td></tr>
            ${data.phone ? `<tr><td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Téléphone:</strong></td><td style="padding: 10px 0; border-bottom: 1px solid #eee;">${data.phone}</td></tr>` : ''}
            ${data.service ? `<tr><td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Service:</strong></td><td style="padding: 10px 0; border-bottom: 1px solid #eee;">${data.service}</td></tr>` : ''}
            ${data.pickup ? `<tr><td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Prise en charge:</strong></td><td style="padding: 10px 0; border-bottom: 1px solid #eee;">${data.pickup}</td></tr>` : ''}
            ${data.dropoff ? `<tr><td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Destination:</strong></td><td style="padding: 10px 0; border-bottom: 1px solid #eee;">${data.dropoff}</td></tr>` : ''}
            ${data.passengers ? `<tr><td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Passagers:</strong></td><td style="padding: 10px 0; border-bottom: 1px solid #eee;">${data.passengers}</td></tr>` : ''}
            ${data.dates ? `<tr><td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Dates:</strong></td><td style="padding: 10px 0; border-bottom: 1px solid #eee;">${data.dates}</td></tr>` : ''}
          </table>
          <h2 style="color: #052465; margin-top: 30px;">Message</h2>
          <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #FED600;">
            <p style="margin: 0; white-space: pre-wrap;">${data.message}</p>
          </div>
        </div>
      </div>
    `;

    const userEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #1B3B80, #052465); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: #FED600; margin: 0; font-size: 28px;">SUNUVAN</h1>
          <p style="color: white; margin: 10px 0 0 0;">Service de transport premium au Sénégal</p>
        </div>
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #052465; margin-top: 0;">Merci ${data.name}!</h2>
          <p style="color: #333; line-height: 1.6;">Nous avons bien reçu votre demande. Notre équipe vous contactera sous 2 heures.</p>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #FED600;">
            <h3 style="color: #052465; margin-top: 0;">Pour toute urgence:</h3>
            <p style="margin: 5px 0;">📞 +221 77 123 45 67</p>
            <p style="margin: 5px 0;">💬 WhatsApp: +221 77 123 45 67</p>
          </div>
          <p style="color: #333;">Cordialement,<br><strong>L'équipe Sunuvan</strong></p>
        </div>
      </div>
    `;

    // Send admin email
    const adminRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Sunuvan <onboarding@resend.dev>",
        to: ["delivered@resend.dev"],
        subject: `[Sunuvan] Nouvelle demande de ${data.name}`,
        html: adminEmailHtml,
      }),
    });

    console.log("Admin email response:", adminRes.status);

    // Send user confirmation
    const userRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Sunuvan <onboarding@resend.dev>",
        to: [data.email],
        subject: "Sunuvan - Nous avons reçu votre message",
        html: userEmailHtml,
      }),
    });

    console.log("User email response:", userRes.status);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error:", errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
