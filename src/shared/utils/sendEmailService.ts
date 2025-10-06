import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // true para 465, false para outras portas
  auth: {
    user: "98b333003@smtp-brevo.com", // mesmo email cadastrado no Brevo
    pass: "PEdzvhy1ItFaQ8V4", // chave gerada no painel
  },
}); 

export async function sendEmail({to, subject, html}: {to: string, subject: string, html: string}) {
  try {
    const info = await transporter.sendMail({
      from: '"Biko" <tech@bikoservicos.com.br>',
      to,
      subject,
      html,
    });

    console.log("E-mail enviado com sucesso:", info.messageId);
    return info;
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
    throw new Error("Falha no envio de e-mail");
  }
}
