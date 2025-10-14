const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Divino Diseño <noreply@divinodiseno.com>',
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email enviado:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error al enviar email:', error);
    return { success: false, error: error.message };
  }
};

const sendCommentNotification = async ({ productoNombre, comentario, adminEmail }) => {
  const subject = `Nuevo comentario en: ${productoNombre}`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f9f9f9;
          border: 1px solid #ddd;
          border-radius: 8px;
        }
        .header {
          background-color: #4CAF50;
          color: white;
          padding: 15px;
          text-align: center;
          border-radius: 8px 8px 0 0;
        }
        .content {
          padding: 20px;
          background-color: white;
          border-radius: 0 0 8px 8px;
        }
        .comment-box {
          background-color: #f0f0f0;
          padding: 15px;
          margin: 15px 0;
          border-left: 4px solid #4CAF50;
          border-radius: 4px;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          font-size: 12px;
          color: #777;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Nuevo Comentario en tu Producto</h2>
        </div>
        <div class="content">
          <p>Hola,</p>
          <p>Se ha recibido un nuevo comentario en el producto: <strong>${productoNombre}</strong></p>

          <div class="comment-box">
            <p><strong>Comentario:</strong></p>
            <p>${comentario}</p>
          </div>

          <p>Puedes ver todos los comentarios en tu panel de administración.</p>

          <div class="footer">
            <p>Este es un correo automático de Divino Diseño</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
    Nuevo Comentario en: ${productoNombre}

    Comentario: ${comentario}

    Puedes ver todos los comentarios en tu panel de administración.
  `;

  return await sendEmail({ to: adminEmail, subject, html, text });
};

module.exports = {
  transporter,
  sendEmail,
  sendCommentNotification,
};
