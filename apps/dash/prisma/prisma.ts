import { Color, PrismaClient } from "@prisma/client";
import { twColor, twShade } from "odinkit";
import { OrganizationColors } from "./types/Colors";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prismaGlobal: ReturnType<typeof prismaClientSingleton>;
  namespace PrismaJson {
    type OrganizationOptions = {
      images?: {
        bg?: string;
        hero?: string;
        logo?: string;
      };
      socialMedia?: {
        facebook?: string | null;
        instagram?: string | null;
        twitter?: string | null;
        youtube?: string | null;
      };
      colors: OrganizationColors;
      pages?: {
        documents?: boolean;
        contact?: boolean;
      };
    };

    type additionalInfo = {
      suspensionReason?: string;
    };

    type EventOptions = {
      accountlessRegistration?: boolean;
      multipleRegistrations?: boolean;
      rules?: {
        registrationMode?: "team" | "individual";
        modalities?: {
          modId: string;
          teamSize?: number;
          enableCategoryControl?: boolean;
          requiredCategories?: { id: string; number: number }[];
        }[];
      };
    };

    type EventGroupOptions = {
      accountlessRegistration?: boolean;
      multipleRegistrations?: boolean;
    };

    type TailwindColor = {
      id: string;
      color: twColor;
      shade?: twShade | null;
    };
  }
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
