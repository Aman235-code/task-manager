import jwt from "jsonwebtoken";

/**
 * Secret key used to sign and verify JWTs.
 *
 * Must be provided via environment variables in production.
 * The fallback value is intended only for non-production setups.
 */
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

/**
 * Token expiration duration.
 *
 * Controls how long issued tokens remain valid.
 */
const JWT_EXPIRES_IN = "7d";

/**
 * Signs a JSON Web Token using the configured secret.
 *
 * Used during authentication flows to generate
 * access tokens for authenticated users.
 *
 * @param payload - Data to embed inside the token (user id, roles, etc.)
 * @returns A signed JWT string
 */
export function signToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

/**
 * Verifies and decodes a JSON Web Token.
 *
 * This function validates the token signature and expiration.
 * It throws an error if the token is invalid or expired.
 *
 * Typically used in authentication middleware.
 *
 * @param token - JWT string received from the client
 * @returns The decoded token payload if verification succeeds
 */
export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}
