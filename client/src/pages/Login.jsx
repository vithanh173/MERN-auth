import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

function Login() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(loginStart());
      const res = await fetch("/server/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(loginFailure(data));
        return;
      }
      dispatch(loginSuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(loginFailure(error));
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-6 p-4">
      <h1 className="text-3xl text-center">Login</h1>
      <form action="" className="mt-4" onSubmit={handleSubmit}>
        <input
          id="email"
          type="text"
          placeholder="Email"
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
          {loading ? "Loading..." : "Login"}
        </button>
        <OAuth />
      </form>
      <div>
        <span>
          Dont have an account?{" "}
          <Link to="/register" className="text-blue-600">
            Register now
          </Link>
        </span>
      </div>
      <p className="text-red-600">
        {error ? error.message || "Oops!, Something went wrong" : ""}
      </p>
    </div>
  );
}

export default Login;
