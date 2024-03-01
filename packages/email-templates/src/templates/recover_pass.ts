export function recover_pass({
  mainColor,
  headerTextColor,
  orgName,
  name,
  recoveryLink,
}: {
  mainColor: string;
  headerTextColor: string;
  orgName: string;
  name: string;
  recoveryLink: string;
}) {
  return `<!doctype html>
  <html lang="pt-br">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Recuperação de Senha - ${orgName}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
        }
        .email-container {
          max-width: 600px;
          margin: 40px auto;
          background: #fff;
          border: 1px solid #ddd;
          overflow: hidden;
        }
        .email-header {
          background-color: ${mainColor};
          color: ${headerTextColor};
          padding: 20px;
          text-align: center;
        }
        .email-content {
          padding: 20px;
          line-height: 1.6;
          color: #333;
        }
        .email-footer {
          text-align: center;
          padding: 20px;
          background-color: #efefef;
          color: #333;
        }
        .button {
          display: inline-block;
          padding: 10px 20px;
          margin: 20px 0;
          background-color: ${mainColor};
          color: ${headerTextColor};
          text-decoration: none;
          border-radius: 5px;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="email-header">
          <h1>Recuperação de Senha - ${orgName}</h1>
        </div>
        <div class="email-content">
          <p>Olá, ${name}!</p>
          <p>
            Você solicitou a recuperação de sua senha no site ${orgName}. Clique no botão abaixo
            para redefinir sua senha:
          </p>
          <p style="text-align: center">
            <a href="${recoveryLink}" class="button">Redefinir Senha</a>
          </p>
          <p style="text-align: center">
          Copie e cole o link abaixo caso você não consiga clicar no botão:
          </p>
          <p style="text-align: center">
            <span style="color: #888">${recoveryLink}</span>
          </p>
          <p>Se você não solicitou a recuperação de senha, por favor ignore este e-mail.</p>
          <p>Atenciosamente,<br />Equipe ${orgName}</p>
        </div>
        <div class="email-footer">
          <p>&copy; 2024 Tecnologia EventoSM. Todos os direitos reservados.</p>
        </div>
      </div>
    </body>
  </html>
  `;
}
