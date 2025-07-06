import { calculateCartTotals, formatCartSummary } from "./calculation.ts";

const results = calculateCartTotals([{ id: "A", price: 30, quantity: 2 }])

const summary = formatCartSummary(
  [{ id: "A", price: 30, quantity: 2 }],
  results,
)

console.log(summary);