import { useState, useEffect } from "react";
import { Menu, X, Home, Users, Map, LogIn, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Outlet, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useAuthStore from "@/store/authStore";
import SocratesLogo from "@/assets/Socrates-logo-big.png";

function UserAvatar({ user }) {
  if (!user) {
    // Use a friendly icon for the guest avatar
    return (
      <Avatar>
        <AvatarFallback className="bg-slate-400/90 text-white">
          <User className="h-6 w-6" />
        </AvatarFallback>
      </Avatar>
    );
  }

  const initials = user.email
    ? user.email.split("@")[0].slice(0, 2).toUpperCase()
    : "";

  return (
    <Avatar>
      <AvatarImage src={user?.photoURL} alt={user.email} />
      <AvatarFallback delayMs={600} className="bg-gray-400/90 text-white">
        {initials || <User className="h-4 w-4" />}
      </AvatarFallback>
    </Avatar>
  );
}

export default function LayoutWithSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout, checkUserAuth } = useAuthStore();

  useEffect(() => {
    checkUserAuth();
  }, [checkUserAuth, user]);

  useEffect(() => {
    console.log("User state changed:", user);
  }, [user]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const menuItems = [
    { icon: Home, label: "Main", goto: "/" },
    { icon: Users, label: "Dashboard", goto: "/dashboard" },
    { icon: Map, label: "Map", goto: "/map" },
  ];

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      {/* <aside
        className={`bg-slate-50 w-64 min-h-screen flex flex-col transition-all duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static fixed z-30`}
      >
        <div className="flex items-center justify-between p-4">
          <h2
            className="text-xl font-semibold text-[#555555] cursor-pointer"
            onClick={() => {
              navigate("/");
            }}
          >
            SOCRATES
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="md:hidden"
          >
            <X className="h-6 w-6" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        </div>
        <ScrollArea className="flex-grow">
          <nav className="py-4 space-y-2">
            {menuItems.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start"
                onClick={() => navigate(item.goto)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </nav>
        </ScrollArea>
      </aside> */}

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="backdrop-blur-sm border-b p-4 flex justify-between items-center">
          {/* <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="md:hidden mr-4"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Open sidebar</span>
          </Button> */}
          <h2
            className="text-xl lg:text-2xl font-semibold text-[#444444] cursor-pointer tracking-[.23em]"
            onClick={() => {
              navigate("/");
            }}
          >
            <img src={SocratesLogo} className="h-11" />
          </h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <UserAvatar user={user} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user ? user.email : "Guest"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user ? "Logged in" : "Not logged in"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={user ? handleLogout : handleLogin}>
                {user ? (
                  <>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    <span>Log in</span>
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <ScrollArea className="flex-grow p-6">
          <Outlet />
        </ScrollArea>
      </main>
    </div>
  );
}
