"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Define the User interface
interface User {
  id: number | null; // id can be null initially when no user is selected
  email: string;
  password: string;
  user_role: string; // Assuming user_role is part of the user data
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  // State to store selected roles by user ID
  const [selectedRoles, setSelectedRoles] = useState<{ [key: number]: string }>({});
  const [userRole, setUserRole] = useState<string | null>("");
  const router = useRouter();

  // Fetch users data on component mount
  useEffect(() => {
    // get userRole from LocalStorage
    async function getUserRole() {
      const storedUserRole = localStorage.getItem("user_role");
      if (storedUserRole) {
        setUserRole(storedUserRole);
      } else {
        router.back();
      }
    }

    async function fetchUsersData() {
      try {
        const res = await fetch("/api/users/users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();
        if (Array.isArray(data.data)) {
          setUsers(data.data);
        } else {
          console.error("Error: Data fetched is not an array");
        }
      } catch (error) {
        console.log(error);
      }
    }

    getUserRole();
    fetchUsersData();
  }, [router]);

  // Handle select change for each user
  const handleSelectChange = (userId: number, role: string) => {
    setSelectedRoles((prevRoles) => ({
      ...prevRoles,
      [userId]: role, // Update the role for the specific user
    }));
  };

  // Handle form submission (Save changes)
  const handlePermission = async (id: number, newRole: string | undefined) => {
    if (!newRole) {
      toast("Please select a role before updating.");
      return;
    }

    const url = `/api/users/${id}`;
    try {
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_role: newRole }), // Pass the new role here
      });

      if (response.ok) {
        toast.success('User permission updated successfully', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          });
      } else {
        throw new Error("Failed to update user");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main id="main" className="main">
      {userRole ? (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">User Records</h5>
            <div className="d-flex justify-content-end">
              <button
                onClick={() => router.push("create-user")}
                className="btn btn-primary"
              >
                Create New User
              </button>
            </div>

            {/* Table displaying users */}
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">S.no</th>
                  <th scope="col">User Email</th>
                  <th scope="col">Current Permission</th>
                  <th scope="col">Select Permission</th>
                </tr>
              </thead>
              <tbody>
                {users && users.length > 0 ? (
                  users.map((user:any, index) => (
                    <tr key={user.id}>
                      <th scope="row">{index + 1}</th>
                      <td>{user.email}</td>
                      <td>
                        {user.user_role === "admin" ? (
                          <span className="badge bg-primary">Admin</span>
                        ) : user.user_role === "viewer" ? (
                          <span className="badge bg-danger">Viewer</span>
                        ) : (
                          <span className="badge bg-info">Editor</span>
                        )}
                      </td>
                      <td>
                        {userRole === "admin" ? (
                          <div className="d-flex align-items-center mb-3">
                            <div className="me-3 col-md-4">
                              <select
                                className="form-select"
                                id={`permissionSelect-${user.id}`}
                                name="Select Permission"
                                value={selectedRoles[user.id] || ""} // Use state specific to each user
                                onChange={(e) =>
                                  handleSelectChange(user.id, e.target.value)
                                }
                              >
                                <option value="">Select</option>
                                <option value="admin">Admin</option>
                                <option value="editor">Editor</option>
                                <option value="viewer">Viewer</option>
                              </select>
                            </div>

                            <button
                              onClick={() =>
                                handlePermission(user.id, selectedRoles[user.id])
                              }
                              type="button"
                              className="btn btn-primary"
                            >
                              Update Permission
                            </button>
                          </div>
                        ) : (
                          <p>You don't have access to update this user.</p>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </main>
  );
};

export default Users;
