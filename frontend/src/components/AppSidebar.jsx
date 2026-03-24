import { Landmark, Shield, Zap, Droplets, Construction, Trash2, FileText, LayoutDashboard, MessageSquareText } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { slugify } from "@/lib/utils";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
const iconForCategory = name => {
  const key = name.toLowerCase();
  if (key.includes("municipal")) return Landmark;
  if (key.includes("police")) return Shield;
  if (key.includes("electric")) return Zap;
  if (key.includes("water")) return Droplets;
  if (key.includes("road")) return Construction;
  if (key.includes("sanitation")) return Trash2;
  if (key.includes("document")) return FileText;
  return LayoutDashboard;
};
export function AppSidebar() {
  const {
    state
  } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname + location.search;
  const {
    data: categories
  } = useQuery({
    queryKey: ["categories"],
    queryFn: () => api.get("/api/categories")
  });
  const isActive = url => {
    if (url === "/dashboard") return currentPath === "/dashboard";
    return currentPath === url;
  };
  return <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="font-heading text-xs uppercase tracking-wider">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem key="dashboard">
                <SidebarMenuButton asChild isActive={isActive("/dashboard")}>
                  <NavLink to="/dashboard" className="hover:bg-accent/50" activeClassName="bg-accent text-primary font-medium">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    {!collapsed && <span>Categories</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem key="ask">
                <SidebarMenuButton asChild isActive={isActive("/dashboard/ask")}>
                  <NavLink to="/dashboard/ask" className="hover:bg-accent/50" activeClassName="bg-accent text-primary font-medium">
                    <MessageSquareText className="mr-2 h-4 w-4" />
                    {!collapsed && <span>Ask Query</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {(categories || []).map(cat => {
              const Icon = iconForCategory(cat.name);
              const slug = slugify(cat.name);
              const url = `/dashboard/categories/${slug}`;
              return <SidebarMenuItem key={cat._id}>
                    <SidebarMenuButton asChild isActive={isActive(url)}>
                      <NavLink to={url} className="hover:bg-accent/50" activeClassName="bg-accent text-primary font-medium">
                        <Icon className="mr-2 h-4 w-4" />
                        {!collapsed && <span>{cat.name}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>;
            })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>;
}