import nodemailer from "nodemailer";

export const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: `MediConnect <${process.env.EMAIL_USERNAME}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};

/**
 * Generate a styled HTML email template
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
    <body style="margin:0; padding:0; background-color:#f4f6f9; font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f9; padding:40px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.08);">
              <!-- Header -->
              <tr>
                <td style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%); padding:40px 40px 30px; text-align:center;">
                  <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
                    <tr>
                      <td style="width:44px; height:44px; background:rgba(255,255,255,0.2); border-radius:12px; text-align:center; vertical-align:middle;">
                        <span style="font-size:24px; line-height:44px;">🏥</span>
                      </td>
                      <td style="padding-left:12px;">
                        <span style="color:#ffffff; font-size:22px; font-weight:800; letter-spacing:-0.5px;">MediConnect</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <!-- Body -->
              <tr>
                <td style="padding:40px;">
                  <h1 style="margin:0 0 8px; font-size:24px; font-weight:800; color:#1a1a2e;">${title}</h1>
                  <p style="margin:0 0 24px; font-size:15px; color:#6b7280;">${greeting}</p>
                  <p style="margin:0 0 32px; font-size:15px; color:#374151; line-height:1.7;">${body}</p>
                  ${buttonText && buttonUrl ? `
                  <table cellpadding="0" cellspacing="0" style="margin:0 auto 32px;">
                    <tr>
                      <td style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%); border-radius:12px;">
                        <a href="${buttonUrl}" target="_blank" style="display:inline-block; padding:16px 48px; color:#ffffff; text-decoration:none; font-weight:700; font-size:15px; letter-spacing:0.3px;">
                          ${buttonText}
                        </a>
                      </td>
                    </tr>
                  </table>` : ''}
                  <p style="margin:0 0 8px; font-size:13px; color:#9ca3af;">If the button doesn't work, copy and paste this link into your browser:</p>
                  <p style="margin:0 0 24px; font-size:12px; color:#667eea; word-break:break-all;">${buttonUrl || ''}</p>
                  ${footerText ? `<p style="margin:0; padding:16px; background:#f9fafb; border-radius:8px; font-size:13px; color:#6b7280; line-height:1.6;">${footerText}</p>` : ''}
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="padding:24px 40px; background:#f9fafb; text-align:center; border-top:1px solid #f0f0f0;">
                  <p style="margin:0 0 4px; font-size:12px; color:#9ca3af;">&copy; ${new Date().getFullYear()} MediConnect — Your Health, Our Priority</p>
                  <p style="margin:0; font-size:11px; color:#d1d5db;">This is an automated email. Please do not reply directly.</p>
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
