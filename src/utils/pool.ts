import { calculateDiffDays } from './time';

export function calculateAPR(totalFee: number, totalValueLocked: number, startDate: Date) {
  const operationPeriodDays = calculateDiffDays(startDate);

  if (!totalValueLocked || !operationPeriodDays) {
    return 0;
  }

  return ((totalFee * 1.0) / totalValueLocked) * (365 / operationPeriodDays) * 100;
}
