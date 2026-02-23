import { useState } from "react";
import { useListings } from "@/hooks/use-listings";
import { ListingCard } from "@/components/ListingCard";
import { Search, MapPin, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const [city, setCity] = useState("");
  const [activeFilter, setActiveFilter] = useState("");
  
  const { data: listings, isLoading } = useListings({ 
    city: activeFilter || undefined 
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveFilter(city);
  };

  return (
    <div className="min-h-screen bg-background pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Search Bar Section */}
        <div className="flex justify-center mb-12">
          <form 
            onSubmit={handleSearch}
            className="w-full max-w-2xl flex items-center bg-card shadow-lg shadow-black/5 border border-border rounded-full p-2 pl-6 transition-all focus-within:ring-4 focus-within:ring-primary/20 focus-within:border-primary"
          >
            <MapPin className="w-5 h-5 text-muted-foreground mr-3" />
            <Input 
              type="text" 
              placeholder="Where are you going?" 
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="flex-1 border-0 bg-transparent focus-visible:ring-0 px-0 h-12 text-base"
            />
            <Button type="button" variant="ghost" size="icon" className="text-muted-foreground mr-2 rounded-full">
              <SlidersHorizontal className="w-5 h-5" />
            </Button>
            <Button type="submit" size="icon" className="w-12 h-12 rounded-full shadow-md shrink-0">
              <Search className="w-5 h-5" />
            </Button>
          </form>
        </div>

        {/* Results Info */}
        <div className="mb-6 flex justify-between items-end">
          <h2 className="text-2xl font-bold">
            {activeFilter ? `Stays in ${activeFilter}` : "Explore all destinations"}
          </h2>
          {listings && <p className="text-muted-foreground">{listings.length} homes</p>}
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted rounded-2xl aspect-[4/3] mb-4" />
                <div className="h-4 bg-muted rounded w-2/3 mb-2" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : listings?.length === 0 ? (
          <div className="text-center py-20 bg-muted/30 rounded-3xl border border-border border-dashed">
            <div className="w-16 h-16 bg-card rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">No homes found</h3>
            <p className="text-muted-foreground">Try adjusting your search or exploring a different city.</p>
            <Button variant="outline" className="mt-6 rounded-full" onClick={() => { setCity(""); setActiveFilter(""); }}>
              Clear Search
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 gap-y-10">
            {listings?.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
