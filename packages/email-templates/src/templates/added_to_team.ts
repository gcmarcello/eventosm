export function added_to_team({
  mainColor,
  headerTextColor,
  name,
  siteLink,
  teamName,
  orgName,
  ownerName,
  ownerPhone,
}: {
  mainColor: string;
  headerTextColor: string;
  orgName: string;
  name: string;
  siteLink: string;
  teamName: string;
  ownerName: string;
  ownerPhone: string;
}) {
  return `<!doctype html>
    <html lang="pt-br">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Bem Vindo - ${teamName}</title>
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
            background-color: ${mainColor}!important;
            color: ${headerTextColor}!important;
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
            background-color: ${mainColor}!important;
            color: ${headerTextColor}!important;
            text-decoration: none;
            border-radius: 5px;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="email-header">
            <h1>Bem-vindo(a) à ${teamName}!</h1>
          </div>
          <div class="email-content">
            <p>Olá ${name}!</p>
            <p>Bem vindo ao time ${teamName} no sistema EventoSM.</p>
            <p>
              Você foi adicionado por ${ownerName} no site da(o) ${orgName}. Você já pode ser inscrito em eventos junto com sua nova equipe e ter seus resultados compartilhados.
            </p>
            <p style="text-align: center">
              <a href="${siteLink}" class="button">Acesse o Site</a>
            </p>
            <p style="text-align: center">
            Copie e cole ou clique no link abaixo caso você não consiga clicar no botão:
            </p>
            <p style="text-align: center">
              <span style="color: #888">${siteLink}</span>
            </p>
            <p style="text-align: center">
            Se você não autorizou ser adicionado a este time, por favor entre em contato com o administrador do time em ${ownerPhone}.
            </p>
            <p>Atenciosamente,<br />Equipe EventoSM</p>
          </div>
          <div class="email-footer">
            <p>&copy; 2024 EventoSM. Todos os direitos reservados.</p>
          </div>
        </div>
      </body>
    </html>
    `;
}
