export const FCFA_TO_EURO_RATE = 655.957;

export function formatCurrency(amountInFcfa: number): string {
    const amountInEuro = Math.round(amountInFcfa / FCFA_TO_EURO_RATE);
    return `${amountInEuro} €`;
}
