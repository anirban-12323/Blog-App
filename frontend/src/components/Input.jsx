import React from "react";

function Input({ type, placeholder, setUserData, field, value }) {
  return (
    <input
      type={type}
      className="w-full h-[50px] text-white text-xl p-2 rounded-md focus:outline-none bg-gray-500"
      placeholder={placeholder}
      value={value}
      onChange={(e) =>
        setUserData((prev) => ({ ...prev, [field]: e.target.value }))
      }
    />
  );
}

export default Input;
