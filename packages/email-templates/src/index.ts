import * as templates from "./templates";

export * from "./utils/email";
export * from "./utils/generateEmailHtml";
export type EmailTemplate = keyof typeof templates;
