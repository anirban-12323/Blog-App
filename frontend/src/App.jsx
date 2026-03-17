import { Route, Routes } from "react-router-dom";

import AuthForm from "./pages/AuthForm";
import VerifyUser from "./components/VerifyUser";
import Navber from "./components/Navber";
import HomePage from "./components/HomePage";
import AddBlog from "./pages/AddBlog";
import BlogPage from "./pages/BlogPage";
import ProfilePage from "./pages/ProfilePage";
import EditProfile from "./pages/EditProfile";
import SearchBlogs from "./pages/SearchBlogs";

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
        <Route path="/search" element={<SearchBlogs />} />
        <Route path="/tag/:tag" element={<SearchBlogs />} />
        <Route
          path="/verify-email/:verificationToken"
          element={<VerifyUser />}
        />

        <Route path="/:username" element={<ProfilePage />} />
        <Route path="/edit-profile" element={<EditProfile />} />
      </Route>

      {/* Other routes */}
    </Routes>

    //</div>
  );
}

export default App;
