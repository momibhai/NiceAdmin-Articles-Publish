"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface User {
  id: number | null;
  email: string;
  password: string;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User>({
    id: null,
    email: '',
    password: '',
  });
  
  const [userRole, setUserRole] = useState<string | null>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const router = useRouter();

  useEffect(() => {
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
        const res = await fetch(`/api/users/users?page=${page}&limit=5`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();
        if (Array.isArray(data.data)) {
          setUsers(data.data);
          setTotalPages(data.totalPages); // Set the total pages from the response
        } else {
          console.error('Error: Data fetched is not an array');
        }
      } catch (error) {
        console.log(error);
      }
    }

    getUserRole();
    fetchUsersData();
  }, [page]); // Add 'page' as a dependency so it fetches new data on page change

  const handleDelete = async (id: any) => {
    const url = `/api/users/${id}`;
    try {
      const response = await fetch(url, {
        method: 'DELETE',
      });
      if (response.ok) {
        setUsers(users.filter(user => user.id !== id));
        toast.success('User Deleted Successfully', {
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
        toast("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast("Error occurred while deleting the user");
    }
  };

  const handleEdit = (user: any) => {
    setSelectedUser({ ...user });
  };

  const handleSaveChanges = async () => {
    if (selectedUser.password === '') {
      toast('Password cannot be empty');
      return;
    }
    
    const url = `/api/users/${selectedUser.id}`;
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedUser),
      });
      if (response.ok) {
        toast('User updated successfully');
        setSelectedUser({ id: null, email: '', password: '' });
        const updatedUsers = users.map((user) =>
          user.id === selectedUser.id ? selectedUser : user
        );
        setUsers(updatedUsers);
      } else {
        throw new Error('Failed to update user');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setSelectedUser((prev) => ({ ...prev, [name]: value }));
  };

  // Handle page change for pagination
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <main id="main" className="main">
     {
      userRole ?  (
      <div className="card">
      <div className="card-body">
        <h5 className="card-title">User Records</h5>
        <div className="d-flex justify-content-end">
          <button onClick={() => router.push('create-user')} className="btn btn-primary">Create New User</button>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th scope="col">S.no</th>
              <th scope="col">User Email</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {users && users.length > 0 ? (
              users.map((user: any, index) => (
                <tr key={user.id}>
                  <th scope="row">{index + 1}</th>
                  <td>{user.email}</td>
                  <td>
                   {
                     userRole === 'admin' ? (
                    <div>
                    <button
                    onClick={() => handleEdit(user)}
                    type="button"
                    className="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#editUserModal"
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </button>
                   </div>
                   ) : userRole === 'editor' ? (
                    <div>
                    <button
                    onClick={() => handleEdit(user)}
                    type="button"
                    className="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#editUserModal"
                  >
                    Edit
                  </button>
                   </div>
                    ) : <p>You Don't have Access</p>
                   }
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination controls */}
        <div className="d-flex justify-content-center">
          <button
            className="btn btn-secondary me-2"
            disabled={page === 1}
            onClick={() => handlePageChange(page - 1)}
          >
            Previous
          </button>
          <span className="align-self-center">Page {page} of {totalPages}</span>
          <button
            className="btn btn-secondary ms-2"
            disabled={page === totalPages}
            onClick={() => handlePageChange(page + 1)}
          >
            Next
          </button>
        </div>

        {/* Modal for editing user */}
        {selectedUser.id && (
        <div
          className="modal fade"
          id="editUserModal"
          tabIndex={-1}
          aria-labelledby="editUserModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="editUserModalLabel">
                  Edit User
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={selectedUser.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="text"
                    className="form-control"
                    name="password"
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSaveChanges}
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
    </div> 
    ) : null
     }
    </main>
  );
};

export default Users;
