export const calculateBiWeekly = (price, rate, termMonths) => {
  const p = Number(price);
  const r = Number(rate) / 2600;
  const n = (Number(termMonths) / 12) * 26;

  console.log("calculateBiWeekly inputs:", { p, r, n });

  const payment = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

  return payment.toFixed(2);
};

export const calculateWeekly = (price, rate, termMonths) => {
  const r = rate / 5200;
  const n = (termMonths / 12) * 52;

  const payment = (price * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  return payment.toFixed(2);
};

export const calculateMonthly = (price, rate, termMonths) => {
  const r = rate / 1200;
  const n = termMonths;

  const payment = (price * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  return payment.toFixed(2);
};

export function formatLocalDate(dateString) {
  const [year, month, day] = dateString.split("-");
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export const capitalizeFirstLetter = (string) => {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
};
