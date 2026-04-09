export const OT_RATE = 50.0;

export const calculateGross = (basicPay, otHours) => {
  return parseFloat(basicPay) + (parseFloat(otHours) * OT_RATE);
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
