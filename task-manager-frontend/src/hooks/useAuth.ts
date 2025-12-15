import { useState } from "react";

export type AuthUser = {
  _id?: string;
  name: string;
  email?: string;
};

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = (user: AuthUser) => setUser(user);
  const logout = () => setUser(null);

  return { user, login, logout };
}
