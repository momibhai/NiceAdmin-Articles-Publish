"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateArticles = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [userId, setUserId] = useState<string | number | null>(null);
  const [userRole, setUserRole] = useState<string | null>("");
  const router = useRouter();

  useEffect(() => {
    // Get userId from localStorage
    function getUserId() {
      const storedUserId = localStorage.getItem("userId");
      if (storedUserId) {
        const numericUserId = Number(storedUserId);
        if (!isNaN(numericUserId)) {
          setUserId(numericUserId);
        } else {
          console.error("Invalid userId in localStorage");
        }
      } else {
        console.error("User ID not found in localStorage");
      }
    }

    // Get userRole from localStorage
    function getUserRole() {
      const storedUserRole = localStorage.getItem("user_role");
      if (storedUserRole) {
        setUserRole(storedUserRole);
      } else {
        router.back();
      }
    }

    getUserId();
    getUserRole();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageFile) {
      toast("Please upload an image.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("image", imageFile);
    formData.append("userId", userId ? String(userId) : "");

    // Debug: Log formData before submitting
    // for (const [key, value] of formData.entries()) {
    //   console.log(`${key}: ${value}`);
    // }

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log(data)
      if (res.ok) {
        setTitle("");
        setContent("");
        setImageFile(null);
        toast.success('Article submitted successfully.', {
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
        toast(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Failed to submit article:", error);
      toast("Something went wrong. Please try again.");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  return (
    <main id="main" className="main">
      {/* {userId} */}
      {userId && userRole === "admin" ? (
        <section className="section">
          <div className="row">
            <div className="row mt-3">
              <div className="d-flex justify-content-end ml-auto mb-3">
                <button
                  onClick={() => router.push("view-articles")}
                  className="btn btn-primary w-10 w-md-auto"
                  style={{ marginTop: "-20px" }}
                >
                  Create An Article
                </button>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Publish An Article</h5>
                  <form method="POST" encType="multipart/form-data" onSubmit={handleSubmit}>
                    <div className="row mb-3">
                      <label className="col-sm-2 col-form-label">Title</label>
                      <div className="col-sm-10">
                        <input
                          type="text"
                          className="form-control"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="row mb-3">
                      <label className="col-sm-2 col-form-label">Content</label>
                      <div className="col-sm-10">
                        <textarea
                          className="form-control"
                          style={{ height: "100px" }}
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          required
                        ></textarea>
                      </div>
                    </div>
                    <div className="row mb-3">
                      <label className="col-sm-2 col-form-label">File Upload</label>
                      <div className="col-sm-10">
                        <input
                          className="form-control"
                          type="file"
                          onChange={handleImageChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-sm-10 offset-sm-2">
                        <button type="submit" className="btn btn-primary">
                          Submit Form
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <div>
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
      )}
    </main>
  );
};

export default CreateArticles;
