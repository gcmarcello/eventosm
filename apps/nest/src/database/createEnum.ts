import { registerEnumType } from "@nestjs/graphql";

export function createEnum(e: any, name: string) {
  registerEnumType(e, {
    name,
  });
  return { items: e, name };
}
