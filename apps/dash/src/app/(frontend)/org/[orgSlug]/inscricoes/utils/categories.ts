import { UserSession } from "@/middleware/functions/userSession.middleware";
import { ModalityCategory, UserInfo } from "@prisma/client";
import dayjs from "dayjs";

export function filterCategories(
  categories: ModalityCategory[],
  user: { gender: string; birthDate: Date }
) {
  const filteredCategories = categories.filter((category) =>
    determineCategoryAvailability(category, user)
  );
  return filteredCategories;
}

export function determineCategoryAvailability(
  category: ModalityCategory,
  user: { gender: string; birthDate: Date }
) {
  const currentYear = dayjs().year();
  const userBirthDateThisYear = Number(
    dayjs(user.birthDate).toISOString().split("-")[0]
  );
  const userAge = currentYear - userBirthDateThisYear;

  if (
    (category?.gender === "unisex" || category.gender === user.gender) &&
    category.minAge <= userAge &&
    category.maxAge >= userAge
  )
    return category;
}
