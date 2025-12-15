import { User } from "../users/user.model";
import { signToken } from "../../utils/jwt";

export async function registerUser(
  name: string,
  email: string,
  password: string
) {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
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
    throw new Error("Invalid credentials");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = signToken({ userId: user._id });

  return { user, token };
}
