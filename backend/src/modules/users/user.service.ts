import { User } from "./user.model";

/**
 * Updates the name of a user by their ID.
 *
 * @param userId - The ID of the user to update
 * @param name - The new name for the user
 * @returns The updated user document containing `_id`, `name`, and `email`
 * @throws Error if the user is not found
 */
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
