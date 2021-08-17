export function nearestIndex(array: number[], value: number): number {
  return array.map((item, ix) => ({
    ix,
    diff: Math.abs(item - value),
  })).sort((a, b) => (
    a.diff - b.diff
  ))[0].ix;
}
