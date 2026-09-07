export function centsToEuros(cents: number): string {
  return (cents / 100).toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
  });
}

export function eurosToCents(euros: number): number {
  return Math.round(euros * 100);
}
