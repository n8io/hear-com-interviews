import { calculateCartTotals, formatCartSummary, handleCartRequest } from './calculation.ts'

describe('cartDiscount', () => {
  const baseItems = [
    { id: 'A', price: 30, quantity: 2 },
    { id: 'B', price: 20, quantity: 1 },
  ]

  it('calculates totals with no discount', () => {
    const totals = calculateCartTotals(baseItems)
    expect(totals).toEqual({ subtotal: 80, discount: 0, grandTotal: 80 })
  })

  it('applies quantity discount for bulk items', () => {
    const items = [{ id: 'C', price: 10, quantity: 10 }]
    const totals = calculateCartTotals(items)
    expect(totals).toEqual({ subtotal: 100, discount: 5, grandTotal: 95 })
  })

  it('applies subtotal discount for high-value carts', () => {
    const items = [{ id: 'D', price: 600, quantity: 1 }]
    const totals = calculateCartTotals(items)
    expect(totals).toEqual({ subtotal: 600, discount: 60, grandTotal: 540 })
  })

  it('formats a correct cart summary', () => {
    const totals = calculateCartTotals(baseItems)
    const summary = formatCartSummary(baseItems, totals)
    expect(summary).toMatch(/Subtotal: \$80\.00/)
    expect(summary).toMatch(/Discount: -\$0\.00/)
    expect(summary).toMatch(/Grand Total: \$80\.00/)
  })

  it('handler returns 200 and summary', () => {
    const res = handleCartRequest({ body: { items: baseItems } })
    expect(res.status).toBe(200)
    expect(res.body).toMatch(/Cart Summary/)
  })
})
