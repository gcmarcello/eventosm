import dayjs from "dayjs";
import { prisma } from "../prisma";
import { createOrganization } from "@/app/api/orgs/service";
import { generateColorJson } from "@/app/api/colors/service";

export const orgSeed = async (userId: string) => {
  const orgUUID = "0ce7d854-e9c8-468b-b28b-28d32d725676";

  const { primaryColor, secondaryColor, tertiaryColor } =
    await generateColorJson({
      colors: {
        primaryColor: "green_600",
        secondaryColor: "yellow_300",
        tertiaryColor: "blue_600",
      },
    });

  if (!primaryColor || !secondaryColor || !tertiaryColor)
    throw "Cor não encontrada";

  const org = await prisma.organization.create({
    data: {
      id: orgUUID,
      ownerId: userId,
      name: "Confederacao Brasileira de MTB",
      slug: "cbmtb",
      abbreviation: "CBMTB",
      options: {
        logos: {
          lg: "https://cbmtb.s3.sa-east-1.amazonaws.com/assets/logonotxt.png",
        },
        colors: {
          primaryColor,
          secondaryColor,
          tertiaryColor,
        },
      },
      OrgCustomDomain: {
        create: {
          domain: process.env.SECOND_HOST + ":3000",
        },
      },

      phone: "21999999999",
      email: "",
    },
  });

  const eventGroupUUID = "0ce7d854-e9c8-468b-b28b-28d32d725676";
  const batchId = "8f95a855-5c36-47fd-b09e-6e208243fd3d";
  const categoryId = "8f95a855-5c36-47fd-b09e-6e208243fd3d";

  const eventGroup = await prisma.eventGroup.upsert({
    where: { id: eventGroupUUID },
    create: {
      id: eventGroupUUID,
      organizationId: org.id,
      name: "Copa Brasil de MTB",
      slug: "copabrasil",
      registrationType: "mixed",
      location: "Rio de Janeiro",
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
      EventModality: {
        create: {
          name: "MTB",
          modalityCategory: {
            create: {
              id: categoryId,
              name: "Mountain Bike",
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
          dateStart: dayjs("2022-01-01").toDate(),
          dateEnd: dayjs("2022-12-31").toDate(),
          maxRegistrations: 100,
          price: 0,
        },
      },
    },
    update: {
      id: eventGroupUUID,
      organizationId: org.id,
      name: "Copa Brasil de MTB",
      slug: "copabrasil",
      registrationType: "mixed",
      location: "Rio de Janeiro",
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
      EventModality: {
        create: {
          name: "MTB",
          modalityCategory: {
            create: {
              name: "Mountain Bike",
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
          name: "Lote 1",
          dateStart: dayjs("2022-01-01").toDate(),
          dateEnd: dayjs("2022-12-31").toDate(),
          maxRegistrations: 100,
          price: 100,
        },
      },
    },
  });

  const registration = await prisma.eventRegistration.create({
    data: {
      code: "1",
      status: "completed",
      batchId,
      categoryId,
      userId: userId,
      eventGroupId: eventGroup.id,
    },
  });

  return { org, eventGroup, registration };
};
