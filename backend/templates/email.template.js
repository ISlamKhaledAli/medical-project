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
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
      </style>
    </head>
    <body style="margin:0; padding:0; background-color:#F5F7FA; font-family:'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F5F7FA; padding:40px 16px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 12px 32px rgba(21, 101, 192, 0.08); border: 1px solid rgba(21, 101, 192, 0.05);">
              <!-- Header -->
              <tr>
                <td style="background:linear-gradient(135deg, #1565C0 0%, #0D47A1 100%); padding:40px; text-align:center;">
                  <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
                    <tr>
                      <td style="width:40px; height:40px; background:rgba(255,255,255,0.2); border-radius:10px; text-align:center; vertical-align:middle;">
                        <span style="font-size:20px; line-height:40px;">🏥</span>
                      </td>
                      <td style="padding-left:12px;">
                        <span style="color:#ffffff; font-size:22px; font-weight:800; letter-spacing:0.5px; text-transform: uppercase;">MEDISYSTEM</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <!-- Content -->
              <tr>
                <td style="padding:48px 40px;">
                  <h1 style="margin:0 0 16px; font-size:28px; font-weight:900; color:#1A237E; letter-spacing:-0.03em;">${title}</h1>
                  <p style="margin:0 0 24px; font-size:16px; color:#546E7A; font-weight: 500; line-height: 1.6;">${greeting}</p>
                  <p style="margin:0 0 32px; font-size:16px; color:#1A237E; line-height:1.7; font-weight: 500;">${body}</p>
                  
                  ${buttonText && buttonUrl ? `
                  <table cellpadding="0" cellspacing="0" style="margin:40px auto;">
                    <tr>
                      <td align="center" style="background:#1565C0; border-radius:10px; box-shadow: 0 8px 16px rgba(21, 101, 192, 0.25);">
                        <a href="${buttonUrl}" target="_blank" style="display:inline-block; padding:16px 40px; color:#ffffff; text-decoration:none; font-weight:700; font-size:16px; letter-spacing:0.2px;">
                          ${buttonText}
                        </a>
                      </td>
                    </tr>
                  </table>` : ''}
                  
                  ${buttonUrl ? `
                  <div style="margin-top: 48px; padding: 24px; background:#F8FAFC; border-radius:12px; border: 1px solid #E2E8F0;">
                    <p style="margin:0 0 8px; font-size:12px; color:#94A3B8; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Direct Link Access</p>
                    <p style="margin:0; font-size:13px; color:#1565C0; word-break:break-all; font-weight: 500; display: block;">${buttonUrl}</p>
                  </div>` : ''}

                  ${footerText ? `
                  <div style="margin-top: 32px;">
                    <p style="margin:0; font-size:14px; color:#64748B; line-height:1.6; font-weight: 500; border-left: 3px solid #E2E8F0; padding-left: 16px;">${footerText}</p>
                  </div>` : ''}
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="padding:32px 40px; background:#F8FAFC; text-align:center; border-top:1px solid #E2E8F0;">
                  <p style="margin:0 0 8px; font-size:13px; color:#64748B; font-weight: 800; letter-spacing: 0.2px;">MEDISYSTEM HEALTHCARE</p>
                  <p style="margin:0; font-size:12px; color:#94A3B8; font-weight: 500; line-height: 1.5;">&copy; ${new Date().getFullYear()} MediSystem. This is a secure automated notification regarding your account activity.</p>
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
