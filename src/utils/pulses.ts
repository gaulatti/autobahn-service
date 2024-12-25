/**
 * Prepends 'www.' to the hostname of the given URL if it does not already start with 'www.'.
 *
 * @param url - The URL to modify.
 * @returns The modified URL with 'www.' prepended to the hostname if necessary.
 */
const prependWWW = (url: string): string => {
  const urlObj = new URL(url);

  /**
   * Split the hostname into parts.
   */
  const parts = urlObj.hostname.split('.');

  /**
   * If the hostname has exactly two parts and does not start with 'www.', prepend 'www.' to the hostname.
   */
  if (parts.length === 2 && !urlObj.hostname.startsWith('www.')) {
    urlObj.hostname = 'www.' + urlObj.hostname;
  }

  return urlObj.toString();
};

export { prependWWW };
