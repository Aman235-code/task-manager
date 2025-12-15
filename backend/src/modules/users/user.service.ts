import { User } from "./user.model";

export async function updateUserName(userId: string, name: string) {
  const user = await User.findByIdAndUpdate(
    userId,
    { name },
    { new: true }
  ).select("_id name email");

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}
