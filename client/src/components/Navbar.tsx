import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Map, LogIn, User, Menu, LogOut, Home, Key } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Navbar() {
  const { user, isAuthenticated, isLoggingOut, logout } = useAuth();

  return (
    <nav className="fixed top-0 w-full z-50 glass border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
              <Map className="w-6 h-6 text-primary" />
            </div>
            <span className="font-bold text-xl tracking-tight text-foreground">
              Home-Asphere
            </span>
          </Link>

          {/* Navigation Items */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link href="/create" className="hidden sm:block">
                  <Button variant="ghost" className="font-medium hover:bg-muted/50 rounded-full">
                    Home-Asphere your home
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center space-x-2 border border-border/50 hover:shadow-md transition-all duration-200 rounded-full p-2 pl-4 bg-card focus:outline-none">
                      <Menu className="w-4 h-4 text-muted-foreground" />
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={user?.profileImageUrl || undefined} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {user?.firstName?.[0] || <User className="w-4 h-4" />}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl">
                    <div className="px-2 py-2.5 pb-3">
                      <p className="font-medium text-sm">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <Link href="/bookings">
                      <DropdownMenuItem className="cursor-pointer rounded-lg py-2.5">
                        <Key className="w-4 h-4 mr-2 text-muted-foreground" />
                        My Bookings
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/create">
                      <DropdownMenuItem className="cursor-pointer rounded-lg py-2.5 sm:hidden">
                        <Home className="w-4 h-4 mr-2 text-muted-foreground" />
                        Host a home
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive rounded-lg py-2.5"
                      disabled={isLoggingOut}
                      onClick={() => logout()}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  className="font-medium hidden sm:flex"
                  onClick={() => window.location.href = "/api/login"}
                >
                  Log in
                </Button>
                <Button 
                  className="rounded-full font-medium shadow-md shadow-primary/20 hover:shadow-lg hover:-translate-y-0.5 transition-all"
                  onClick={() => window.location.href = "/api/login"}
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign up
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
