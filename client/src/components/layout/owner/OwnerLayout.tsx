import { Outlet } from "react-router-dom";
import OwnerSidebar from "./OwnerSidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";


const OwnerLayout = () => {
  return (
    <SidebarProvider>
      <OwnerSidebar />
      <SidebarInset>
        <SidebarTrigger />
        <main className="p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default OwnerLayout;