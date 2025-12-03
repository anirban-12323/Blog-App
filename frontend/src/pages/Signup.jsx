import { useState } from "react";

function Signup() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });
  async function handleRegister(e) {
    e.preventDefault();
    const data = await fetch("http://localhost:3000/api/v1/signup", {
      method: "POST",
      body: JSON.stringify(userData),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const res = await data.json();
    console.log(res);
  }
  return (
    <div className="w-[20%] flex flex-col items-center gap-5">
      <h1 className="text-3xl">Sign up</h1>

      <form
        className="w-full flex flex-col items-center gap-5"
        onSubmit={handleRegister}
      >
        {" "}
        <input
          type="name"
          className="w-full h-[50px] text-white text-xl p-2 rounded-md focus:outline-none bg-gray-500"
          placeholder="Enter your name"
          onChange={(e) =>
            setUserData((prev) => ({ ...prev, name: e.target.value }))
          }
        />
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
          register
        </button>
      </form>
    </div>
  );
}

export default Signup;
