"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from "next/image";

const ViewArticles = () => {
  const [userId, setUserId] = useState("");
  const [articles, setArticles] = useState([]);
  const [userRole, setUserRole] = useState<string | null>("");

  const router = useRouter();


  useEffect(() => {
    function getUserId(): void {
      const getLoginUserId = localStorage.getItem("userId");
      if (getLoginUserId) {
        setUserId(getLoginUserId);
      } else {
        setUserId("");
      }
    }
    // get userRole from LoggedIn Storage
    async function getUserRole() {
      const storedUserRole = localStorage.getItem("user_role");
      if (storedUserRole) {
        setUserRole(storedUserRole);
      } else {
        router.back();
      }
    }

    async function getArticles() {
      try {
        const res = await fetch("/api/articles/view-articles", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();
        // console.log(data.data);
        setArticles(data.data);
      } catch (error) {
        console.log(error);
      }
    }

    getUserId();
    getUserRole();
    getArticles();
  });

  async function handleDelete(articleId: number) {
    try {
      const res = await fetch("/api/articles/delete-articles", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: articleId }),
      });
      const data = await res.json();
      if (data.status) {
        toast.success('Article deleted successfully', {
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
        toast.error(data.error);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <main id="main" className="main">
      {userId && (
        <div className="container mt-5">
          <h3 className="mb-4">Articles</h3>
          <div className="row mt-3">
  <div className="d-flex justify-content-end ml-auto mb-3">
    <button
      onClick={() => router.push("create-articles")}
      className="btn btn-primary w-10 w-md-auto"
      style={{ marginTop: "-20px" }}
    >
      Create An Article
    </button>
  </div>
</div>


          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th scope="col">S.No</th>
                <th scope="col">Title</th>
                <th scope="col">Content</th>
                <th scope="col">Image</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article: any, index) => (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>{article.title}</td>
                  <td>{article.content}</td>
                  <td>
                    <a target="_blank" href={article.image}>
                    <Image width={40} height={40} src={article.image} alt="Profile" className="rounded-circle" />
                    </a>
                  </td>
                  <td>
                    {
                      userRole === "admin"  ?
                    <div>
                      <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(article.id)}
                    >
                      Delete
                    </button>
                    </div>
                       : <p>You don't have Permission</p>
                    }
                    
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
};

export default ViewArticles;
