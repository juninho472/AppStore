import { Suspense, useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";
import LoginForm from "./components/auth/LoginForm";
import AdminDashboard from "./components/admin/AdminDashboard";
import routes from "tempo-routes";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true",
  );

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const isAuth = !!session;
      setIsAuthenticated(isAuth);
      localStorage.setItem("isAuthenticated", isAuth.toString());
    };
    checkAuth();
  }, []);

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  // Get the tempo routes
  const tempoRoutes =
    import.meta.env.VITE_TEMPO === "true" ? useRoutes(routes) : null;

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <p className="text-[#1B365D] font-serif text-xl">Loading...</p>
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        {/* Add a catch-all route that redirects to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {tempoRoutes}
    </Suspense>
  );
}

export default App;
