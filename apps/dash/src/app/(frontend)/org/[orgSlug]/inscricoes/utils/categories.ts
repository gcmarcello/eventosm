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
  const userAge = dayjs().diff(user.birthDate, "year");
  if (
    (category?.gender === "unisex" || category.gender === user.gender) &&
    category.minAge <= userAge &&
    category.maxAge >= userAge
  )
    return category;
}
