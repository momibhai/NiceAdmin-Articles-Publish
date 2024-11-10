'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push('dashboard');
    } 
  }, []);

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true

    try {
      const res = await fetch('/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      
      // Show success or error message based on the response
      if (res.status === 201) {
        // toast('', { type: 'success' });
        toast.success('You are successfully registered!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          });
        // Wait a moment to show the toast before navigating
        setTimeout(() => {
          router.push('/login');
        }, 2000); // Adjust the delay as needed
      } else {
        toast(data.message || 'Registration failed', { type: 'error' });
      }
    } catch (error) {
      console.error('Error:', error);
      toast('An error occurred during registration', { type: 'error' });
    } finally {
      setLoading(false); // Reset loading state
    }
  }

  return (
    <div>
      <div className="container">

        <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">

                <div className="d-flex justify-content-center py-4">
                  <Link href="index.html" className="logo d-flex align-items-center w-auto">
                    <img src="assets/img/logo.png" alt="" />
                    <span className="d-none d-lg-block">NiceAdmin</span>
                  </Link>
                </div>

                <div className="card mb-3">

                  <div className="card-body">

                    <div className="pt-4 pb-2">
                      <h5 className="card-title text-center pb-0 fs-4">Create an Account</h5>
                      <p className="text-center small">Enter your personal details to create account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="row g-3 needs-validation">

                      <div className="col-12">
                        <label className="form-label">Your Email</label>
                        <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" id="yourEmail" required />
                        <div className="invalid-feedback">Please enter a valid Email address!</div>
                      </div>

                      <div className="col-12">
                        <label className="form-label">Password</label>
                        <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" id="yourPassword" required />
                        <div className="invalid-feedback">Please enter your password!</div>
                      </div>

                      <div className="col-12">
                        <div className="form-check">
                          <input className="form-check-input" name="terms" type="checkbox" value="" id="acceptTerms" required />
                          <label className="form-check-label">I agree and accept the <Link href="#">terms and conditions</Link></label>
                          <div className="invalid-feedback">You must agree before submitting.</div>
                        </div>
                      </div>
                      <div className="col-12">
                        <button className="btn btn-primary w-100" type="submit" disabled={loading}>
                          {loading ? 'Creating Account...' : 'Create Account'}
                        </button>
                      </div>
                      <div className="col-12">
                        <p className="small mb-0">Already have an account? <Link href="/login">Log in</Link></p>
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
    </div>
  )
}

export default Register;
