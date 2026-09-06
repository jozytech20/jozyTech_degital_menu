import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/store/authStore";
import { FolderTree, UtensilsCrossed, LogOut, ChevronUp, Settings, LayoutDashboard } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


function OwnerSidebar() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { pathname } = useLocation();

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <h2 className="font-bold text-lg px-2">JOZY Owner</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-y-1 mt-2">
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={pathname === "/dashboard/owner"}
                  render={<NavLink to="/dashboard/owner" end />}
                >
                  <LayoutDashboard className="size-4" />
                  Dashboard
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={pathname.startsWith("/dashboard/owner/categories")}
                  render={<NavLink to="/dashboard/owner/categories" />}
                >
                  <FolderTree className="size-4" />
                  Categories
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={pathname.startsWith("/dashboard/owner/menu-items")}
                  render={<NavLink to="/dashboard/owner/menu-items" />}
                >
                  <UtensilsCrossed className="size-4" />
                  Menu Items
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={pathname === "/dashboard/owner/venue-setting"}
                  render={<NavLink to="/dashboard/owner/venue-setting" end />}
                >
                  <Settings className="size-4" />
                  Venue Setting
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>

          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={<SidebarMenuButton size="lg" className="cursor-pointer" />}
              >
                <div className="flex size-8 items-center justify-center rounded-full bg-sidebar-accent text-sidebar-accent-foreground font-semibold text-sm">
                  {user?.name?.charAt(0).toUpperCase() ?? "O"}
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold text-sm">{user?.name}</span>
                  <span className="text-xs text-muted-foreground">{user?.role}</span>
                </div>
                <ChevronUp className="ml-auto size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" className="w-(--radix-dropdown-menu-trigger-width)">
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="size-4 mr-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

    </Sidebar>
  );
}

export default OwnerSidebar;