// Convert cents to pounds
export function toPound(cents: number): number {
  return cents / 100;
}

// Convert pounds to cents
export function toCent(pounds: number): number {
  return Math.round(pounds * 100);
}
