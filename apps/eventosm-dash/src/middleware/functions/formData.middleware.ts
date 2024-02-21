export async function FormDataMiddleware({ formData }: { formData: FormData }) {
  try {
    const obj: Record<string, any> = {};

    formData.forEach((value, key) => {
      // Direct inclusion of File objects into the resulting object
      if (value instanceof File) {
        obj[key] = value;
      } else {
        // Attempt to parse the value as JSON to accommodate complex data structures
        try {
          obj[key] = JSON.parse(value as string);
        } catch (error) {
          // This is the "else" logic for when JSON.parse fails, meaning the value is a simple string
          // If JSON.parse throws an error, assume the value is a simple string
          obj[key] = value;
        }
      }
    });

    return {
      request: {
        ...obj,
      },
    };
  } catch (error) {
    return false;
  }
}
