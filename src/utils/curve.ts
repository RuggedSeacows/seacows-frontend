export function calculateLinearPoints(base: number, delta: number, numPoints: number) {
  // delta: amount
  const points = [];
  let y = base;
  for (let x = 1; x <= numPoints; x += 1) {
    y += delta;
    points.push([x, y]);
  }
  return points;
}

export function calculateExponentialPoints(base: number, delta: number, numPoints: number) {
  // delta: percentage
  const points = [];
  let y = base;
  for (let x = 1; x <= numPoints; x += 1) {
    y += (y * delta) / 100;
    points.push([x, y]);
  }
  return points;
}

// TODO: CPMM logic
export function calculateCPMMPoints(base: number, fee: number, numPoints: number) {
  // delta: percentage
  const points = [];
  let y = base;
  for (let x = 1; x <= numPoints; x += 1) {
    y += (y * fee) / 100;
    points.push([x, y]);
  }
  return points;
}
