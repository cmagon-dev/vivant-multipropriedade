import nodemailer from "nodemailer";

interface SendInviteEmailParams {
  to: string;
  name: string;
  inviteToken: string;
}

export async function sendInviteEmail({ to, name, inviteToken }: SendInviteEmailParams) {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const inviteUrl = `${baseUrl}/convite/${inviteToken}`;

  // MODO DE DESENVOLVIMENTO: Não envia email, apenas loga
  const isDevelopment = process.env.NODE_ENV === "development" || !process.env.SMTP_HOST;
  
  if (isDevelopment) {
    console.log("\n" + "=".repeat(80));
    console.log("📧 EMAIL DE CONVITE (MODO TESTE - NÃO ENVIADO)");
    console.log("=".repeat(80));
    console.log(`\n👤 Para: ${to}`);
    console.log(`📝 Nome: ${name}`);
    console.log(`\n🔗 Link do Convite:`);
    console.log(`   ${inviteUrl}`);
    console.log(`\n💡 Para aceitar o convite:`);
    console.log(`   1. Copie o link acima`);
    console.log(`   2. Cole no navegador`);
    console.log(`   3. Ou acesse: http://localhost:3000/admin/convites-pendentes`);
    console.log("\n" + "=".repeat(80) + "\n");
    return;
  }

  // MODO DE PRODUÇÃO: Envia email real
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"Vivant Care" <${process.env.SMTP_FROM || "care@vivant.com.br"}>`,
    to,
    subject: "Bem-vindo ao Portal do Cotista Vivant Care",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Convite Portal Vivant Care</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background-color: #F8F9FA;">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
            <!-- Header -->
            <tr>
              <td style="background: linear-gradient(135deg, #10B981 0%, #0D9488 100%); padding: 40px 30px; text-align: center;">
                <img src="${baseUrl}/logo-vivant-care.png" alt="Vivant Care" style="height: 60px; margin-bottom: 20px;">
                <h1 style="color: #ffffff; font-size: 28px; margin: 0; font-weight: 700;">Bem-vindo ao Portal do Cotista!</h1>
              </td>
            </tr>
            
            <!-- Content -->
            <tr>
              <td style="padding: 40px 30px;">
                <p style="color: #1A2F4B; font-size: 18px; margin: 0 0 20px 0;">Olá, <strong>${name}</strong>!</p>
                
                <p style="color: #1A2F4B; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                  Você foi convidado a fazer parte do <strong>Portal do Cotista Vivant Care</strong>. 
                  Através do portal, você poderá:
                </p>
                
                <ul style="color: #1A2F4B; font-size: 15px; line-height: 1.8; margin: 0 0 30px 0; padding-left: 20px;">
                  <li>Gerenciar suas reservas e calendário de uso</li>
                  <li>Acompanhar cobranças e pagamentos</li>
                  <li>Participar de assembleias e votações</li>
                  <li>Acessar documentos e avisos importantes</li>
                  <li>Trocar semanas com outros cotistas</li>
                </ul>
                
                <p style="color: #1A2F4B; font-size: 16px; margin: 0 0 30px 0;">
                  Para ativar sua conta, clique no botão abaixo e crie sua senha:
                </p>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${inviteUrl}" style="display: inline-block; background: linear-gradient(135deg, #10B981 0%, #0D9488 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);">
                    Ativar Minha Conta
                  </a>
                </div>
                
                <p style="color: #64748B; font-size: 14px; margin: 30px 0 0 0; padding-top: 20px; border-top: 1px solid #E2E8F0;">
                  Este convite é válido por <strong>7 dias</strong>. Se você não solicitou este convite, por favor ignore este e-mail.
                </p>
              </td>
            </tr>
            
            <!-- Footer -->
            <tr>
              <td style="background-color: #F8F9FA; padding: 30px; text-align: center; border-top: 1px solid #E2E8F0;">
                <p style="color: #64748B; font-size: 13px; margin: 0 0 10px 0;">
                  <strong>Vivant Care</strong> - Gestão Hoteleira de Excelência
                </p>
                <p style="color: #64748B; font-size: 12px; margin: 0;">
                  care@vivant.com.br | (44) 99969-1196
                </p>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
  console.log(`✅ Email de convite enviado para ${to}`);
}

interface SendNotificationEmailParams {
  to: string;
  subject: string;
  message: string;
  ctaUrl?: string;
  ctaText?: string;
}

export async function sendNotificationEmail({ to, subject, message, ctaUrl, ctaText }: SendNotificationEmailParams) {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"Vivant Care" <${process.env.SMTP_FROM || "care@vivant.com.br"}>`,
    to,
    subject,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Inter', sans-serif; background-color: #F8F9FA;">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden;">
            <tr>
              <td style="background: linear-gradient(135deg, #10B981 0%, #0D9488 100%); padding: 30px; text-align: center;">
                <img src="${baseUrl}/logo-vivant-care.png" alt="Vivant Care" style="height: 50px;">
              </td>
            </tr>
            <tr>
              <td style="padding: 40px 30px;">
                <p style="color: #1A2F4B; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                  ${message}
                </p>
                ${ctaUrl && ctaText ? `
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${ctaUrl}" style="display: inline-block; background: #10B981; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 15px; font-weight: 600;">
                      ${ctaText}
                    </a>
                  </div>
                ` : ''}
              </td>
            </tr>
            <tr>
              <td style="background-color: #F8F9FA; padding: 20px; text-align: center;">
                <p style="color: #64748B; font-size: 12px; margin: 0;">
                  Vivant Care | care@vivant.com.br | (44) 99969-1196
                </p>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  };

  if (process.env.NODE_ENV === "production") {
    await transporter.sendMail(mailOptions);
  } else {
    console.log("📧 [DEV] Notification email:", { to, subject, message });
  }
}
