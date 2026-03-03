// React hook for managing component state
import { useState } from "react";

// Axios for making HTTP requests to backend
import axios from "axios";

// Toast notifications for success/error messages
import toast from "react-hot-toast";

// Link component for navigation between routes
import { Link } from "react-router-dom";

// Redux hook to dispatch actions
import { useDispatch } from "react-redux";

// login action from Redux slice (stores user + token in global state)
import { login } from "../utils/userSlice";
import Input from "../components/Input";
import loginImg from "../assets/loginImg.png";
import registerImg from "../assets/registerImg.png";
import googleIcon from "../assets/googleIcon.svg";
import { useNavigate } from "react-router-dom";
import { googleAuth } from "../utils/firebase";

// Reusable Authentication Form Component
// It works for both Sign In and Sign Up based on "type" prop
function AuthForm({ type }) {
  const isSignup = type === "signup";

  const themeColor = isSignup ? "orange" : "blue";
  const primaryBg = isSignup ? "bg-orange-500" : "bg-blue-500";
  const primaryBorder = isSignup ? "border-orange-400" : "border-blue-400";
  const primaryText = isSignup ? "text-orange-400" : "text-blue-400";

  // Local state to store form input values
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Redux dispatch function
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Function that runs when form is submitted
  async function handleAuthForm(e) {
    e.preventDefault(); // Prevent page reload on form submit

    try {
      // Send POST request to backend
      // URL becomes /signup or /signin dynamically
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/${type}`,
        userData,
      );
      if (type == "signup") {
        // console.log(res.data.message);
        toast.success(res.data.message);
        navigate("/signin");
      } else {
        dispatch(login(res.data.user));
        toast.success(res.data.message);
        navigate("/");
      }
    } catch (error) {
      // Show error message if request fails
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setUserData({
        name: "",
        email: "",
        password: "",
      });
    }
  }

  async function handleGoogleAuth() {
    try {
      let data = await googleAuth();

      let res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/google-auth`,
        {
          accessToken: data.accessToken,
        },
      );

      toast.success(res?.data?.message);
      dispatch(login(res?.data?.user));
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  }

  return (
    // Main container
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center gap-10 px-4 bg-gray-900 text-white">
      {/* Left Illustration */}
      <div className="md:w-1/3 w-72">
        <img src={isSignup ? loginImg : registerImg} alt="auth illustration" />
      </div>

      {/* Right Card Section */}
      <div className="md:w-1/3 w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-xl">
        {/* Heading changes dynamically */}
        <h1 className="text-3xl flex justify-center">
          {type === "signin" ? "Sign in" : "Sign up"}
        </h1>
        <br />

        {/* Form submission triggers handleRegister */}
        <form
          className="w-full flex flex-col items-center gap-5"
          onSubmit={handleAuthForm}
        >
          {/* Show name input ONLY if type is signup */}
          {type == "signup" && (
            <Input
              type={"text"}
              placeholder={"Enter your name"}
              setUserData={setUserData}
              field={"name"}
              value={userData.name}
            />
          )}

          {/* Email input */}

          <Input
            type={"email"}
            placeholder={"Enter your email"}
            setUserData={setUserData}
            field={"email"}
            value={userData.email}
          />
          {/* Password input */}

          <Input
            type={"password"}
            placeholder={"Enter your password"}
            setUserData={setUserData}
            field={"password"}
            value={userData.password}
          />

          {/* Submit button text changes based on type */}
          <button className="w-[100px] h-[50px] text-white text-xl p-2 rounded-md focus:outline-none bg-gray-500">
            {type == "signin" ? "Login" : "Register"}
          </button>
        </form>
        <p className="mt-5 text-center w-full">or</p>

        <div
          className="bg-white w-full flex gap-2  items-center justify-center overflow-hidden rounded-full py-1 px-2 text-black"
          onClick={handleGoogleAuth}
        >
          <div>
            <img className="w-8 h-8" src={googleIcon} alt="" />
          </div>
          <p className="text-2xl font-medium">continue with</p>
        </div>

        {/* Navigation link switches between Sign In and Sign Up */}
        {type == "signin" ? (
          <p className="flex justify-center mt-3">
            Don't have an account <Link to={"/signup"}> Sign Up</Link>
          </p>
        ) : (
          <p className="flex justify-center mt-3">
            Already have an account <Link to={"/signin"}>Sign in</Link>
          </p>
        )}
      </div>
    </div>
  );
}

// Export component
export default AuthForm;
