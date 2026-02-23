import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useListings } from "@/hooks/use-listings";
import { useLocation } from "wouter";
import { formatPrice } from "@home-asphere/shared/utils";

export default function Home() {
  const [, setLocation] = useLocation();
  const { data: listings, isLoading } = useListings();

  if (isLoading) {
    return <div>Loading listings...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Available Properties</h1>

      {!listings || listings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No listings available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing: any) => (
            <Card
              key={listing.id}
              className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setLocation(`/listing/${listing.id}`)}
            >
              <div className="bg-gray-200 h-48"></div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-1">{listing.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{listing.city}</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold">{formatPrice(listing.pricePerNight)}/night</span>
                  <span className="text-sm text-yellow-500">★ {listing.averageRating || 'New'}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
