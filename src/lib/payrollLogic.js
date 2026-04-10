// OT Rate formula: 1.5x the employee's hourly rate
// Hourly rate = Basic Pay / 200 (standard monthly working hours)
export const getOTRate = (basicPay) => (parseFloat(basicPay) / 200) * 1.5;

export const calculateGross = (basicPay, otHours) => {
  const otRate = getOTRate(basicPay);
  return parseFloat(basicPay) + (parseFloat(otHours) * otRate);
};

export const calculateTax = (gross) => {
  if (gross <= 3000) {
    return 0.0;
  } else if (gross <= 5000) {
    return (gross - 3000) * 0.10;
  } else {
    return 200.0 + (gross - 5000) * 0.20;
  }
};

export const calculateNet = (basicPay, otHours) => {
  const gross = calculateGross(basicPay, otHours);
  return gross - calculateTax(gross);
};
