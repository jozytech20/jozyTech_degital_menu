import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/auth/Login";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import AdminDashboard from "./pages/adminDashboard/adminDashboard";
import OwnerDashboard from "./pages/ownerDashboard/ownerDashboard";
import api from "./lib/api";
import type { AuthUser } from "./types/user";

function App() {
 const setUser = useAuthStore((state) => state.setUser);
 const setIsLoading = useAuthStore((state) => state.setIsLoading);

 useEffect(() => {
   const checkAuth = async () => {
     try {
       const response = await api.get<{ data: AuthUser }>("/auth/me");
       setUser(response.data.data);
       console.log(response);
       
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
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/owner/*"
          element={
            <ProtectedRoute allowedRole="owner">
              <OwnerDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;