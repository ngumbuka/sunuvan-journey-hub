export const FCFA_TO_EURO_RATE = 655.957;

export function formatCurrency(amount: number): string {
    // Assuming amount is already in Euro or we just want to display it
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
}
