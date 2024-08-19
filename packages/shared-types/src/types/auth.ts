export type JwtUserPayload = {
  id: string;
  role: string;
  name: string;
  activeOrg?: string;
  iat: number;
  exp: number;
};
