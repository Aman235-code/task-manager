import { User } from "../users/user.model";
import { signToken } from "../../utils/jwt";
import { HttpError } from "../../utils/httpError";

/**
 * Registers a new user in the system.
 *
 * Checks for an existing user with the same email.
 * If none exists, creates a new user, generates a JWT,
 * and returns both the user and token.
 *
 * @param name - Full name of the user
 * @param email - Email address of the user
 * @param password - Password for the user account
 *
 * @returns Object containing the created user and JWT token
 *
 * @throws HttpError 409 if a user with the same email already exists
 */
export async function registerUser(
  name: string,
  email: string,
  password: string
) {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new HttpError(409, "User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  const token = signToken({ userId: user._id });

  return { user, token };
}

/**
 * Authenticates an existing user.
 *
 * Verifies the email exists and the password matches.
 * If valid, generates a JWT and returns the user and token.
 *
 * @param email - User's email address
 * @param password - User's password
 *
 * @returns Object containing the authenticated user and JWT token
 *
 * @throws HttpError 401 if email does not exist or password is incorrect
 */
export async function loginUser(email: string, password: string) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new HttpError(401, "Invalid credentials");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new HttpError(401, "Invalid credentials");
  }

  const token = signToken({ userId: user._id });

  return { user, token };
}
