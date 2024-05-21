import numeral from 'numeral';

// ----------------------------------------------------------------------

export function fCurrency(number) {
  return numeral(number).format(Number.isInteger(number) ? '$0,0' : '$0,0.00');
}

export function fVietNamCurrency(number) {
  return numeral(number).format(Number.isInteger(number) ? '0,0' : '0,0');
}

export function fPercent(number) {
  return numeral(number / 100).format('0.0%');
}

export function fNumber(number) {
  return numeral(number).format();
}

export function fShortenNumber(number) {
  return numeral(number).format('0.00a').replace('.00', '');
}

export function fData(number) {
  return numeral(number).format('0.0 b');
}

export function convertStringToNumber(str) {
  if (typeof str === 'string') {
    const newValue = str.replace(/,/g, '');
    const parsedValue = parseInt(newValue, 10);

    return Number.isNaN(parsedValue) ? 0 : parsedValue;
  }

  if (typeof str === 'number') {
    return str;
  }

  return 0;
}
