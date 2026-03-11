import React, { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { login } from "../utils/userSlice";

const EditProfile = () => {
  const {
    token,
    id: userId,
    email,
    name,
    username,
    profilepic,
    bio,
  } = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const [userData, setUserData] = useState({
    profilepic,
    name,
    username,
    bio,
  });

  const [initialData, setInitialData] = useState({
    profilepic,
    name,
    username,
    bio,
  });

  const [isDisableButton, setIsDisableButton] = useState(true);

  function handleChange(e) {
    const { value, name, files } = e.target;
    if (files) {
      setUserData((prevData) => ({ ...prevData, [name]: files[0] }));
    } else {
      setUserData((prevData) => ({ ...prevData, [name]: value }));
    }
    //
  }

  async function handleUpdateProfile() {
    setIsDisableButton(true);
    const formData = new FormData();
    formData.append("name", userData.name);
    formData.append("username", userData.username);

    if (userData.profilepic) {
      formData.append("profilepic", userData.profilepic);
    }
    // formData.append("image", blogData.image);
    formData.append("bio", userData.bio);

    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/users/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success(res.data.message);
      dispatch(login({ ...res.data.user, email, token, id: userId }));
    } catch (error) {
      console.log(error);
      // toast.error(
      //   error?.response?.data?.message ||
      //     error?.message ||
      //     "Something went wrong",
      // );
    }
  }

  useEffect(() => {
    if (initialData) {
      const isEqual = JSON.stringify(userData) === JSON.stringify(initialData);
      setIsDisableButton(isEqual);
    }
  }, [userData, initialData]);
  // console.log(userData);
  return (
    <div className="w-full ">
      <div className="w-[30%] border px-10 mx-auto">
        <h1 className="text-center">Edit Profile</h1>
        <div>
          {/* Cover Image */}
          <div className="mb-2">
            <label className="block text-bold font-medium mb-2">
              Cover Image
            </label>
            <div className="flex items-center flex-col gap-3">
              <label
                htmlFor="coverImage"
                className="cursor-pointer block border-2 w-[150px] h-[150px] rounded-full overflow-hidden"
              >
                {userData.profilepic ? (
                  <img
                    src={
                      typeof userData.profilepic === "string"
                        ? userData.profilepic
                        : URL.createObjectURL(userData.profilepic)
                    }
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    Select Image
                  </div>
                )}
              </label>
              <h2
                className="text-lg text-red-500 font-medium cursor-pointer"
                onClick={() => {
                  setUserData((prevData) => ({
                    ...prevData,
                    profilepic: null,
                  }));
                }}
              >
                Remove
              </h2>
            </div>

            <input
              id="coverImage"
              name="profilepic"
              type="file"
              hidden
              accept="image/*"
              onChange={handleChange}
            />
          </div>
          {/* name*/}
          <div className="mb-4">
            <label className="block text-bold font-medium mb-1">Name</label>
            <input
              placeholder="name"
              type="text"
              name="name"
              className="w-full border rounded-lg px-3 py-2"
              defaultValue={userData.name}
              onChange={handleChange}
            />
          </div>
          {/* username*/}
          <div className="mb-4">
            <label className="block text-bold font-medium mb-1">Username</label>
            <input
              placeholder="username"
              type="text"
              name="username"
              defaultValue={userData.username}
              className="w-full border rounded-lg px-3 py-2"
              onChange={handleChange}
            />
          </div>

          {/* Bio */}
          <div className="mb-4">
            <label className="block text-bold font-medium mb-1">Bio</label>
            <textarea
              rows={3}
              type="text"
              name="bio"
              placeholder="bio..."
              defaultValue={userData.bio}
              className="w-full border rounded-lg px-3 py-2 resize-none"
              onChange={handleChange}
            />
          </div>
          <button
            disabled={isDisableButton}
            className={` rounded-full px-7 py-3 my-3 text-white  ${isDisableButton ? "bg-green-300" : "bg-green-600"}`}
            onClick={handleUpdateProfile}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
