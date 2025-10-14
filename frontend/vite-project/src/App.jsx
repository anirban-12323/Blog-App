import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [userData, setuserData] = useState({
    name: "",
    email: "",
    password: "",
  });
  async function handleSubmit() {
    let data = await fetch("http://localhost:3000/users", {
      method: "POST",
      body: JSON.stringify(userData),
      headers: {
        "Content-Type": "application/json",
      },
    });
    let res = await data.json();
    alert(res.message);
  }

  return (
    <div>
      <h1>Sign Up</h1>
      <div>
        <input
          onChange={(e) =>
            setuserData((prev) => ({ ...prev, name: e.target.value }))
          }
          type="text "
          placeholder="name"
          name=""
          id=""
        />
        <br />
        <br />
        <input
          onChange={(e) =>
            setuserData((prev) => ({ ...prev, email: e.target.value }))
          }
          type="text"
          placeholder="email"
          name=""
          id=""
        />
        <br />
        <br />
        <input
          onChange={(e) =>
            setuserData((prev) => ({ ...prev, password: e.target.value }))
          }
          type="text "
          placeholder="password"
          name=""
          id=""
        />
      </div>
      <br />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default App;
