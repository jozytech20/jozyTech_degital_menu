// src/pages/admin/AdminLayout.tsx (or wherever you're placing layouts)
import { Outlet } from "react-router-dom";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import AdminSidebar from "./AdminSidebar";


function AdminLayout() {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset> 
        <SidebarTrigger />
        <main className="p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default AdminLayout;
