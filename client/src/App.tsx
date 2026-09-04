import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/auth/Login";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import api from "./lib/api";
import type { AuthUser } from "./types/user";
import AdminUsers from "./pages/adminDashboard/AdminUsers";
import AdminVenues from "./pages/adminDashboard/AdminVenues";
import OwnerVenue from "./pages/ownerDashboard/OwnerVenue";
import OwnerCategories from "./pages/ownerDashboard/OwnerCategories";
import OwnerMenuItems from "./pages/ownerDashboard/OwnerMenuItems";
import AdminLayout from "./components/layout/admin/AdminLayout";
import OwnerLayout from "./components/layout/owner/OwnerLayout";

function App() {
  const setUser = useAuthStore((state) => state.setUser);
  const setIsLoading = useAuthStore((state) => state.setIsLoading);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get<{ data: AuthUser }>("/auth/me");
        setUser(response.data.data);

      } catch (err) {
        console.error(err);

        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard/admin/*"
          element={
            <ProtectedRoute allowedRole="superAdmin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminUsers />} />
          <Route path="venues" element={<AdminVenues />} />
          <Route path="*" element={<Navigate to="/dashboard/admin" replace />} />
        </Route>
        <Route
          path="/dashboard/owner/*"
          element={
            <ProtectedRoute allowedRole="owner">
              <OwnerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<OwnerVenue />} />
          <Route path="categories" element={<OwnerCategories />} />
          <Route path="menu-items" element={<OwnerMenuItems />} />
          <Route path="*" element={<Navigate to="/dashboard/owner" replace />} />
        </Route>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;