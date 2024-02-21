import { Organization } from "@prisma/client";

export type OrganizationWithOptions = Omit<Organization, "options"> & {
  options?: {
    abbreviation?: string;
    logos?: {
      lg?: string;
    };
    images?: {
      bg?: string;
      hero?: string;
      logo?: string;
    };
    image: string;
    colors: {
      primaryColor?: Color;
      secondaryColor?: Color;
      tertiaryColor?: Color;
      primaryShade?: string;
      secondaryShade?: string;
      tertiaryShade?: string;
    };
  };
};

export type Color =
  | "slate"
  | "gray"
  | "zinc"
  | "neutral"
  | "stone"
  | "red"
  | "orange"
  | "amber"
  | "yellow"
  | "lime"
  | "green"
  | "emerald"
  | "teal"
  | "cyan"
  | "sky"
  | "blue"
  | "indigo"
  | "violet"
  | "purple"
  | "fuchsia"
  | "pink"
  | "rose"
  | "white"
  | "dark";
