const PLACEHOLDER_SECRETS = new Set([
  "replace-with-a-long-random-secret",
  "development-secret-change-me",
  "change-me",
]);

function requireJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32 || PLACEHOLDER_SECRETS.has(secret)) {
    throw new Error("JWT_SECRET must be set to a strong, unique value of at least 32 characters");
  }
  return secret;
}

function cookieOptions() {
  const secure = process.env.NODE_ENV === "production"
    ? process.env.COOKIE_SECURE !== "false"
    : process.env.COOKIE_SECURE === "true";
  const sameSite = process.env.COOKIE_SAME_SITE || "lax";
  return { httpOnly: true, secure, sameSite };
}

module.exports = { requireJwtSecret, cookieOptions };
