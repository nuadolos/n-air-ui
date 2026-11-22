export function validateCard(
  cardNumber: string,
  expiry: string,
  cvc: string,
): string {
  const digits = cardNumber.replace(/\s/g, "");
  if (!/^\d{16}$/.test(digits)) return "Введите номер карты из 16 цифр";
  if (!/^\d{2}\/\d{2}$/.test(expiry)) return "Срок действия: ММ/ГГ";

  const [month, year] = expiry.split("/").map(Number);
  const expiresAt = new Date(2000 + year, month);
  const now = new Date();
  if (month < 1 || month > 12 || expiresAt <= now)
    return "Срок действия карты истёк или указан неверно";

  if (!/^\d{3}$/.test(cvc)) return "Введите CVC из 3 цифр";
  return "";
}

export const emailValid = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export function formatCardNumber(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  const groups = digits.match(/.{1,4}/g);
  return groups ? groups.join(" ") : "";
}
