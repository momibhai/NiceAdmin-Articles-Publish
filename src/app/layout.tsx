'use client';
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
// import "./../globals.css";
import Script from "next/script";
import { usePathname } from 'next/navigation'; // Use usePathname from next/navigation
import { useEffect, useState } from 'react';
import { ToastContainer} from 'react-toastify';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname(); // Use usePathname instead of useRouter
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);  // `null` initially for loading state

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);  // Set authenticated status
  }, []);

  // Show loading state while checking auth status
  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  // Check if the current route is '/register' or '/login'
  const isAuthRoute = pathname === '/register' || pathname === '/login';

  return (
    <html lang="en">
      <head>
        {/* Meta tags for responsiveness */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Favicons */}
        <link href="/assets/img/favicon.png" rel="icon" />
        <link href="/assets/img/apple-touch-icon.png" rel="apple-touch-icon" />

        {/* Google Fonts */}
        <link href="https://fonts.gstatic.com" rel="preconnect" />
        <link
          href="https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i|Nunito:300,300i,400,400i,600,600i,700,700i|Poppins:300,300i,400,400i,500,500i,600,600i,700,700i"
          rel="stylesheet"
        />

        {/* Vendor CSS Files */}
        <link href="/assets/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet" />
        <link href="/assets/vendor/bootstrap-icons/bootstrap-icons.css" rel="stylesheet" />
        <link href="/assets/vendor/boxicons/css/boxicons.min.css" rel="stylesheet" />
        <link href="/assets/vendor/quill/quill.snow.css" rel="stylesheet" />
        <link href="/assets/vendor/quill/quill.bubble.css" rel="stylesheet" />
        <link href="/assets/vendor/remixicon/remixicon.css" rel="stylesheet" />
        <link href="/assets/vendor/simple-datatables/style.css" rel="stylesheet" />

        {/* Template Main CSS File */}
        <link href="/assets/css/style.css" rel="stylesheet" />
      </head>
      <body>
        <div className="layout">
          {/* Conditionally render the Sidebar, Header, and Footer based on authentication */}
          {isAuthenticated && !isAuthRoute && <Sidebar />} {/* Show Sidebar if logged in and not on /register or /login */}
          <div className="content">
            {isAuthenticated && !isAuthRoute && <Header />} {/* Show Header if logged in and not on /register or /login */}
            <main>{children}</main>
            {isAuthenticated && !isAuthRoute && <Footer />} 
            {/* Show Footer if logged in and not on /register or /login */}
          </div>
        </div>

        <ToastContainer />

        {/* Vendor JS Files */}
        <Script src="/assets/vendor/apexcharts/apexcharts.min.js" strategy="lazyOnload" />
        <Script src="/assets/vendor/bootstrap/js/bootstrap.bundle.min.js" strategy="lazyOnload" />
        <Script src="/assets/vendor/chart.js/chart.umd.js" strategy="lazyOnload" />
        <Script src="/assets/vendor/echarts/echarts.min.js" strategy="lazyOnload" />
        <Script src="/assets/vendor/quill/quill.js" strategy="lazyOnload" />
        <Script src="/assets/vendor/simple-datatables/simple-datatables.js" strategy="lazyOnload" />
        {/* <Script src="/assets/vendor/tinymce/tinymce.min.js" strategy="lazyOnload" /> */}
        <Script src="/assets/vendor/php-email-form/validate.js" strategy="lazyOnload" />

        {/* Template Main JS File */}
        <Script src="/assets/js/main.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
