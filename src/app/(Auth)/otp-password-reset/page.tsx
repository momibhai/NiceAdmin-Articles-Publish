'use client';

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const ResetPassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleResetPassword = async (e:any) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const result = await response.json();
      if (result.success) {
        toast.success(result.message);
        router.push('/login');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <div className="container">
      <section className="section reset min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
              <div className="card mb-3">
                <div className="card-body">
                  <div className="pt-4 pb-2">
                    <h5 className="card-title text-center pb-0 fs-4">Reset Your Password</h5>
                    <p className="text-center small">Enter your email, OTP, and new password</p>
                  </div>
                  <form onSubmit={handleResetPassword} className="row g-3 needs-validation">
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
                      <label className="form-label">OTP</label>
                      <input
                        type="text"
                        name="otp"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="form-control"
                        id="otp"
                        required
                      />
                      <div className="invalid-feedback">Please enter the OTP sent to your email!</div>
                    </div>
                    <div className="col-12">
                      <label className="form-label">New Password</label>
                      <input
                        type="password"
                        name="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="form-control"
                        id="newPassword"
                        required
                      />
                      <div className="invalid-feedback">Please enter a new password!</div>
                    </div>
                    <div className="col-12">
                      <button className="btn btn-primary w-100" type="submit">
                        Reset Password
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

export default ResetPassword;
