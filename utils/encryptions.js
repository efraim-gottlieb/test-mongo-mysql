export function reverse(str) {
  const arr = str.split('');
  arr.reverse()
  const reversedStr = arr.join('')
  return reversedStr;
}
