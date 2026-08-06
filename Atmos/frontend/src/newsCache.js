// Lightweight sessionStorage cache for /api/news calls.
//
// NewsAPI's free tier caps at 100 requests/day. Between React 19 StrictMode
// double-invoking effects in dev, FeaturedNews firing 6 category calls per
// mount, and re-toggling the country pill while testing, that quota
// disappears fast. This cache means the same (country, category, page)
// combo is only ever fetched once per TTL window, no matter how many times
// a component remounts or re-renders.

const TTL_MS = 10 * 60 * 1000; // 10 minutes

export async function cachedFetchJson(url) {
  const cacheKey = `newscache:${url}`;

  try {
    const raw = sessionStorage.getItem(cacheKey);
    if (raw) {
      const { timestamp, data } = JSON.parse(raw);
      if (Date.now() - timestamp < TTL_MS) {
        return { data, fromCache: true };
      }
    }
  } catch {
    // sessionStorage unavailable or corrupted entry — fall through to fetch
  }

  const response = await fetch(url);

  if (response.status === 429) {
    // Don't cache failures — surface the 429 to the caller so it can retry/backoff.
    const err = new Error("Rate limited");
    err.status = 429;
    throw err;
  }

  if (!response.ok) {
    const err = new Error(`Request failed with status ${response.status}`);
    err.status = response.status;
    throw err;
  }

  const data = await response.json();

  try {
    sessionStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data }));
  } catch {
    // Storage full or unavailable — non-fatal, just means no caching this time.
  }

  return { data, fromCache: false };
}
