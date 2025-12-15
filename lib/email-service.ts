import nodemailer from 'nodemailer';

// Email template untuk OTP
const getOTPEmailTemplate = (otpCode: string, userName?: string) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verifikasi OTP - SiGap Dengue</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background: white;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .header {
      background: #780606;
      color: white;
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
    }
    .content {
      padding: 40px 30px;
    }
    .otp-box {
      background: #c460602f;
      border: 2px dashed #780606;
      border-radius: 8px;
      padding: 25px;
      text-align: center;
      margin: 30px 0;
    }
    .otp-code {
      font-size: 36px;
      font-weight: bold;
      color: black;
      letter-spacing: 8px;
      margin: 10px 0;
      font-family: 'Courier New', monospace;
    }
    .footer {
      background: #f8f9fa;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #6c757d;
    }
    img {
      max-width: 150px;
      display: block;
      margin: 0 auto 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>SiGap Dengue</h1>
      <p>Verifikasi Akun Anda</p>
    </div>

    <div class="content">
      <h2>Halo${userName ? ` ${userName}` : ''}!</h2>
      <p>Terima kasih telah mendaftar di SiGap Dengue. Untuk melanjutkan, silakan verifikasi email Anda dengan kode OTP berikut:</p>

      <div class="otp-box">
        <p style="margin: 0; color: #6c757d; font-size: 14px;">Kode Verifikasi OTP Anda:</p>
        <div class="otp-code">${otpCode}</div>
        <p style="margin: 0; color: #6c757d; font-size: 12px;">Kode berlaku selama 10 menit</p>
      </div>

      <p>Jika Anda tidak melakukan pendaftaran ini, abaikan email ini atau hubungi tim support kami.</p>

      <p style="margin-top: 30px;">
        Salam sehat,<br>
        <strong>Tim CH SiGap Dengue</strong>
      </p>
    </div>

    <div class="footer">
      <p>Email ini dikirim secara otomatis, mohon tidak membalas email ini.</p>
      <p>&copy; 2025 SiGap Dengue. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;
};

// Konfigurasi transporter untuk Brevo SMTP
const createEmailTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.BREVO_SMTP_HOST || 'smtp-relay.brevo.com',
    port: parseInt(process.env.BREVO_SMTP_PORT || '587'),
    secure: false, // true untuk port 465, false untuk port lainnya
    auth: {
      user: process.env.BREVO_SMTP_USER,
      pass: process.env.BREVO_SMTP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false // Allow self-signed certificates
    },
    debug: true, // Enable debug output
    logger: true // Log information
  });
};

// Function untuk mengirim OTP email
export async function sendOTPEmail(
  email: string,
  otpCode: string,
  userName?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Validasi environment variables
    if (!process.env.BREVO_SMTP_USER || !process.env.BREVO_SMTP_PASSWORD) {
      console.error('Missing SMTP credentials:', {
        user: !!process.env.BREVO_SMTP_USER,
        pass: !!process.env.BREVO_SMTP_PASSWORD,
      });
      throw new Error('BREVO SMTP credentials not configured');
    }

    console.log('Creating SMTP transporter with:', {
      host: process.env.BREVO_SMTP_HOST,
      port: process.env.BREVO_SMTP_PORT,
      user: process.env.BREVO_SMTP_USER,
    });

    const transporter = createEmailTransporter();

    // Verify transporter configuration
    try {
      await transporter.verify();
      console.log('SMTP transporter verified successfully');
    } catch (verifyError) {
      console.error('SMTP verification failed:', verifyError);
      // Continue anyway, will fail at sendMail if really broken
    }

    // Opsi email
    const mailOptions = {
      from: `"${process.env.BREVO_SENDER_NAME || 'SiGap Dengue'}" <${process.env.BREVO_SENDER_EMAIL || process.env.BREVO_SMTP_USER}>`,
      to: email,
      subject: `Kode Verifikasi OTP Anda: ${otpCode}`,
      html: getOTPEmailTemplate(otpCode, userName),
      text: `Kode OTP Anda adalah: ${otpCode}. Kode ini berlaku selama 10 menit. Jangan bagikan kode ini kepada siapapun.`,
    };

    // Kirim email
    const info = await transporter.sendMail(mailOptions);

    console.log('OTP Email sent successfully:', info.messageId);

    return { success: true };
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// Function untuk generate OTP 6 digit
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
