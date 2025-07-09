import { formatCartSummary } from './utils.ts'

/**
 * Determine applicable discount based on quantity or subtotal rules.
 * - 5% discount for any item with quantity >= 10
 */
function calculateDiscount(
  items: {
    id: string
    price: number
    quantity: number
  }[],
  subtotal: number,
): number {
  const hasBulkItem = items.some((item) => item.quantity >= 10)
  const bulkDiscount = hasBulkItem ? subtotal * 0.05 : 0
  const highValueDiscount = subtotal > 500 ? subtotal * 0.1 : 0

  return Math.max(bulkDiscount, highValueDiscount)
}

/**
 * Calculate cart totals with discounts.
 */
export function calculateCartTotals(items: Array<{ quantity: number; id: string; price: number }>): {
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
 * Entry point handler function.
 */
export function handleCartRequest(req: {
  body: {
    items: Array<{
      id: string
      price: number
      quantity: number
    }>
  }
}): {
  status: number
  body: string
} {
  const items = req.body.items
  const totals = calculateCartTotals(items)
  const summary = formatCartSummary(items, totals)

  return { status: 200, body: summary }
}

/**
 * Calculate the subtotal of items in the cart.
 */
function calculateSubtotal(
  items: {
    price: number
    quantity: number
    id: string
  }[],
): number {
  return items.reduce((total, item) => {
    return total + item.price * item.quantity
  }, 0)
}
