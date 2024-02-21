import { z, ZodObject, ZodOptional, ZodDefault } from "zod";
import { UseFormReturn } from "react-hook-form";

function addNonOptionalFields(
  fields: [string, any][],
  fieldSchema: { [key: string]: z.ZodTypeAny } | undefined,
  prefix = ""
): [string, string][] {
  if (!fieldSchema) {
    console.error(`Field schema is undefined at prefix "${prefix}".`);
    return [];
  }

  return fields.flatMap(([key, value]) => {
    if (!(key in fieldSchema)) {
      console.error(`Key "${key}" not found in schema at path "${prefix}".`);
      return [];
    }

    const currentFieldSchema = fieldSchema[key];

    if (
      value === undefined ||
      value === null ||
      currentFieldSchema instanceof ZodOptional ||
      currentFieldSchema instanceof ZodDefault
    ) {
      return [];
    }

    if (
      typeof value === "object" &&
      !(value instanceof Date) &&
      currentFieldSchema instanceof ZodObject
    ) {
      const nestedSchema = currentFieldSchema.shape;
      return addNonOptionalFields(
        Object.entries(value),
        nestedSchema,
        `${prefix}${key}.`
      );
    }

    return [[`${prefix}${key}`, value.toString()]];
  });
}

export function verifyStep<Schema extends ZodObject<any, any, any, any>>(
  step: number,
  form: UseFormReturn<any>,
  stepSchema: Schema
): boolean {
  const numberOfSteps = Object.keys(stepSchema.shape).length;

  if (step < 0 || step >= numberOfSteps) return false;

  const stepData = form.getValues()[`step${step + 1}`];
  if (!stepData) return false;

  const currentStepSchema = stepSchema.shape[`step${step + 1}`];
  if (!currentStepSchema) return false;

  let parsedStepData;
  try {
    parsedStepData = currentStepSchema.parse(stepData);
  } catch (error) {
    return false;
  }

  const requiredFields = currentStepSchema.shape;
  const dirtyFields = addNonOptionalFields(
    Object.entries(parsedStepData),
    requiredFields
  );

  if (dirtyFields.some((field) => !field[1])) return false;
  if (form.formState.errors[`step${step + 1}`]) return false;

  return true;
}
