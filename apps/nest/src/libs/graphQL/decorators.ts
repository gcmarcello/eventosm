import { Query as Q } from "@nestjs/graphql";
import fieldsToRelations from ".";
import { GraphQLResolveInfo as GI } from "graphql";
import { Populate } from "@mikro-orm/core";

export type GraphQLResolveInfo = GI & {
  relations: Populate<any>;
};

export function Query(...args: Parameters<typeof Q>): MethodDecorator {
  return (target, key, descriptor: any) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...params) {
      const infoIndex = params.findIndex((param) =>
        Boolean(param["fieldNodes"])
      );

      if (infoIndex !== -1) {
        const info = params[infoIndex];

        const relations = fieldsToRelations(info);

        info.relations = relations;
      }

      return originalMethod.apply(this, params);
    };

    return Q(...args)(target, key, descriptor);
  };
}
