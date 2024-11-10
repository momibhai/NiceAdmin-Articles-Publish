// hooks/useAuth.ts
import { useState, useEffect } from "react";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("user_role");

    setIsAuthenticated(!!token);
    setUserRole(role || null);
  }, []);

  return { isAuthenticated, userRole };
}
