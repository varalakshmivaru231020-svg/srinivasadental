/** Minimal Cookie header parser (avoids an extra dependency). */
function parseCookies(header = '') {
  return header.split(';').reduce((acc, part) => {
    const i = part.indexOf('=');
    if (i < 0) return acc;
    const key = part.slice(0, i).trim();
    if (!key) return acc;
    try {
      acc[key] = decodeURIComponent(part.slice(i + 1).trim());
    } catch {
      acc[key] = part.slice(i + 1).trim();
    }
    return acc;
  }, {});
}

module.exports = { parseCookies };
