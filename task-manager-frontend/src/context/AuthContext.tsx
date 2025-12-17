/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useEffect,
} from "react";
import { useQueryClient } from "react-query";

/**
 * Represents the authenticated user
 */
export type AuthUser = {
  _id: string;
  name: string;
  email?: string;
};

/**
 * Shape of the AuthContext
 */
interface AuthContextType {
  /** Currently authenticated user or null if not logged in */
  user: AuthUser | null;

  /**
   * Log in a user
   * @param {AuthUser} user - The user object to log in
   */
  login: (user: AuthUser) => void;

  /** Log out the current user */
  logout: () => void;
}

/** Context for authentication */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Provider component to wrap the app and provide authentication state
 * 
 * @param {object} props
 * @param {ReactNode} props.children - The child components to render
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const queryClient = useQueryClient();

  // Load user from localStorage when component mounts
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  /**
   * Log in a user
   * @param {AuthUser} user - The user to log in
   */
  const login = (user: AuthUser) => {
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
  };

  /** Log out the current user */
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook to access authentication state
 * 
 * @throws Will throw an error if used outside of AuthProvider
 * @returns {AuthContextType} Authentication context with user, login, and logout
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
