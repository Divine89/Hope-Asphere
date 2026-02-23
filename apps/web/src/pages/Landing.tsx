import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function Landing() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-6">Welcome to Home-Asphere</h1>
          <p className="text-xl text-gray-600 mb-8">
            Discover and book unique homes for your next adventure
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => setLocation("/")}>
              Browse Listings
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                // Open signup modal
              }}
            >
              List Your Property
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
