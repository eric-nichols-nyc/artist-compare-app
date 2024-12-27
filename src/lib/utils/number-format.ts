export const parseCompactNumber = (value: string | number | null): number | null => {
  if (value === null || value === "N/A") return null;
  if (typeof value === "number") return value;
  
  const multipliers: { [key: string]: number } = {
    'K': 1000,
    'M': 1000000,
    'B': 1000000000
  };

  const match = value.match(/^([\d.]+)\s*([KMB])?$/i);
  if (!match) return null;

  const [, num, unit] = match;
  const baseValue = parseFloat(num);
  const multiplier = unit ? multipliers[unit.toUpperCase()] : 1;

  return baseValue * multiplier;
}; 