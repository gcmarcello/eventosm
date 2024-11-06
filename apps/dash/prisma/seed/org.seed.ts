import dayjs from "dayjs";

import { createOrganization } from "@/app/api/orgs/service";
import { generateColorJson } from "@/app/api/colors/service";
import { getServerEnv } from "@/app/api/env";
import prisma from "prisma/prisma";

export const orgSeed = async (userId: string) => {
  const orgUUID = "0ce7d854-e9c8-468b-b28b-28d32d725676";

  const { primaryColor, secondaryColor, tertiaryColor } =
    await generateColorJson({
      colors: {
        primaryColor: "lime_500",
        secondaryColor: "zinc_700",
        tertiaryColor: "white",
      },
    });

  if (!primaryColor || !secondaryColor || !tertiaryColor)
    throw "Cor não encontrada";

  const users = await prisma.user.findMany();

  const org = await prisma.organization.create({
    data: {
      id: orgUUID,
      ownerId: userId,
      name: "Circuito Cubatense de Corrida de Rua",
      slug: "cubatense",
      abbreviation: "Cubatense",
      options: {
        images: {
          logo: "https://i.imgur.com/fMAlJVi.png",
          hero: "https://i.imgur.com/fMAlJVi.png",
          bg: "https://i.imgur.com/fMAlJVi.png",
        },
        colors: {
          primaryColor,
          secondaryColor,
          tertiaryColor,
        },
      },
      OrgCustomDomain: {
        create: {
          domain: getServerEnv("SECOND_HOST") + ":3000",
        },
      },
      UserOrgLink: {
        createMany: {
          data: users.map((user) => ({
            userId: user.id,
          })),
        },
      },
      phone: "21999999999",
      email: "cubatao@cubatao.com",
    },
  });

  const eventGroupUUID = "0ce7d854-e9c8-468b-b28b-28d32d725676";
  const batchId = "8f95a855-5c36-47fd-b09e-6e208243fd3d";
  const categoryId = "8f95a855-5c36-47fd-b09e-6e208243fd3d";

  const eventGroup = await prisma.eventGroup.create({
    data: {
      id: eventGroupUUID,
      organizationId: org.id,
      status: "published",
      name: "Circuito Cubatense de Rua 2024",
      slug: "cubatense",
      registrationType: "mixed",
      location: "Cubatão",
      imageUrl: "https://i.imgur.com/fMAlJVi.png",
      eventGroupType: "championship",
      EventGroupRules: {
        create: {
          mode: "league",
          resultType: "time",
          discard: 3,
          scoreCalculation: "average",
          justifiedAbsences: 3,
          unjustifiedAbsences: 0,
        },
      },
      Event: {
        create: {
          name: "Circuito Cubatense de Rua 2024",
          dateStart: dayjs("2024-03-17").toISOString(),
          dateEnd: dayjs("2024-03-17").toISOString(),
          status: "published",
          location: "Cubatão",
          details: "Circuito Cubatense de Rua 2024",
          slug: "aaaaaaaaaa",
          organizationId: org.id,
        },
      },
      EventModality: {
        create: {
          name: "7km",
          id: "8f95a855-5c36-47fd-b09e-6e208243fd3d",
          modalityCategory: {
            create: {
              id: categoryId,
              name: "Master",
              maxAge: 60,
              minAge: 16,
              gender: "unisex",
            },
          },
        },
      },
      EventRegistrationBatch: {
        create: {
          registrationType: "mixed",
          id: batchId,
          name: "Lote 1",
          dateStart: dayjs("2024-03-01").toISOString(),
          dateEnd: dayjs("2024-03-15").toISOString(),
          maxRegistrations: 100,
          price: 0,
        },
      },
      EventAddon: {
        create: {
          name: "Camiseta",
          price: 0,
          status: "active",
          options: ["P", "M", "G", "GG"],
        },
      },
    },
  });

  const registration = await prisma.eventRegistration.create({
    data: {
      qrCode:
        "https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg",
      code: "1",
      status: "active",
      batchId,
      modalityId: "8f95a855-5c36-47fd-b09e-6e208243fd3d",
      categoryId,
      userId: userId,
      eventGroupId: eventGroup.id,
    },
  });

  return { org, eventGroup, registration };
};
