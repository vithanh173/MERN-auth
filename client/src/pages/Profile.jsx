import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  logout,
} from "../redux/user/userSlice";

function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [image, setImage] = useState(undefined);
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateStatus, setUpdateStatus] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (image) {
      handleFileUpload(image);
    }
  }, [image]);

  const handleFileUpload = async (image) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercent(Math.round(progress));
      },

      (error) => {
        setImageError(true);
      },

      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, profile: downloadURL });
        });
      },
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/server/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateStatus(true);
    } catch (error) {
      dispatch(updateUserFailure(error));
    }
  };

  const handleDeleteAccount = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/server/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error));
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/server/auth/logout");
      dispatch(logout());
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3">
      <h1 className="text-center text-3xl font-semibold my-4">Profile</h1>
      <form
        className="flex flex-col items-center justify-center gap-4"
        onSubmit={handleSubmit}
      >
        <img
          src={formData.profile || currentUser.profile}
          alt="avatar"
          className="h-24 w-24 cursor-pointer rounded-full object-cover"
          onClick={() => fileRef.current.click()}
        />
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <p className="text-lg self-center">
          {imageError ? (
            <span className="text-red-700">
              Error uploading(File size is more than 2MB)
            </span>
          ) : imagePercent > 0 && imagePercent < 100 ? (
            <span className="text-slate-700">{`Uploading: ${imagePercent}%`}</span>
          ) : imagePercent === 100 ? (
            <span className="text-green-700">Image upload successfully</span>
          ) : (
            ""
          )}
        </p>
        <input
          defaultValue={currentUser.username}
          type="text"
          id="username"
          placeholder="Username"
          className="bg-slate-200 rounded-lg p-3 w-full"
          onChange={(e) => handleChange(e)}
        />
        <input
          defaultValue={currentUser.email}
          type="email"
          id="email"
          placeholder="Username"
          className="bg-slate-200 rounded-lg p-3 w-full"
          onChange={(e) => handleChange(e)}
        />
        <input
          type="password"
          id="password"
          placeholder="Username"
          className="bg-slate-200 rounded-lg p-3 w-full"
          onChange={(e) => handleChange(e)}
        />
        <button className="bg-slate-700 text-slate-200 w-full p-3 rounded-lg hover:opacity-95 disabled:opacity-30">
          {loading ? "Loading..." : "Update"}
        </button>
      </form>
      <div className="flex justify-between items-center my-2">
        <span
          className="text-red-600 cursor-pointer"
          onClick={handleDeleteAccount}
        >
          Delete Account
        </span>
        <span className="text-red-600 cursor-pointer" onClick={handleLogout}>
          Log out
        </span>
      </div>
      <p className="text-red-700 mt-5">{error && "Something went wrong"}</p>
      <p className="text-green-700 mt-5">
        {updateStatus && "Updated successfully"}
      </p>
    </div>
  );
}

export default Profile;
