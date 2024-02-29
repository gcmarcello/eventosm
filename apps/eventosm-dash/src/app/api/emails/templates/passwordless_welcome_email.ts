export function passwordless_welcome_email({
  mainColor,
  headerTextColor,
  orgName,
  name,
  siteLink,
}: {
  mainColor: string;
  headerTextColor: string;
  orgName: string;
  name: string;
  siteLink: string;
}) {
  return `
  <!doctype html>
  <html lang="pt-br">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Bem Vindo - ${orgName}</title>
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
        <h1>Bem-vindo(a) à ${orgName}!</h1>
      </div>
      <div class="email-content">
        <p>Olá ${name}!</p>
        <p>Bem vindo à ${orgName} no sistema EventoSM.</p>
        <p>
          Você foi cadastrado e inscrito em um evento da ${orgName}. Clique no botão abaixo para criar uma senha e acessar sua conta.
        </p>
        <p style="text-align: center">
          <a href="${siteLink}" class="button">Acesse o Site</a>
        </p>
        <p>
          À partir de agora você poderá acessar nosso sistema e ter acesso aos eventos e inscrições!
        </p>
        <p>Atenciosamente,<br />Equipe ${orgName}</p>
      </div>
      <div class="email-footer">
        <p>&copy; 2024 EventoSM. Todos os direitos reservados.</p>
      </div>
    </div>
  </body>
</html>
`;
}
