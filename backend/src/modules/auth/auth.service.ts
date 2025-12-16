import { User } from "../users/user.model";
import { signToken } from "../../utils/jwt";
import { HttpError } from "../../utils/httpError";

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
    password
  });

  const token = signToken({ userId: user._id });

  return { user, token };
}

export async function loginUser(email: string, password: string) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new HttpError(401, "Invalid email or password");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new HttpError(401, "Invalid email or password");
  }

  const token = signToken({ userId: user._id });

  return { user, token };
}
