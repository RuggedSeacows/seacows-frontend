import TimeAgo from 'javascript-time-ago';

// English.
import en from 'javascript-time-ago/locale/en';

TimeAgo.addDefaultLocale(en);

// Create formatter (English).
export const timeAgo = new TimeAgo('en-US');

export function calculateDiffDays(startDate: Date, endDate = new Date()) {
  // The number of milliseconds in one day
  const ONE_DAY = 1000 * 60 * 60 * 24;

  // Calculate the difference in milliseconds
  const differenceMs = Math.abs(endDate.getTime() - startDate.getTime());

  // Convert back to days and return
  return Math.round(differenceMs / ONE_DAY);
}
