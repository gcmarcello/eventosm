export function new_protocol({
  mainColor,
  headerTextColor,
  orgName,
  name,
  email,
  phone,
  message,
}: {
  mainColor: string;
  headerTextColor: string;
  orgName: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
}) {
  return `<!doctype html>
      <html lang="pt-br">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Novo Chamado Recebido - ${orgName}</title>
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
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="email-header">
              <h1>Novo Chamado Recebido - ${orgName}</h1>
            </div>
            <div class="email-content">
              <p>Olá,</p>
              <p>Um novo chamado foi recebido e aguarda sua resposta.</p>
              <p><strong>Detalhes do Chamado:</strong></p>
              <ul>
                <li><strong>Nome:</strong> ${name}</li>
                <li><strong>Email:</strong> ${email}</li>
                <li><strong>Telefone:</strong> ${phone || "Não informado"}</li>
              </ul>
              <p>${message}</p>
              <p>Para responder ao chamado, basta responder a este email. Sua resposta será enviada diretamente ao solicitante.</p>
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

export function protocol_confirmation({
  mainColor,
  headerTextColor,
  orgName,
  name,
  protocolNumber,
}: {
  mainColor: string;
  headerTextColor: string;
  orgName: string;
  name: string;
  protocolNumber: string;
}) {
  return `<!doctype html>
      <html lang="pt-br">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Confirmação de Protocolo - ${orgName}</title>
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
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="email-header">
              <h1>Protocolo Registrado - ${orgName}</h1>
            </div>
            <div class="email-content">
              <p>Olá ${name},</p>
              <p>Agradecemos por entrar em contato com a ${orgName}. Sua solicitação foi recebida com sucesso.</p>
              <p><strong>Número do Protocolo:</strong> ${protocolNumber}</p>
              <p>Nosso time responderá o mais breve possível. Por favor, mantenha o número do protocolo para acompanhamento e futuras referências.</p>
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
