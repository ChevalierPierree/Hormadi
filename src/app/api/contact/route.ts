import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, phone, subject, message } = body

    // Validate required fields
    if (!firstName || !lastName || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Champs obligatoires manquants' },
        { status: 400 }
      )
    }

    // Try to send email via nodemailer
    try {
      const nodemailer = await import('nodemailer')

      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER || '',
          pass: process.env.SMTP_PASS || '',
        },
      })

      const fromAddress = process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@hormadi.fr'

      // Send notification email to club
      await transporter.sendMail({
        from: `"Site Hormadi" <${fromAddress}>`,
        to: 'contact@hormadi.fr',
        replyTo: email,
        subject: `[Contact Site] ${subject} — ${firstName} ${lastName}`,
        html: `
          <!DOCTYPE html>
          <html>
          <body style="margin:0;padding:0;background:#012e24;font-family:Arial,sans-serif;">
            <div style="max-width:600px;margin:0 auto;background:#021f19;border:1px solid #0a3d30;">
              <!-- Header -->
              <div style="background:#e4002b;padding:20px 30px;">
                <h1 style="margin:0;color:#fff;font-size:20px;font-weight:800;letter-spacing:1px;">
                  NOUVEAU MESSAGE — SITE WEB
                </h1>
              </div>

              <!-- Content -->
              <div style="padding:30px;">
                <table style="width:100%;border-collapse:collapse;">
                  <tr>
                    <td style="padding:8px 0;color:#8aafa6;font-size:12px;text-transform:uppercase;font-weight:700;letter-spacing:1px;width:120px;vertical-align:top;">Sujet</td>
                    <td style="padding:8px 0;color:#fff;font-size:14px;font-weight:700;">${subject}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;color:#8aafa6;font-size:12px;text-transform:uppercase;font-weight:700;letter-spacing:1px;vertical-align:top;">Nom</td>
                    <td style="padding:8px 0;color:#fff;font-size:14px;">${firstName} ${lastName}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;color:#8aafa6;font-size:12px;text-transform:uppercase;font-weight:700;letter-spacing:1px;vertical-align:top;">Email</td>
                    <td style="padding:8px 0;color:#009681;font-size:14px;">${email}</td>
                  </tr>
                  ${phone ? `
                  <tr>
                    <td style="padding:8px 0;color:#8aafa6;font-size:12px;text-transform:uppercase;font-weight:700;letter-spacing:1px;vertical-align:top;">Tél</td>
                    <td style="padding:8px 0;color:#fff;font-size:14px;">${phone}</td>
                  </tr>
                  ` : ''}
                </table>

                <div style="margin-top:20px;padding-top:20px;border-top:1px solid #0a3d30;">
                  <p style="color:#8aafa6;font-size:12px;text-transform:uppercase;font-weight:700;letter-spacing:1px;margin:0 0 10px;">Message</p>
                  <p style="color:#fff;font-size:14px;line-height:1.7;margin:0;white-space:pre-wrap;">${message}</p>
                </div>
              </div>

              <!-- Footer -->
              <div style="padding:15px 30px;background:#012e24;border-top:1px solid #0a3d30;">
                <p style="margin:0;color:#8aafa6;font-size:11px;">
                  Envoyé depuis le formulaire de contact du site hormadi.fr
                </p>
              </div>
            </div>
          </body>
          </html>
        `,
      })

      // Send confirmation email to user
      await transporter.sendMail({
        from: `"Hormadi Anglet" <${fromAddress}>`,
        to: email,
        subject: `Votre message a bien été reçu — Hormadi Anglet`,
        html: `
          <!DOCTYPE html>
          <html>
          <body style="margin:0;padding:0;background:#012e24;font-family:Arial,sans-serif;">
            <div style="max-width:600px;margin:0 auto;background:#021f19;border:1px solid #0a3d30;">
              <div style="background:#e4002b;padding:20px 30px;text-align:center;">
                <h1 style="margin:0;color:#fff;font-size:22px;font-weight:900;letter-spacing:2px;">
                  HORMADI ANGLET
                </h1>
              </div>
              <div style="padding:30px;">
                <h2 style="color:#fff;font-size:18px;font-weight:800;margin:0 0 15px;">
                  Merci pour votre message, ${firstName} !
                </h2>
                <p style="color:#a8d7d2;font-size:14px;line-height:1.7;margin:0 0 20px;">
                  Nous avons bien reçu votre demande concernant <strong style="color:#fff;">"${subject}"</strong>.
                  Notre équipe vous répondra dans les meilleurs délais, généralement sous 48h ouvrées.
                </p>
                <div style="background:#012e24;border:1px solid #0a3d30;border-radius:8px;padding:15px;margin:20px 0;">
                  <p style="color:#8aafa6;font-size:11px;text-transform:uppercase;font-weight:700;letter-spacing:1px;margin:0 0 8px;">Rappel de votre message</p>
                  <p style="color:#a8d7d2;font-size:13px;line-height:1.6;margin:0;white-space:pre-wrap;">${message.substring(0, 300)}${message.length > 300 ? '...' : ''}</p>
                </div>
                <p style="color:#8aafa6;font-size:13px;line-height:1.6;margin:20px 0 0;">
                  À bientôt à la Patinoire de la Barre !<br/>
                  <strong style="color:#e4002b;">L'équipe Hormadi</strong>
                </p>
              </div>
              <div style="padding:15px 30px;background:#012e24;border-top:1px solid #0a3d30;text-align:center;">
                <p style="margin:0;color:#8aafa6;font-size:11px;">
                  Hormadi Anglet — Patinoire de la Barre — 2 Rue de Hausquette, 64600 Anglet
                </p>
              </div>
            </div>
          </body>
          </html>
        `,
      })
    } catch (emailError) {
      // If email fails, log it but still return success
      // (form data is acknowledged even if email transport isn't configured)
      console.error('Email send error:', emailError)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
