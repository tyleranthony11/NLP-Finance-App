export const calculateBiWeekly = (price, rate, termMonths) => {
  const r = rate / 2600;
  const n = (termMonths / 12) * 26;

  const payment = (price * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

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