import { Enum as _Enum } from "@mikro-orm/core";

export const Enum = (e: any, options: Parameters<typeof _Enum>[0] = {}) => {
  return _Enum({
    ...options,
    items: e.items,
    nativeEnumName: e.name,
  });
};
