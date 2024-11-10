"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateUser = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userRole, setUserRole] = useState<string | null>("");

  const router = useRouter();

  useEffect(() => {
    // get userRole from LoggedIn Storage
    async function getUserRole() {
      const storedUserRole = localStorage.getItem("user_role");
      if (storedUserRole) {
        setUserRole(storedUserRole);
      } else {
        router.back();
      }
    }
    getUserRole();
  }, [userRole, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const url = "/api/users/users";

      // Await fetch response
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }), // Send the email and password in the request body
      });

      // Check if the response is successful
      if (res.ok) {
        const data = await res.json();
        console.log("User created:", data); // Successfully created user
        toast.success('User created successfully!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          });
        setEmail("");
        setPassword("");
      } else {
        const errorData = await res.json();
        console.error("Failed to create user:", errorData);
        // toast(errorData.error || "Failed to create user");
        toast.error(errorData.error, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          });
      }
    } catch (error) {
      console.error("Error:", error); // Log any caught error
      toast("An unexpected error occurred. Please try again.");
    }
  }

  return (
    <main id="main" className="main">
      <div className="card">
        <div className="card-body">
          {userRole === "admin" ? (
            <div>
              <div className="d-flex justify-content-end mt-2">
                <button
                  onClick={() => router.push("users")}
                  className="btn btn-primary"
                >
                  User List
                </button>
              </div>
              <h5 className="card-title">User Form</h5>

              <div className="row mb-3">
                <label className="col-sm-2 col-form-label">Email</label>
                <div className="col-sm-10">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control"
                    id="inputEmail"
                  />
                </div>
              </div>
              <div className="row mb-3">
                <label className="col-sm-2 col-form-label">Password</label>
                <div className="col-sm-10">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-control"
                    id="inputPassword"
                  />
                </div>
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="btn btn-primary"
                >
                  Submit
                </button>
                <button type="reset" className="btn btn-secondary">
                  Reset
                </button>
              </div>
            </div>
          ) : userRole === "viewer" ? (
            <div>
            <div className="d-flex justify-content-end mt-2">
            <button
              onClick={() => router.push("users")}
              className="btn btn-primary"
            >
              User List
            </button>
          </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "50vh",
              }}
            >
              
              <h4 className="text-center">You are a viewer</h4>
            </div>
            </div>
          ) : userRole === "editor" ? (
            <div>
            <div className="d-flex justify-content-end mt-2">
            <button
              onClick={() => router.push("users")}
              className="btn btn-primary"
            >
              User List
            </button>
          </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "50vh",
              }}
            >
              
              <h4 className="text-center">You are an editor</h4>
            </div>
            </div>
          ) : (
            <p>Unknown role</p>
          )}
        </div>
      </div>
    </main>
  );
};

export default CreateUser;
