import React, { useState } from "react";
import { Navigate } from "react-router-dom";

function CreateBlogs() {
  let user = JSON.parse(localStorage.getItem("user"));

  const [blogData, setBlogData] = useState({
    title: "",
    description: "",
  });
  async function handleSubmit() {
    let data = await fetch("http://localhost:3000/api/v1/blogs", {
      method: "POST",
      body: JSON.stringify(blogData),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });
    let res = await data.json();
    // if (res.success) {
    //   localStorage.setItem("user", JSON.stringify(res.user));
    // }

    alert(res.message);
  }
  if (!user) {
    return <Navigate to={"/signup"} />;
  }
  return (
    <div>
      <h1>Create blog</h1>
      <div>
        <input
          onChange={(e) =>
            setBlogData((prev) => ({ ...prev, title: e.target.value }))
          }
          type="text "
          placeholder="title"
          name=""
          id=""
        />
        <br />
        <br />
        <input
          onChange={(e) =>
            setBlogData((prev) => ({ ...prev, description: e.target.value }))
          }
          type="text"
          placeholder="description"
          name=""
          id=""
        />
      </div>
      <br />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default CreateBlogs;
