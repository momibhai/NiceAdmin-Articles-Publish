'use client'
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation'
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const router = useRouter();

  useEffect(() => {
    const storeUserRole = localStorage.getItem("user_role");
    if (storeUserRole) {
      router.push('/dashboard');
    } else {
      router.push('/login'); // Redirect explicitly to login
    }
  }, [router]); // Add 'router' to dependency array
  

  const [email,SetEmail] = useState('');
  const [password,SetPassword] = useState('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      // Send login request to the API
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
    
      // Parse the response data
      const data = await res.json();
      console.log('Response data:', data); // Check the structure of the response
    
      if (res.ok) {
        // Check if token exists in the response
        if (data.token) {
          // Store JWT token in localStorage if login is successful
          localStorage.setItem('token', data.token);
          localStorage.setItem('userId', data.user.id);
          localStorage.setItem('user_role', data.user.user_role);
          // console.log('Stored token:', localStorage.getItem('token')); // Log stored token
        }
    
        // Check if user data exists in the response
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
          console.log('Stored user:', localStorage.getItem('user')); // Log stored user data
        }
        router.push('/dashboard')
        // Optionally redirect the user to a dashboard or home page
        toast.success('Login successfully.', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          // transition: Flip,
          });
      } else {
        // redirect('/login');
        toast.error('Invalid Email or Password.', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          // transition: Bounce,
          });
      }
    } catch (error) {
      // redirect('/login');
      toast.error('An error occurred while logging in.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        // transition: Bounce,
        });
      console.error('Error:', error);
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
                      <h5 className="card-title text-center pb-0 fs-4">Login to Your Account</h5>
                      <p className="text-center small">Enter your username & password to login</p>
                    </div>

                    <form onSubmit={handleSubmit} className="row g-3 needs-validation">

                    <div className="col-12">
                        <label className="form-label">Your Email</label>
                        <input type="email" name="email" value={email} onChange={(e)=>SetEmail(e.target.value)} className="form-control" id="yourEmail" required />
                        <div className="invalid-feedback">Please enter a valid Email adddress!</div>
                      </div>

                      <div className="col-12">
                        <label className="form-label">Password</label>
                        <input type="password" name="password" value={password} onChange={(e)=>SetPassword(e.target.value)} className="form-control" id="yourPassword" required />
                        <div className="invalid-feedback">Please enter your password!</div>
                      </div>

                      <div className="col-12">
                        <div className="form-check">
                        <Link href='forget-password'>Forget Password?</Link>
                        </div>
                      </div>
                      <div className="col-12">
                        <button className="btn btn-primary w-100" type="submit">Login</button>
                      </div>
                      <div className="col-12">
                        <p className="small mb-0">Don't have account? <Link href="/register">Create an account</Link></p>
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
  );
};

export default Login;
