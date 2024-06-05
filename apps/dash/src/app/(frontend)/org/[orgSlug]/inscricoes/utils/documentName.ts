import { CategoryDocument } from "@prisma/client";

export function determineDocumentName(document: CategoryDocument) {
  if (document.name) return document.name;

  switch (document.type) {
    case "disability":
      return "Laudo PCD";

    case "minorAuthorization":
      return "Autorização de Menor";

    case "physicalAptitude":
      return "Atestado de Aptidão Física";
    default:
      return "Documento";
  }
}
