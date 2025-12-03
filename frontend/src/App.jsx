import { Route, Routes } from "react-router-dom";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";

function App() {
  return (
    <div className="bg-slate-200 w-screen h-screen flex justify-center items-center">
      <Routes>
        {/* Default route (optional) */}
        <Route path="/" element={<Signin />} />

        {/* Other routes */}
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  );
}

export default App;
