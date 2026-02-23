import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";

export default function Navbar() {
  const [, setLocation] = useLocation();
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div onClick={() => setLocation("/")} className="text-2xl font-bold text-blue-600 cursor-pointer">
          Home-Asphere
        </div>

        <div className="flex gap-4">
          {user ? (
            <>
              <Button variant="ghost" onClick={() => setLocation("/")}>
                Browse Listings
              </Button>
              <Button variant="ghost" onClick={() => setLocation("/create-listing")}>
                Host a Property
              </Button>
              <Button variant="ghost" onClick={() => setLocation("/my-bookings")}>
                My Bookings
              </Button>
              <Button variant="ghost" onClick={() => setLocation("/dashboard")}>
                Dashboard
              </Button>
              <div className="flex items-center gap-2">
                <span className="text-sm">{user.firstName} {user.lastName}</span>
                <Button
                  variant="outline"
                  onClick={() => {
                    logout();
                    setLocation("/");
                  }}
                >
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  // Open login modal
                }}
              >
                Login
              </Button>
              <Button
                onClick={() => {
                  // Open signup modal
                }}
              >
                Sign Up
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
