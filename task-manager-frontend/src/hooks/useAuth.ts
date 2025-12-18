import { useState } from "react";

/**
 * Represents the authenticated user
 */
export type AuthUser = {
  id: string;
  name: string;
  email?: string;
};

/**
 * Custom hook to manage authentication state
 * 
 * Provides a simple user object and login/logout functions.
 * Designed for client-side state management; does not handle tokens or persistence.
 * 
 * @returns {object} An object containing:
 *  - `user`: The currently logged-in user or `null` if not logged in
 *  - `login`: Function to set the authenticated user
 *  - `logout`: Function to clear the authenticated user
 */
export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);

  /**
   * Log in a user by setting the `user` state
   * @param {AuthUser} user - The user to log in
   */
  const login = (user: AuthUser) => setUser(user);

  /**
   * Log out the current user by clearing the `user` state
   */
  const logout = () => setUser(null);

  return { user, login, logout };
}
