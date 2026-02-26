/**
 * Generate a styled HTML email template for MEDIC TOTAL
 */
export const emailTemplate = ({ title, greeting, body, buttonText, buttonUrl, footerText }) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${title}</title>
    </head>
    <body style="margin:0; padding:0; background-color:#F5F7FA; font-family:'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F5F7FA; padding:40px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 12px 24px rgba(26, 35, 126, 0.08); border: 1px solid rgba(26, 35, 126, 0.05);">
              <!-- Header -->
              <tr>
                <td style="background:linear-gradient(135deg, #1565C0 0%, #1A237E 100%); padding:48px 40px 40px; text-align:center;">
                  <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
                    <tr>
                      <td style="width:48px; height:48px; background:rgba(255,255,255,0.15); border-radius:12px; text-align:center; vertical-align:middle;">
                        <span style="font-size:24px; line-height:48px;">🏥</span>
                      </td>
                      <td style="padding-left:16px;">
                        <span style="color:#ffffff; font-size:24px; font-weight:900; letter-spacing:-0.5px; text-transform: uppercase;">MEDIC TOTAL</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <!-- Body -->
              <tr>
                <td style="padding:48px 40px;">
                  <h1 style="margin:0 0 12px; font-size:28px; font-weight:900; color:#1A237E; letter-spacing:-0.02em;">${title}</h1>
                  <p style="margin:0 0 24px; font-size:16px; color:#546E7A; font-weight: 500;">${greeting}</p>
                  <p style="margin:0 0 32px; font-size:16px; color:#1A237E; line-height:1.8; opacity: 0.9;">${body}</p>
                  ${buttonText && buttonUrl ? `
                  <table cellpadding="0" cellspacing="0" style="margin:0 auto 32px;">
                    <tr>
                      <td style="background:#1565C0; border-radius:12px; box-shadow: 0 8px 16px rgba(21, 101, 192, 0.25);">
                        <a href="${buttonUrl}" target="_blank" style="display:inline-block; padding:18px 48px; color:#ffffff; text-decoration:none; font-weight:800; font-size:16px; letter-spacing:0.5px;">
                          ${buttonText}
                        </a>
                      </td>
                    </tr>
                  </table>` : ''}
                  
                  <div style="margin-top: 40px; padding-top: 32px; border-top: 1px solid #E3E8ED;">
                    <p style="margin:0 0 8px; font-size:13px; color:#94A3B8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Trouble clicking?</p>
                    <p style="margin:0 0 24px; font-size:12px; color:#1565C0; word-break:break-all; font-weight: 500;">${buttonUrl || ''}</p>
                  </div>

                  ${footerText ? `
                  <div style="padding:24px; background:#F8FAFC; border-radius:12px; border: 1px solid #E2E8F0;">
                    <p style="margin:0; font-size:14px; color:#64748B; line-height:1.6; font-weight: 500;">${footerText}</p>
                  </div>` : ''}
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="padding:32px 40px; background:#F8FAFC; text-align:center; border-top:1px solid #E2E8F0;">
                  <p style="margin:0 0 8px; font-size:13px; color:#64748B; font-weight: 700;">&copy; ${new Date().getFullYear()} MEDIC TOTAL — Healthcare Redefined</p>
                  <p style="margin:0; font-size:12px; color:#94A3B8; font-weight: 500;">This is a system-generated secure clinical communication.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};
