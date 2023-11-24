import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";

function Register() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(false);
      const res = await fetch("/server/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(true);
        return;
      }
      navigate("/login");
    } catch (error) {
      setLoading(false);
      setError(true);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-6 p-4">
      <h1 className="text-3xl text-center">Register</h1>
      <form action="" className="mt-4" onSubmit={handleSubmit}>
        <label
          htmlFor="avatar"
          className="flex justify-center items-center my-4"
        >
          <img
            src="https://static.vecteezy.com/system/resources/previews/010/056/184/original/people-icon-sign-symbol-design-free-png.png"
            alt="avatar"
            className="w-[150px] border-4 border-slate-200 cursor-pointer rounded-[50%]"
          />
        </label>
        <input type="file" id="avatar" className="hidden" />
        <input
          id="email"
          type="text"
          placeholder="Email"
          className="w-full bg-slate-200 rounded-lg p-4 my-2"
          onChange={(e) => handleChange(e)}
        />
        <input
          id="username"
          type="text"
          placeholder="Username"
          className="w-full bg-slate-200 rounded-lg p-4 my-2"
          onChange={(e) => handleChange(e)}
        />
        <input
          id="password"
          type="password"
          placeholder="Password"
          className="w-full bg-slate-200 rounded-lg p-4 my-2"
          onChange={(e) => handleChange(e)}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-zinc-700 text-slate-100 text-lg rounded-lg hover:opacity-80 disabled:opacity-30 p-2 my-2"
        >
          {loading ? "Loading..." : "Register"}
        </button>
        <OAuth />
      </form>
      <div>
        <span>
          Have an accout?{" "}
          <Link to="/login" className="text-blue-600">
            Login
          </Link>
        </span>
      </div>
      <p className="text-red-600">{error && "Oops!, Something went wrong"}</p>
    </div>
  );
}

export default Register;
