// Email utility for sending ticket confirmations
// Requires: npm install nodemailer @types/nodemailer

import type { Transporter } from 'nodemailer'

let transporter: Transporter | null = null

async function getTransporter() {
  if (transporter) return transporter
  // Dynamic import to avoid build errors if nodemailer isn't installed
  const nodemailer = await import('nodemailer')

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
    },
  })

  return transporter
}

interface TicketEmailData {
  to: string
  customerName: string
  reference: string
  matchDate: string
  matchTime: string
  homeTeam: string
  awayTeam: string
  venue: string
  categoryName: string
  quantity: number
  totalPrice: number // in cents
  qrCodeUrl: string
}

function generateEmailHTML(data: TicketEmailData): string {
  const priceFormatted = (data.totalPrice / 100).toFixed(2).replace('.', ',') + ' €'

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vos billets Hormadi</title>
</head>
<body style="margin:0;padding:0;background-color:#012e24;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#012e24;">
    <tr>
      <td align="center" style="padding:30px 15px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:#e4002b;padding:20px 30px;border-radius:12px 12px 0 0;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <h1 style="margin:0;color:white;font-size:22px;font-weight:900;letter-spacing:1px;">
                      🏒 E-BILLET HORMADI
                    </h1>
                  </td>
                  <td align="right">
                    <span style="color:rgba(255,255,255,0.8);font-size:12px;font-family:monospace;">
                      ${data.reference}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#0a3d30;padding:30px;">
              <!-- Greeting -->
              <p style="color:#b0c4b1;font-size:14px;margin:0 0 20px;">
                Bonjour <strong style="color:white;">${data.customerName}</strong>,
              </p>
              <p style="color:#b0c4b1;font-size:14px;margin:0 0 25px;">
                Votre réservation est confirmée ! Voici vos billets pour le match :
              </p>

              <!-- Match Card -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#012e24;border-radius:12px;border:1px solid #1a5c4a;margin-bottom:25px;">
                <tr>
                  <td style="padding:25px;">
                    <h2 style="margin:0 0 5px;color:white;font-size:24px;font-weight:900;">
                      ${data.homeTeam} vs ${data.awayTeam}
                    </h2>
                    <p style="margin:0;color:#009681;font-size:13px;">
                      Synerglace Ligue Magnus — Saison 2026-2027
                    </p>

                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:20px;">
                      <tr>
                        <td width="50%" style="padding:10px;background:#0a3d30;border-radius:8px;">
                          <p style="margin:0;color:#6b9e95;font-size:10px;text-transform:uppercase;letter-spacing:1px;">Date</p>
                          <p style="margin:4px 0 0;color:white;font-size:14px;font-weight:700;">${data.matchDate}</p>
                        </td>
                        <td width="10"></td>
                        <td width="50%" style="padding:10px;background:#0a3d30;border-radius:8px;">
                          <p style="margin:0;color:#6b9e95;font-size:10px;text-transform:uppercase;letter-spacing:1px;">Heure</p>
                          <p style="margin:4px 0 0;color:white;font-size:14px;font-weight:700;">${data.matchTime}</p>
                        </td>
                      </tr>
                      <tr><td colspan="3" height="10"></td></tr>
                      <tr>
                        <td width="50%" style="padding:10px;background:#0a3d30;border-radius:8px;">
                          <p style="margin:0;color:#6b9e95;font-size:10px;text-transform:uppercase;letter-spacing:1px;">Lieu</p>
                          <p style="margin:4px 0 0;color:white;font-size:14px;font-weight:700;">${data.venue}</p>
                        </td>
                        <td width="10"></td>
                        <td width="50%" style="padding:10px;background:#0a3d30;border-radius:8px;">
                          <p style="margin:0;color:#6b9e95;font-size:10px;text-transform:uppercase;letter-spacing:1px;">Catégorie</p>
                          <p style="margin:4px 0 0;color:white;font-size:14px;font-weight:700;">${data.categoryName}</p>
                        </td>
                      </tr>
                    </table>

                    <!-- Ticket holder + quantity -->
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:15px;background:#0a3d30;border-radius:8px;">
                      <tr>
                        <td style="padding:12px;">
                          <p style="margin:0;color:#6b9e95;font-size:10px;text-transform:uppercase;letter-spacing:1px;">Titulaire</p>
                          <p style="margin:3px 0 0;color:white;font-size:14px;font-weight:700;">${data.customerName}</p>
                        </td>
                        <td align="right" style="padding:12px;">
                          <p style="margin:0;color:#6b9e95;font-size:10px;text-transform:uppercase;letter-spacing:1px;">Places</p>
                          <p style="margin:3px 0 0;color:#e4002b;font-size:28px;font-weight:900;">${data.quantity}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- QR Code -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="padding:20px 0;">
                    <p style="margin:0 0 15px;color:#6b9e95;font-size:11px;text-transform:uppercase;letter-spacing:2px;">
                      Présentez ce QR code à l'entrée
                    </p>
                    <table role="presentation" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="background:white;padding:15px;border-radius:12px;">
                          <img src="${data.qrCodeUrl}" alt="QR Code" width="200" height="200" style="display:block;border:0;" />
                        </td>
                      </tr>
                    </table>
                    <p style="margin:10px 0 0;color:#6b9e95;font-size:11px;font-family:monospace;">
                      ${data.reference}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Total -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-top:1px dashed #1a5c4a;margin-top:15px;padding-top:15px;">
                <tr>
                  <td>
                    <p style="margin:0;color:#6b9e95;font-size:12px;">Total payé</p>
                  </td>
                  <td align="right">
                    <p style="margin:0;color:white;font-size:20px;font-weight:900;">${priceFormatted}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Info -->
          <tr>
            <td style="background:#009681;padding:20px 30px;">
              <p style="margin:0;color:white;font-size:13px;font-weight:700;">
                📍 Rappel : Les portes ouvrent 1h avant le match.
              </p>
              <p style="margin:5px 0 0;color:rgba(255,255,255,0.8);font-size:12px;">
                N'oubliez pas votre billet (imprimé ou sur mobile) !
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#012e24;padding:20px 30px;border-radius:0 0 12px 12px;border:1px solid #0a3d30;border-top:0;">
              <p style="margin:0;color:#6b9e95;font-size:11px;text-align:center;">
                Hormadi Anglet — Patinoire de la Barre — 299 avenue de l'Adour, 64600 Anglet
              </p>
              <p style="margin:5px 0 0;color:#6b9e95;font-size:11px;text-align:center;">
                <a href="mailto:contact@hormadi.fr" style="color:#009681;">contact@hormadi.fr</a> — 05 59 57 17 37
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export async function sendTicketEmail(data: TicketEmailData): Promise<{ success: boolean; error?: string }> {
  try {
    const transport = await getTransporter()

    await transport.sendMail({
      from: process.env.SMTP_FROM || '"Hormadi Anglet" <billetterie@hormadi.fr>',
      to: data.to,
      subject: `🏒 Vos billets — ${data.homeTeam} vs ${data.awayTeam} — ${data.matchDate}`,
      html: generateEmailHTML(data),
    })

    return { success: true }
  } catch (error: any) {
    console.error('Email send error:', error)
    return { success: false, error: error.message || 'Failed to send email' }
  }
}
