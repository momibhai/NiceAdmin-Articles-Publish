// app/auth/layout.tsx
"use client";
import Footer from "../../../components/Footer";
import Header from "../../../components/Header";
import Sidebar from "../../../components/Sidebar";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { ToastContainer } from "react-toastify";
import { useAuth } from "../../../hooks/useAuth";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();

  const isAuthRoute = pathname === "/register" || pathname === "/login";

  // Show loading indicator until authentication is determined
  if (isAuthenticated === null) return <div>Loading...</div>;

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="/assets/img/favicon.png" rel="icon" />
        <link href="/assets/css/style.css" rel="stylesheet" />
      </head>
      <body>
        <div className="layout">
          {isAuthenticated && !isAuthRoute && <Sidebar />}
          <div className="content">
            {isAuthenticated && !isAuthRoute && <Header />}
            <main>{children}</main>
            {isAuthenticated && !isAuthRoute && <Footer />}
          </div>
        </div>

        <ToastContainer />
        <Script src="/assets/vendor/bootstrap/js/bootstrap.bundle.min.js" strategy="lazyOnload" />
        <Script src="/assets/js/main.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
