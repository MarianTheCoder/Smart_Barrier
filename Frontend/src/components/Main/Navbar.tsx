import { AuthContext } from "@/context/AuthContext";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGaugeHigh,
  faVideo,
  faCarSide,
  faClockRotateLeft,
  faRightFromBracket,
  faCircleUser,
  faShieldHalved,
  faLink,
  faClipboardCheck,
} from "@fortawesome/free-solid-svg-icons";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { toast } from "sonner";
import { useContext } from "react";

export default function Navbar() {
  const { logout, user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { title: "Acasă", url: "/", icon: faGaugeHigh },
    { title: "Înregistrări", url: "/records", icon: faClipboardCheck },
    { title: "Live Camera", url: "/live", icon: faVideo },
    { title: "În Incintă", url: "/active", icon: faCarSide },
    { title: "Istoric", url: "/history", icon: faClockRotateLeft },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Deconectat cu succes");
      navigate("/login");
    } catch (error) {
      toast.error("Eroare la deconectare");
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-background">
        {/* --- SIDEBAR --- */}
        <Sidebar collapsible="none" variant="floating" className="border-r">
          <SidebarHeader className="p-4 h-16 border-b">
            <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
              <div className="bg-primary size-9 rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
                <FontAwesomeIcon icon={faShieldHalved} className="text-primary-foreground text-lg" />
              </div>
              <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                <span className="font-bold text-sm tracking-tight">
                  SMART <span className="text-primary italic">BARRIER</span>
                </span>
                <span className="text-[10px] text-muted-foreground font-medium uppercase">Panou de Control</span>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup className="">
              <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">Monitorizare</SidebarGroupLabel>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={location.pathname === item.url} tooltip={item.title} className="py-6">
                      <Link to={item.url} className="flex items-center gap-4">
                        <FontAwesomeIcon icon={item.icon} className="" />
                        <span className="font-semibold text-base">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t ">
            <div className="flex items-center gap-3  p-2 group-data-[collapsible=icon]:justify-center">
              <FontAwesomeIcon icon={faCircleUser} className="text-primary text-xl" />
              <div className="flex flex-col text-xs truncate group-data-[collapsible=icon]:hidden">
                <span className="font-bold">{user?.name || "Admin"}</span>
              </div>
            </div>
            <Button
              variant="destructive"
              className="w-full justify-start gap-3 hover:bg-destructive/70! cursor-pointer group-data-[collapsible=icon]:justify-center"
              onClick={handleLogout}
            >
              <FontAwesomeIcon icon={faRightFromBracket} />
              <span className="group-data-[collapsible=icon]:hidden font-bold">Ieșire</span>
            </Button>
          </SidebarFooter>
        </Sidebar>

        {/* --- MAIN CONTENT AREA --- */}
        <main className="flex-1 flex flex-col min-w-0">
          <header className="h-16 border-b  flex items-center justify-between px-4  gap-4 bg-card sticky top-0 z-10">
            <div className="flex items-center  gap-4">
              <h3 className="text-sm text-foreground font-semibold  bg-primary p-2 rounded-xl items-center px-6 gap-1 flex">
                <FontAwesomeIcon icon={faLink} />
                {menuItems.find((i) => i.url === location.pathname)?.title || "Prezentare Generală"}
              </h3>
              <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">Sistem Barieră Smart</h2>
            </div>
            {/* ESP32 Status Badge */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-full border border-border bg-secondary/10">
              {/* The Dot Container */}
              <div className="flex items-center justify-center">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
              </div>
              <span className="text-[10px] font-black tracking-widest text-secondary-foreground leading-none uppercase">ESP32_CAM</span>
            </div>
          </header>
          <div className="flex-1 overflow-auto text-foreground">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
