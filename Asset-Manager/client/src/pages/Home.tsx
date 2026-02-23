import { useAuth } from "@/hooks/use-auth";
import Landing from "./Landing";
import Dashboard from "./Dashboard";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>;
  }

  // Show marketing page to logged-out users, dashboard to logged-in users
  return isAuthenticated ? <Dashboard /> : <Landing />;
}
