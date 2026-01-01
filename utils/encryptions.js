export function reverse(str) {
  const arr = str.split('');
  arr.reverse()
  const reversedStr = arr.join('')
  return reversedStr;
}
export function atbash(text) {
  const processedText = text.toLowerCase().replace(/[^a-z0-9]/g, '');
  let result = '';

  for (let i = 0; i < processedText.length; i++) {
    const char = processedText[i];
    if (/\d/.test(char)) {
      result += char;
    } else {
      const char_code = char.charCodeAt(0);
      const reversed_code = 'a'.charCodeAt(0) + ('z'.charCodeAt(0) - char_code);
      result += String.fromCharCode(reversed_code);
    }
  }
  return result.replace(/(.{5})/g, '$1 ').trim();
}

export function randomShuffle(str) {
  const arr = str.split('')
  	for (let i = 0; i < 5000; i++) {
    	const j = Math.floor(Math.random() * (i + 1));
    	[arr[i], arr[j]] = [arr[j], arr[i]];
  	}
  	return arr.join('');
}
