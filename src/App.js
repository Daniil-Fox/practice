import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useSearchParams,
} from "react-router-dom";
import AuthModal from "./components/AuthModal";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import TestsPage from "./pages/TestsPage";
import TestPage from "./pages/TestPage";
import HomePage from "./pages/HomePage";

const AppContent = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role");

  const handleAuth = (userData) => {
    setIsAuthenticated(true);
    setUserRole(userData.role);
    setShowAuthModal(false);
  };

  const handleLoginClick = () => {
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {!isAuthenticated && (
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/login"
            element={
              <>
                <HomePage />
                <AuthModal
                  isOpen={showAuthModal || Boolean(role)}
                  onClose={() => {
                    setShowAuthModal(false);
                    window.history.pushState({}, "", "/");
                  }}
                  onAuth={handleAuth}
                />
              </>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}

      {isAuthenticated && (
        <Routes>
          <Route
            path="/"
            element={
              userRole === "admin" ? <AdminDashboard /> : <EmployeeDashboard />
            }
          />
          <Route path="/tests" element={<TestsPage />} />
          <Route path="/test/:testId" element={<TestPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
