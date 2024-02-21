export function calculatePrice({
  categoryPrice,
  addonPrice,
  couponDiscount,
}: {
  categoryPrice: number;
  addonPrice: number;
  couponDiscount?: number;
}) {
  if (categoryPrice + addonPrice - (couponDiscount || 0) === 0)
    return "Gratuito";
  return formatPrice(categoryPrice + addonPrice - (couponDiscount || 0));
}

export function formatPrice(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}
