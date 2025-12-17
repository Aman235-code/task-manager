import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./components/Profile";

/**
 * Main application component.
 *
 * Sets up the overall layout, navigation bar, and routing.
 * Protected routes require authentication and use `ProtectedRoute`.
 */
function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Navigation bar */}
      <Navbar />

      {/* Main content container */}
      <main className="mx-auto max-w-7xl px-4 mt-4 py-6 space-y-8 bg-gray-900 rounded-lg shadow-md">
        <Routes>
          {/* Dashboard: protected route */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Profile: protected route */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
