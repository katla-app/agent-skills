/**
 * Shared plumbing for the two scripts that act on an already-published report.
 *
 * Both need the same three things: the uid out of whatever the caller pasted, the key out of a
 * flag or the environment, and a refusal that reads like a sentence instead of a status code.
 */

export const API = (process.env.KATLA_API_URL || 'https://api.katla.app').replace(/\/+$/, '');

export function die(script, msg) {
  console.error(`${script}: ${msg}`);
  process.exit(1);
}

/**
 * The uid, from a uid or from any URL containing one.
 *
 * People paste the link, because the link is the thing they were given. Asking them to slice
 * the last path segment off it themselves is a needless way to fail.
 */
export function toUid(value) {
  const trimmed = String(value || '').trim().replace(/\.json$/i, '');
  const direct = trimmed.match(/^[A-Za-z0-9_-]{16,32}$/);
  if (direct) return trimmed;
  const inUrl = trimmed.match(/\/reports\/([A-Za-z0-9_-]{16,32})/);
  return inUrl ? inUrl[1] : null;
}

/**
 * Turns a failed response into something a person can act on.
 *
 * 404 covers both a report that is gone and a key that does not open it — the server will not
 * say which, deliberately, since answering would make it an oracle for which uids exist. The
 * message says both so the caller checks both.
 */
export async function explain(response) {
  if (response.status === 401) return 'no edit key given — pass --key, or set KATLA_REPORT_KEY';
  if (response.status === 404) {
    return 'no live report under that id with that key — it may have expired, been retracted, or the key is wrong';
  }
  if (response.status === 429) return 'rate limited — try again in an hour';
  if (response.status === 413) return 'findings.json is too large (the limit is 256 KB)';
  try {
    const body = await response.json();
    if (body?.error) return body.error;
  } catch {
    /* fall through to the status */
  }
  return `HTTP ${response.status}`;
}

/** The key from `--key`, else the environment. Callers pass what they parsed off argv. */
export const keyFrom = (flag) => flag || process.env.KATLA_REPORT_KEY || null;
