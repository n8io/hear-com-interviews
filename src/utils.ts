/**
 * Create a display summary string for the cart.
 */
export function formatCartSummary(
  items: { id: string; price: number; quantity: number; category?: string }[],
  totals: { subtotal: number; discount: number; grandTotal: number },
): string {
  const lines = [
    'Cart Summary:',
    '----------------',
    ...items.map(
      (item) => `${item.quantity} x Item ${item.id} @ $${item.price} = $${(item.price * item.quantity).toFixed(2)}`,
    ),
    '----------------',
    `Subtotal: $${totals.subtotal.toFixed(2)}`,
    `Discount: -$${totals.discount.toFixed(2)}`,
    `Grand Total: $${totals.grandTotal.toFixed(2)}`,
  ]

  return lines.join('\n')
}
