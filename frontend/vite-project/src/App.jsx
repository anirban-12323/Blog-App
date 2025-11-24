import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Signup from "./pages/signup";
import CreateBlogs from "./components/createBlogs";
import Blogs from "./components/blogs";
import Signin from "./pages/signin";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Blogs />}></Route>
      <Route path="/signup" element={<Signup />}></Route>
      <Route path="/signin" element={<Signin />}></Route>

      <Route path="/create-blog" element={<CreateBlogs />}></Route>
      <Route path="*" element={<h1>kya kar raha hei bhai tu</h1>}></Route>
    </Routes>
  );
}

export default App;
