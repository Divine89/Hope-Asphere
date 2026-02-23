import { Router, Route } from "wouter";
import { useAuth } from "./hooks/use-auth";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import ListingDetails from "./pages/ListingDetails";
import CreateListing from "./pages/CreateListing";
import MyBookings from "./pages/MyBookings";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/not-found";
import Navbar from "./components/Navbar";

function AppRoutes() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Route path="/" component={user ? Home : Landing} />
        <Route path="/listing/:id" component={ListingDetails} />
        <Route path="/create-listing" component={CreateListing} />
        <Route path="/my-bookings" component={MyBookings} />
        <Route path="/dashboard" component={Dashboard} />
        <Route component={NotFound} />
      </main>
    </div>
  );
}

export default AppRoutes;
