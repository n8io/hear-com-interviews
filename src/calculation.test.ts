import { calculateCartTotals, handleCartRequest } from './calculation.ts'

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

  it('handler returns 200 and summary', () => {
    const res = handleCartRequest({ body: { items: baseItems } })
    expect(res.status).toBe(200)
    expect(res.body).toMatch(/Cart Summary/)
  })

  describe('handles bad inputs', () => {
    it('returns 400 when the request body is missing', () => {
      // @ts-expect-error - we want to test the error case
      const res = handleCartRequest({})
      expect(res.status).toBe(400)
    })

    it('returns 400 when the request body is not an object', () => {
      // @ts-expect-error - we want to test the error case
      const res = handleCartRequest({ body: 'not an object' })
      expect(res.status).toBe(400)
    })

    it('returns 400 when the request body is missing items', () => {
      // @ts-expect-error - we want to test the error case
      const res = handleCartRequest({ body: {} })
      expect(res.status).toBe(400)
    })

    it('returns 400 when an item has a negative quantity', () => {
      const res = handleCartRequest({ body: { items: [{ id: 'A', price: 10, quantity: -1 }] } })
      expect(res.status).toBe(400)
    })
  })

  describe('edge cases', () => {
    it('handles decimal precision correctly', () => {
      const items = [
        { id: 'A', price: 0.1, quantity: 3 },
        { id: 'B', price: 0.2, quantity: 2 }
      ]
      const totals = calculateCartTotals(items)
      // Should handle floating point arithmetic correctly
      expect(totals.subtotal).toBe(0.7)
      expect(totals.grandTotal).toBe(0.7)
    })

    it('handles duplicate item IDs by merging quantities', () => {
      const items = [
        { id: 'A', price: 10, quantity: 2 },
        { id: 'A', price: 10, quantity: 3 }
      ]
      const totals = calculateCartTotals(items)
      // Should merge items with same ID
      expect(totals).toEqual({ subtotal: 50, discount: 0, grandTotal: 50 })
    })

    it('rejects negative prices', () => {
      const items = [{ id: 'A', price: -10, quantity: 1 }]
      // Should throw error or return error status for negative prices
      expect(() => calculateCartTotals(items)).toThrow()
    })

    it('handles both bulk and high-value discounts correctly', () => {
      const items = [
        { id: 'A', price: 100, quantity: 10 }, // triggers bulk discount
        { id: 'B', price: 500, quantity: 1 }   // pushes over 500 threshold
      ]
      const totals = calculateCartTotals(items)
      // Should apply the higher discount (10% vs 5%)
      expect(totals).toEqual({ subtotal: 1500, discount: 150, grandTotal: 1350 })
    })

    it('handles very large numbers without overflow', () => {
      const items = [
        { id: 'A', price: Number.MAX_SAFE_INTEGER, quantity: 1 }
      ]
      const totals = calculateCartTotals(items)
      // Should handle large numbers without overflow
      expect(totals.subtotal).toBe(Number.MAX_SAFE_INTEGER)
      expect(totals.grandTotal).toBe(Number.MAX_SAFE_INTEGER)
    })

    it('validates item structure in request', () => {
      // @ts-ignore - testing invalid price type
      const res = handleCartRequest({ 
        body: { 
          items: [
            { id: 'A', price: 'invalid' as any, quantity: 1 } // price should be number
          ] 
        } 
      })
      expect(res.status).toBe(400)
    })

    it('handles missing required fields in items', () => {
      // @ts-ignore - testing missing quantity field
      const res = handleCartRequest({ 
        body: { 
          items: [
            { id: 'A', price: 10 } as any // missing quantity
          ] 
        } 
      })
      expect(res.status).toBe(400)
    })

    it('handles non-integer quantities', () => {
      const items = [
        { id: 'A', price: 10, quantity: 1.5 }
      ]
      
      expect(() => calculateCartTotals(items)).toThrow()
    })
  })
})
