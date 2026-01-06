import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../utils/userSlice";

function AuthForm({ type }) {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  async function handleRegister(e) {
    e.preventDefault();

    const payload =
      type === "signup"
        ? userData
        : {
            email: userData.email,
            password: userData.password,
          };

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/${type}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { token, ...userWithoutToken } = res.data.user;

      dispatch(
        login({
          user: userWithoutToken,
          token,
        })
      );

      toast.success(res.data.message || "Success");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  }

  return (
    <div className="  w-[20%] flex flex-col items-center gap-5 mt-35">
      <h1 className="text-3xl">{type === "signin" ? "Sign in" : "Sign up"}</h1>

      <form
        className="w-full flex flex-col items-center gap-5"
        onSubmit={handleRegister}
      >
        {type == "signup" && (
          <input
            type="name"
            className="w-full h-[50px] text-white text-xl p-2 rounded-md focus:outline-none bg-gray-500"
            placeholder="Enter your name"
            onChange={(e) =>
              setUserData((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        )}

        <input
          type="email"
          className="w-full h-[50px] text-white text-xl p-2 rounded-md focus:outline-none bg-gray-500"
          placeholder="Enter your email"
          onChange={(e) =>
            setUserData((prev) => ({ ...prev, email: e.target.value }))
          }
        />
        <input
          type="password"
          className="w-full h-[50px] text-white text-xl p-2 rounded-md focus:outline-none bg-gray-500"
          placeholder="Enter your password"
          onChange={(e) =>
            setUserData((prev) => ({ ...prev, password: e.target.value }))
          }
        />
        <button className="w-[100px] h-[50px] text-white text-xl p-2 rounded-md focus:outline-none bg-gray-500">
          {type == "signin" ? "Login" : "Register"}
        </button>
      </form>
      {type == "signin" ? (
        <p>
          Don't have an account <Link to={"/signup"}>Sign Up</Link>
        </p>
      ) : (
        <p>
          Already have an account <Link to={"/signin"}>Sign in</Link>
        </p>
      )}
    </div>
  );
}

export default AuthForm;
