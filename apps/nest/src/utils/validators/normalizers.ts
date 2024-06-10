export function normalizeEmail(data: string) {
  return data.toLowerCase();
}

export function normalizePhone(data: string) {
  return data?.replace(/[^0-9]/g, "");
}

export function normalizeZipCode(data: string) {
  return data?.replace(/[^0-9]/g, "");
}

export function normalizeDocument(data: string) {
  return data?.replace(/[^a-zA-Z0-9]/g, "");
}
