import type { User } from "better-auth/types";
import { transporter } from "./transporter";
import bcrypt from "bcrypt";

export async function sendMagicLink({
  url,
  token,
  email,
}: {
  url: string;
  token: string;
  email: string;
}) {
  const link = `${url}?token=${token}`;

  const info = await transporter.sendMail({
    from: process.env.NODEMAILER_FROM,
    to: email,
    subject: "Entrar com MagicLink",
    html: `
            <h1>Efetue o login no BetterAuth FullStack</h1>
            <p>Clique no link abaixo para acessar sua conta:</p>
            <a href="${link}" style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Entrar no Seu App</a>
            <p>Ou copie e cole no navegador: <br> ${link}</p>
            <p>Se você não solicitou isso, pode ignorar este e-mail.</p>
          `,
  });

  console.log("Email enviado: %s", info.messageId);
}

export async function mailVerification({
  user,
  url,
  token,
}: {
  user: User;
  url: string;
  token: string;
}) {
  try {
    const link = `${url}?token=${token}`;
    await transporter.sendMail({
      from: process.env.NODEMAILER_FROM,
      to: user.email,
      subject: "Verifique seu registro - +Studos",
      html: `
              <div style="max-width: 480px; margin: 0 auto; font-family: Arial, Helvetica, sans-serif; background: #f9f9f9; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.07); padding: 32px;">
                <div style="text-align: center; margin-bottom: 24px;">
                  <img src="https://cdn-icons-png.flaticon.com/512/5616/5616468.png" alt="+Studos" width="64" style="margin-bottom: 12px;" />
                  <h2 style="color: #222; margin: 0;">Bem-vindo ao +Studos!</h2>
                </div>
                <p style="color: #444; font-size: 16px; margin-bottom: 24px;">
                  Olá, <b>${user.name || user.email}</b>!<br>
                  Para concluir seu cadastro, por favor confirme seu e-mail clicando no botão abaixo:
                </p>
                <div style="text-align: center; margin-bottom: 24px;">
                  <a href="${link}" style="display: inline-block; padding: 14px 32px; background: #007bff; color: #fff; font-size: 16px; border-radius: 6px; text-decoration: none; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.04);">
                    Confirmar e-mail
                  </a>
                </div>
                <p style="color: #666; font-size: 14px; margin-bottom: 16px;">
                  Se o botão não funcionar, copie e cole o link abaixo no seu navegador:
                </p>
                <div style="background: #fff; border-radius: 5px; padding: 12px; word-break: break-all; font-size: 13px; color: #007bff; margin-bottom: 24px; border: 1px solid #e0e0e0;">
                  ${link}
                </div>
                <p style="color: #999; font-size: 13px; text-align: center;">
                  Se você não solicitou este cadastro, apenas ignore este e-mail.<br>
                  Obrigado por escolher o +Studos!
                </p>
              </div>
            `,
    });
  } catch (error) {
    console.error(error);
    return {
      message: error,
    };
  }
}

export async function hashPass({ password }: { password: string }) {
  const saltHands = 10;
  const hashedPassword = bcrypt.hashSync(password, saltHands);
  return hashedPassword;
}

export async function comparePass({
  hash,
  password,
}: {
  hash: string;
  password: string;
}) {
  const verify = await bcrypt.compare(password, hash);
  return verify;
}
