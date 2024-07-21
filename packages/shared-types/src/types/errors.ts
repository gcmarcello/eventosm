export type PropertyError = {
  property: string;
  constraints: Record<string, string> | undefined;
};
