import { Navigate } from "react-router-dom";

function PublicRoute({ children }) {
  const user = localStorage.getItem("user");

  // If user is already logged in, redirect to dashboard
  return user ? <Navigate to="/dashboard" replace /> : children;
}

export default PublicRoute;
