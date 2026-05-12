import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./component/admin/ProtectedRoute.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PageLoader from "./component/PageLoader.jsx";

// Lazy-loaded components
const Home = lazy(() => import("./component/home/Home.jsx"));
const LoginPage = lazy(() => import("./component/admin/LoginPage.jsx"));
const AdminDashboard = lazy(() => import("./component/admin/AdminDashboard.jsx"));
const NotFound = lazy(() => import("./component/NotFound.jsx"));

export default function App() {
  return (
    <Router>
      <Suspense fallback={<PageLoader isLoading={true} />}>
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
      </Suspense>
      <ToastContainer position="bottom-right" theme="dark" />
    </Router>
  );
}