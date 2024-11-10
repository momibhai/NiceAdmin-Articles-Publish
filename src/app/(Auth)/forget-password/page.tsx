'use client';

import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ForgotPassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();
      if (result.success) {
        toast.success("OTP sent to your email!");
        router.push("/otp-password-reset"); // Redirect to OTP verification page
      } else {
        toast.error(result.message || "Failed to send OTP.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="container">
      <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
              <div className="d-flex justify-content-center py-4">
                <Link href="/" className="logo d-flex align-items-center w-auto">
                  <img src="assets/img/logo.png" alt="" />
                  <span className="d-none d-lg-block">NiceAdmin</span>
                </Link>
              </div>
              <div className="card mb-3">
                <div className="card-body">
                  <div className="pt-4 pb-2">
                    <h5 className="card-title text-center pb-0 fs-4">Reset Your Account</h5>
                    <p className="text-center small">Enter Your Email to Receive an OTP</p>
                  </div>
                  <form onSubmit={handleSubmit} className="row g-3 needs-validation">
                    <div className="col-12">
                      <label className="form-label">Your Email</label>
                      <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-control"
                        id="yourEmail"
                        required
                      />
                      <div className="invalid-feedback">Please enter a valid Email address!</div>
                    </div>
                    <div className="col-12">
                      <button className="btn btn-primary w-100" type="submit">
                        Send Email
                      </button>
                    </div>
                    <div className="col-12">
                      <p className="small mb-0">
                        <Link href="/login">Back to Login</Link>
                      </p>
                    </div>
                  </form>
                </div>
              </div>
              <div className="credits">
                Designed by <Link href="https://bootstrapmade.com/">BootstrapMade</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ForgotPassword;
