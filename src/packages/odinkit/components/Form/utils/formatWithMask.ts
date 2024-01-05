export type MaskType = string | ((fieldValue: string) => string | null) | null;
export const formatWithMask = (event: any, mask: MaskType) => {
  if (typeof mask === "function") {
    mask = mask(event.target.value);
  }

  if (!mask) return event.target.value;

  let formattedValue = "";
  let inputIndex = 0;
  let maskIndex = 0;
  // Strip current formatting to get the raw value
  const rawValue = event.target.value.replace(/[^0-9a-zA-Z]/g, "");

  while (inputIndex < rawValue.length && maskIndex < mask.length) {
    const maskChar = mask[maskIndex];
    const inputChar = rawValue[inputIndex];

    if (maskChar === "9") {
      // Placeholder for a digit
      if (!/\d/.test(inputChar)) {
        break; // Break if input character is not a digit
      }
      formattedValue += inputChar;
      inputIndex++;
    } else if (maskChar === "a") {
      // Placeholder for a letter
      if (!/[a-zA-Z]/.test(inputChar)) {
        break; // Break if input character is not a letter
      }
      formattedValue += inputChar;
      inputIndex++;
    } else if (maskChar === "*") {
      // Wildcard character, accept any character
      formattedValue += inputChar;
      inputIndex++;
    } else {
      formattedValue += maskChar;
      // No need to check if inputChar matches maskChar, as rawValue contains only letters and digits
    }
    maskIndex++;
  }
  return formattedValue;
};
