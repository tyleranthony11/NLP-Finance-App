export const calculateBiWeekly = (price, rate, termMonths) => {
  const r = rate / 2600;
  const n = (termMonths / 12) * 26;

  const payment = (price * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

  return payment.toFixed(2);
};