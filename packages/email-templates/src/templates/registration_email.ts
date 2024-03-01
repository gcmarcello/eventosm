import dayjs from "dayjs";

export function registration_email({
  mainColor,
  headerTextColor,
  orgName,
  name,
  siteLink,
  qrCode,
  eventName,
  dateStart,
  dateEnd,
  category,
  location,
  eventLink,
  modality,
}: {
  mainColor: string;
  headerTextColor: string;
  orgName: string;
  name: string;
  siteLink: string;
  qrCode: string;
  eventName: string;
  dateStart: string;
  dateEnd?: string;
  category: string;
  location?: string;
  modality: string;
  eventLink: string;
}) {
  return `<!doctype html>
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
          <h1>Confirmação de Inscrição</h1>
        </div>
        <div class="email-content">
        <p>Prezado(a) ${name},</p>
      
        <p>Obrigado por se inscrever no(a) <strong><span style="font-size:16px">${eventName}</span></strong>! Sua inscri&ccedil;&atilde;o foi confirmada e falta pouco para estarmos juntos!</p>
        
        <p>Aqui est&atilde;o as informa&ccedil;&otilde;es do evento e da sua inscri&ccedil;&atilde;o.&nbsp;Imprima este e-mail ou leve seu celular ao evento para facilitar o check-in!</p>
        
        <strong>QR Code para Check-in</strong><br/>
        <img alt="Seu QR Code está sendo processado, volte em instantes..." src="${qrCode}"/>
  
        <ul>
          <li><strong>Data:</strong>&nbsp;${dateStart} ${dateEnd && `-&nbsp;${dateEnd}`}</li>
          ${location ? `<li><strong>Local:</strong>&nbsp;${location}</li>` : ""}
          <li><strong>Categoria:</strong>&nbsp;${category} - ${modality}</li>
        </ul>
          <div style="display: flex; justify-content: center;">
            <a href="${siteLink}/perfil" class="button" style="margin-right: 10px;">Confira sua Inscrição</a>
            <a href="${siteLink}${eventLink}" class="button">Infos do Evento</a>
          </div>
          <p style="text-align: center">
          Copie e cole ou clique no link abaixo caso você não consiga clicar no botão:
          </p>
          <p style="text-align: center">
            <a href="${siteLink}" class="button"><span style="color: #888">${siteLink}</span></a>
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
