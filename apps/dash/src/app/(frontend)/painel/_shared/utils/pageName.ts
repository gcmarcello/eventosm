export function getPageName(url: string, mobile: boolean = false): string {
  const pageName = url;

  if (mobile) {
    if (
      /^\/painel\/eventos\/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
        url
      )
    ) {
      return "Evento";
    }
  }

  if (
    /^\/painel\/eventos\/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
      url
    )
  ) {
    return "Detalhes do Evento";
  }

  if (pageName === "/painel/usuarios") {
    return "Usuários";
  }

  if (mobile) {
    switch (pageName) {
      case "/painel/eventos/novo":
        return "Novo Evento";
      case "/painel/eventos":
        return "Eventos";
      case "/painel/configuracoes":
        return "Configurações";
      case "/painel/galerias":
        return "Galerias";
      case "/painel/galerias/nova":
        return "Nova Galeria";
      default:
        return "Painel";
    }
  } else {
    switch (pageName) {
      case "/painel/eventos/novo":
        return "Novo Evento";
      case "/painel/eventos":
        return "Eventos";
      case "/painel/configuracoes":
        return "Configurações da Organização";
      case "/painel/galerias":
        return "Galerias";
      case "/painel/galerias/nova":
        return "Nova Galeria";
      default:
        return "Painel";
    }
  }
}
