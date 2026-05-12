import React from "react";
import { Navigate } from "react-router-dom";

/**
 * ProtectedRoute — Redirects unauthenticated users to /admin/login
 * Wrap any admin-only route with this component.
 */
export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("adminToken");
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}
