import { Route, Routes } from "react-router-dom";

import AuthForm from "./pages/AuthForm";
import VerifyUser from "./components/VerifyUser";
import Navber from "./components/Navber";
import HomePage from "./components/HomePage";
import AddBlog from "./pages/AddBlog";
import BlogPage from "./pages/BlogPage";
import Comment from "./components/Comment";

function App() {
  return (
    // <div className="bg-slate-200 w-screen h-screen ">
    <Routes>
      {/* Auth routes (no navbar) */}
      <Route path="/signin" element={<AuthForm type={"signin"} />} />
      <Route path="/signup" element={<AuthForm type={"signup"} />} />
      {/* Default route (optional) */}
      <Route path="/" element={<Navber />}>
        <Route path="/" element={<HomePage></HomePage>} />
        <Route path="/add-blog" element={<AddBlog />} />
        <Route path="/blog/:id" element={<BlogPage />} />
        <Route path="/edit/:id" element={<AddBlog />} />
        <Route
          path="/verify-email/:verificationToken"
          element={<VerifyUser />}
        />
      </Route>

      {/* Other routes */}
    </Routes>

    //</div>
  );
}

export default App;
