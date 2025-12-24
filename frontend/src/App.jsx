import { Route, Routes } from "react-router-dom";

import AuthForm from "./pages/AuthForm";
import Navber from "./components/Navber";
import HomePage from "./components/HomePage";
import AddBlog from "./pages/AddBlog";
import BlogPage from "./pages/BlogPage";

function App() {
  return (
    <div className="bg-slate-200 w-screen h-screen ">
      <Routes>
        {/* Default route (optional) */}
        <Route path="/" element={<Navber />}>
          <Route path="/" element={<HomePage></HomePage>} />
          <Route path="/signin" element={<AuthForm type={"signin"} />} />
          <Route path="/signup" element={<AuthForm type={"signup"} />} />
          <Route path="/add-blog" element={<AddBlog></AddBlog>} />
          <Route path="/blog/:id" element={<BlogPage></BlogPage>} />
        </Route>

        {/* Other routes */}
      </Routes>
    </div>
  );
}

export default App;
