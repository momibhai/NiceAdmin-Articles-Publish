// pages/dashboard.tsx
"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "../../../../hooks/useAuth";

const Dashboard = () => {
  const router = useRouter();
  const { isAuthenticated, userRole } = useAuth();

  useEffect(() => {
    if (isAuthenticated === false) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated === null) return <div>Loading...</div>;
  if (!userRole) return null;

  return (
    <main id="main" className="main">
      <div className="pagetitle">
        <h1>{userRole.charAt(0).toUpperCase() + userRole.slice(1)} Dashboard</h1>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link href="/dashboard">Home</Link>
            </li>
            <li className="breadcrumb-item active">Dashboard</li>
          </ol>
        </nav>
        <h1>Welcome to {userRole.charAt(0).toUpperCase() + userRole.slice(1)} Dashboard</h1>
      </div>
    </main>
  );
};

export default Dashboard;
