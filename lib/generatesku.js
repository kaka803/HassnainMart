export const generateSKU = (productName) => {
  const namePart = productName.toLowerCase().replace(/\s+/g, "-").slice(0, 20);
  const uniquePart = Date.now().toString().slice(-6); // Last 6 digits of timestamp
  return `${namePart}-${uniquePart}`;
}


