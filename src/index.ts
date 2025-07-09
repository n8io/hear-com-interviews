import { calculateCartTotals } from './calculation.ts'
import { formatCartSummary } from './utils.ts'

const items = [{ id: 'A', price: 30, quantity: 2 }]
const results = calculateCartTotals(items)
const summary = formatCartSummary(items, results)

console.log(summary)
