/** Display prices in Bangladeshi Taka (BDT) */
export function formatBdt(amount: number | undefined | null): string {
  if (amount == null || Number.isNaN(amount)) return "";
  return `৳${Number(amount).toLocaleString("en-BD")}`;
}
