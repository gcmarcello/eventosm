import { Color, PrismaClient } from "@prisma/client";
import { twColor, twShade } from "odinkit";
import { OrganizationColors } from "./types/Colors";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prisma: ReturnType<typeof prismaClientSingleton>;
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
      };
    };

    type EventOptions = {
      accountlessRegistration?: boolean;
      multipleRegistrations?: boolean;
    };

    type EventGroupOptions = {
      accountlessRegistration?: boolean;
      multipleRegistrations?: boolean;
    };

    type OrderItems = {
      registrations?: string[];
      subscriptions?: string[];
    };

    type TailwindColor = {
      id: string;
      color: twColor;
      shade?: twShade | null;
    };
  }
}

export const prisma = globalThis.prisma! ?? prismaClientSingleton()!;

globalThis.prisma = prisma;
