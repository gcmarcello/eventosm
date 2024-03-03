export function parseEventStatus(status: string) {
  switch (status) {
    case "draft":
      return "Pendente";
    case "published":
      return "Publicado";
    case "cancelled":
      return "Cancelado";
    case "archived":
      return "Arquivado";
    default:
      return "Criado";
  }
}
