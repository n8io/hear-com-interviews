/**
 * Calculate the subtotal of items in the cart.
 */
function calculateSubtotal(items: { id: string; price: number; quantity: number }[]): number {
  let total = 0
  for (let i = 0; i < items.length; i++) {
    total = total + items[i].price * items[i].quantity
  }
  return total
}

/**
 * Determine applicable discount based on quantity or subtotal rules.
 * - 5% discount for any item with quantity >= 10
 */
function calculateDiscount(items: { id: string; price: number; quantity: number }[], subtotal: number): number {
  const hasBulkItem = items.some((item) => item.quantity >= 10)
  const bulkDiscount = hasBulkItem ? subtotal * 0.05 : 0

  const highValueDiscount = subtotal > 500 ? subtotal * 0.1 : 0

  return Math.max(bulkDiscount, highValueDiscount)
}

/**
 * Calculate cart totals with discounts.
 */
export function calculateCartTotals(items: { id: string; price: number; quantity: number }[]): {
  subtotal: number
  discount: number
  grandTotal: number
} {
  const subtotal = calculateSubtotal(items)
  const discount = calculateDiscount(items, subtotal)
  const grandTotal = subtotal - discount

  return { subtotal, discount, grandTotal }
}

/**
 * Create a display summary string for the cart.
 */
export function formatCartSummary(
  items: { id: string; price: number; quantity: number }[],
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

/**
 * Entry point handler function.
 */
export function handleCartRequest(req: { body: { items: { id: string; price: number; quantity: number }[] } }): {
  status: number
  body: string
} {
  const items = req.body.items
  const totals = calculateCartTotals(items)
  const summary = formatCartSummary(items, totals)

  return { status: 200, body: summary }
}
