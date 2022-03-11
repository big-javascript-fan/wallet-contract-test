export const multilineText = (str, maxLen = 70, lines = 2, lineBreak = '<br />') => {
  let result = '';
  // replace [http....] to space
  let shorten = str.replace(/[\u2020\u00A0]|[\u200c]/g, ' ');
  // replace special chars to space
  shorten = shorten.replace(/\[http[^\]]*\]/gm, ' ');
  // replace line break, tab, multiple spaces to space
  shorten = shorten.replace(/\s\s+/g, ' ');

  for (let i = 0; i < lines; i += 1) {
    if (shorten.length <= maxLen) {
      result += shorten;
      return result;
    }
    const sub = shorten.substr(0, shorten.lastIndexOf(' ', maxLen));
    result += sub;
    if (i < lines - 1) {
      result += lineBreak;
    }
    shorten = shorten.slice(sub.length + 1);
  }
  result += ' ...';
  return result;
};
