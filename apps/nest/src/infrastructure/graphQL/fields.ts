import {
  GraphQLResolveInfo,
  FieldNode,
  FragmentDefinitionNode,
  SelectionNode,
  DirectiveNode,
  ArgumentNode,
  ValueNode,
} from "graphql";

interface Options {
  processArguments?: boolean;
  excludedFields?: string[];
}

const options: Options = {};

function getSelections(ast: any): SelectionNode[] {
  if (
    ast &&
    ast.selectionSet &&
    ast.selectionSet.selections &&
    ast.selectionSet.selections.length
  ) {
    return ast.selectionSet.selections;
  }

  return [];
}

function isFragment(ast: any): boolean {
  return ast.kind === "InlineFragment" || ast.kind === "FragmentSpread";
}

function getAST(
  ast: any,
  info: GraphQLResolveInfo
): FieldNode | FragmentDefinitionNode {
  if (ast.kind === "FragmentSpread") {
    const fragmentName = ast.name.value;
    return info.fragments[fragmentName]!;
  }
  return ast;
}

function getArguments(
  ast: any,
  info: GraphQLResolveInfo
): Record<string, any>[] {
  return ast.arguments.map((argument: ArgumentNode) => {
    const argumentValue = getArgumentValue(argument.value, info);

    return {
      [argument.name.value]: {
        kind: argument.value.kind,
        value: argumentValue,
      },
    };
  });
}

function getArgumentValue(arg: ValueNode, info: GraphQLResolveInfo): any {
  switch (arg.kind) {
    case "FloatValue":
      return parseFloat(arg.value);
    case "IntValue":
      return parseInt(arg.value, 10);
    case "Variable":
      return info.variableValues[arg.name.value];
    case "ListValue":
      return arg.values.map((argument: ValueNode) =>
        getArgumentValue(argument, info)
      );
    case "ObjectValue":
      return arg.fields.reduce(
        (argValue: Record<string, any>, objectField: any) => {
          argValue[objectField.name.value] = getArgumentValue(
            objectField.value,
            info
          );
          return argValue;
        },
        {}
      );
    default:
      return arg;
  }
}

function getDirectiveValue(
  directive: DirectiveNode,
  info: GraphQLResolveInfo
): boolean {
  const arg = directive.arguments![0]!; // only arg on an include or skip directive is "if"
  if (arg.value.kind !== "Variable") {
    return !!arg.value;
  }
  return !!info.variableValues[arg.value.name.value];
}

function getDirectiveResults(ast: any, info: GraphQLResolveInfo) {
  const directiveResult = {
    shouldInclude: true,
    shouldSkip: false,
  };
  return ast.directives.reduce((result: any, directive: DirectiveNode) => {
    switch (directive.name.value) {
      case "include":
        return { ...result, shouldInclude: getDirectiveValue(directive, info) };
      case "skip":
        return { ...result, shouldSkip: getDirectiveValue(directive, info) };
      default:
        return result;
    }
  }, directiveResult);
}

function flattenAST(
  ast: any,
  info: GraphQLResolveInfo,
  obj: Record<string, any> = {}
): Record<string, any> {
  return getSelections(ast).reduce((flattened: any, a: any) => {
    if (a.directives && a.directives.length) {
      const { shouldInclude, shouldSkip } = getDirectiveResults(a, info);
      // field/fragment is not included if either the @skip condition is true or the @include condition is false
      // https://facebook.github.io/graphql/draft/#sec--include
      if (shouldSkip || !shouldInclude) {
        return flattened;
      }
    }
    if (isFragment(a)) {
      flattened = flattenAST(getAST(a, info), info, flattened);
    } else {
      const name = a.name.value;
      if (
        options.excludedFields &&
        options.excludedFields.indexOf(name) !== -1
      ) {
        return flattened;
      }
      if (flattened[name] && flattened[name] !== "__arguments") {
        Object.assign(flattened[name], flattenAST(a, info, flattened[name]));
      } else {
        flattened[name] = flattenAST(a, info);
      }
      if (options.processArguments) {
        // check if the current field has arguments
        if (a.arguments && a.arguments.length) {
          Object.assign(flattened[name], {
            __arguments: getArguments(a, info),
          });
        }
      }
    }

    return flattened;
  }, obj);
}

export function graphqlFields(
  info: GraphQLResolveInfo,
  obj: Record<string, any> = {},
  opts: Options = { processArguments: false }
): Record<string, any> {
  const fields = info.fieldNodes;
  options.processArguments = opts.processArguments;
  options.excludedFields = opts.excludedFields || [];
  return (
    fields.reduce((o: Record<string, any>, ast: FieldNode) => {
      return flattenAST(ast, info, o);
    }, obj) || {}
  );
}
