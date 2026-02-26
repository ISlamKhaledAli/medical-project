/**
 * Verification Success HTML View
 */
export const verificationSuccessTemplate = (clientUrl) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Verified | MEDIC TOTAL</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body {
        font-family: 'Inter', system-ui, -apple-system, sans-serif;
        background: #F8FAFC;
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
      }
      body::before {
        content: '';
        position: absolute;
        top: 0; left: 0; right: 0; height: 400px;
        background: linear-gradient(135deg, #1565C0 0%, #1A237E 100%);
        z-index: 1;
      }
      .card {
        background: #fff;
        border-radius: 24px;
        padding: 60px 48px;
        text-align: center;
        max-width: 480px;
        width: 90%;
        box-shadow: 0 25px 50px -12px rgba(26, 35, 126, 0.15);
        animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        position: relative;
        z-index: 2;
        border: 1px solid rgba(26, 35, 126, 0.05);
      }
      @keyframes slideUp {
        from { opacity: 0; transform: translateY(40px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .icon-container {
        width: 88px;
        height: 88px;
        background: #ECFDF5;
        border-radius: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 32px;
        animation: bounceIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s both;
      }
      @keyframes bounceIn {
        0% { transform: scale(0); opacity: 0; }
        100% { transform: scale(1); opacity: 1; }
      }
      .icon-container svg {
        width: 44px;
        height: 44px;
        stroke: #059669;
        stroke-width: 3;
        fill: none;
      }
      h1 {
        color: #1A237E;
        font-size: 32px;
        font-weight: 900;
        margin-bottom: 12px;
        letter-spacing: -0.03em;
      }
      p {
        color: #546E7A;
        font-size: 16px;
        line-height: 1.6;
        margin-bottom: 40px;
        font-weight: 500;
      }
      .btn {
        display: inline-block;
        background: #1565C0;
        color: #fff;
        text-decoration: none;
        padding: 16px 48px;
        border-radius: 14px;
        font-weight: 800;
        font-size: 16px;
        transition: all 0.3s ease;
        letter-spacing: 0.02em;
        box-shadow: 0 10px 20px -5px rgba(21, 101, 192, 0.3);
      }
      .btn:hover {
        transform: translateY(-2px);
        background: #0D47A1;
        box-shadow: 0 15px 30px -5px rgba(21, 101, 192, 0.4);
      }
      .footer {
        margin-top: 40px;
        color: #94A3B8;
        font-size: 13px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="icon-container">
        <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
      <h1>Account Verified!</h1>
      <p>Your email address has been successfully validated. You are now part of MEDIC TOTAL. Access your dashboard clinical tools now.</p>
      <a href="${clientUrl}/login" class="btn">Login to Dashboard</a>
      <p class="footer">MEDIC TOTAL &mdash; Healthcare Redefined</p>
    </div>
  </body>
  </html>
`;

/**
 * Verification Failure HTML View
 */
export const verificationFailureTemplate = (clientUrl, errMsg) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Verification Failed | MEDIC TOTAL</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body {
        font-family: 'Inter', system-ui, -apple-system, sans-serif;
        background: #F8FAFC;
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
      }
      body::before {
        content: '';
        position: absolute;
        top: 0; left: 0; right: 0; height: 400px;
        background: linear-gradient(135deg, #F43F5E 0%, #BE123C 100%);
        z-index: 1;
      }
      .card {
        background: #fff;
        border-radius: 24px;
        padding: 60px 48px;
        text-align: center;
        max-width: 480px;
        width: 90%;
        box-shadow: 0 25px 50px -12px rgba(190, 18, 60, 0.15);
        animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        position: relative;
        z-index: 2;
        border: 1px solid rgba(190, 18, 60, 0.05);
      }
      @keyframes slideUp {
        from { opacity: 0; transform: translateY(40px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .icon-container {
        width: 88px;
        height: 88px;
        background: #FFF1F2;
        border-radius: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 32px;
        animation: bounceIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s both;
      }
      @keyframes bounceIn {
        0% { transform: scale(0); opacity: 0; }
        100% { transform: scale(1); opacity: 1; }
      }
      .icon-container svg {
        width: 44px;
        height: 44px;
        stroke: #E11D48;
        stroke-width: 3;
        fill: none;
      }
      h1 {
        color: #1A237E;
        font-size: 32px;
        font-weight: 900;
        margin-bottom: 12px;
        letter-spacing: -0.03em;
      }
      .error-msg {
        color: #BE123C;
        font-size: 14px;
        font-weight: 700;
        background: #FFF1F2;
        padding: 12px 20px;
        border-radius: 12px;
        margin-bottom: 24px;
        display: inline-block;
      }
      p {
        color: #546E7A;
        font-size: 16px;
        line-height: 1.6;
        margin-bottom: 40px;
        font-weight: 500;
      }
      .btn {
        display: inline-block;
        background: #1565C0;
        color: #fff;
        text-decoration: none;
        padding: 16px 48px;
        border-radius: 14px;
        font-weight: 800;
        font-size: 16px;
        transition: all 0.3s ease;
        letter-spacing: 0.02em;
        box-shadow: 0 10px 20px -5px rgba(21, 101, 192, 0.3);
      }
      .btn:hover {
        transform: translateY(-2px);
        background: #0D47A1;
        box-shadow: 0 15px 30px -5px rgba(21, 101, 192, 0.4);
      }
      .footer {
        margin-top: 40px;
        color: #94A3B8;
        font-size: 13px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="icon-container">
        <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </div>
      <h1>Verification Failed</h1>
      <div class="error-msg">${errMsg}</div>
      <p>The verification link may have expired or is invalid. Please try logging in again to receive a fresh verification link.</p>
      <a href="${clientUrl}/login" class="btn">Back to Login</a>
      <p class="footer">MEDIC TOTAL &mdash; Healthcare Redefined</p>
    </div>
  </body>
  </html>
`;
