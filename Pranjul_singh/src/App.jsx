import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./component/home/Home.jsx";
import LoginPage from "./component/admin/LoginPage.jsx";
import AdminDashboard from "./component/admin/AdminDashboard.jsx";
import ProtectedRoute from "./component/admin/ProtectedRoute.jsx";
import NotFound from "./component/NotFound.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/login" element={<LoginPage />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        {/* 404 Catch-All */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer position="bottom-right" theme="dark" />
    </Router>
  );
}