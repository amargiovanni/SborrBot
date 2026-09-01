// Test stub for the astro:middleware virtual module. Astro's real
// defineMiddleware is an identity function used for typing only.
export function defineMiddleware<T>(fn: T): T {
  return fn;
}
