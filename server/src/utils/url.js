export function isValidHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function normalizeUrl(value) {
  const url = new URL(value);
  url.hash = '';
  return url.toString();
}

export function isInternalLink(baseUrl, href) {
  try {
    const base = new URL(baseUrl);
    const target = new URL(href, baseUrl);
    return base.hostname === target.hostname;
  } catch {
    return false;
  }
}
