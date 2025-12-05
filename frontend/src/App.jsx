import { Route, Routes } from "react-router-dom";

import AuthForm from "./pages/AuthForm";

function App() {
  return (
    <div className="bg-slate-200 w-screen h-screen flex justify-center items-center">
      <Routes>
        {/* Default route (optional) */}
        <Route path="/" element={<AuthForm type={"signin"} />} />

        {/* Other routes */}
        <Route path="/signin" element={<AuthForm type={"signin"} />} />
        <Route path="/signup" element={<AuthForm type={"signup"} />} />
      </Routes>
    </div>
  );
}

export default App;
