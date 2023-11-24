import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

function PrivateRoute() {
  const currentUser = useSelector((state) => state.user.currentUser);
  return currentUser ? <Outlet /> : <Navigate to="/login" />;
}
export default PrivateRoute;
