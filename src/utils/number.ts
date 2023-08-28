import { BigNumber } from 'ethers';
import { formatEther } from 'ethers/lib/utils';
import { Nullable } from './types';

export function randomInRange(x: number, y: number) {
  return Math.floor(Math.random() * (y - x + 1)) + x;
}

export function formatNumber(num: number | string, fixed = 4) {
  const numObj = Number(num);
  if (numObj === 0) return '0';

  if (Number.isNaN(numObj)) {
    return 'NaN';
  }

  const roundedNumber = numObj.toFixed(fixed);
  const trimmedNumber = parseFloat(roundedNumber).toString();

  if (Number(trimmedNumber) < 0.1 ** fixed) {
    return `< 0.${Array(fixed - 1)
      .fill('0')
      .join('')}1`;
  }

  return trimmedNumber;
}

export function formatBigNumber(bigNum?: Nullable<BigNumber>, decimals = 18, fixed = 4) {
  if (bigNum) {
    // TODO: Handle decimals for different token type
    return formatNumber(formatEther(bigNum).toString(), fixed);
  }

  return null;
}
