import { Link } from "wouter";
import { Listing } from "@shared/schema";
import { Star, MapPin } from "lucide-react";

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  // Use a fallback image if no images provided
  const imageUrl = listing.images && listing.images.length > 0 
    ? listing.images[0] 
    : "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&q=80";

  return (
    <Link href={`/listing/${listing.id}`}>
      <div className="group cursor-pointer">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl mb-4">
          <img 
            src={imageUrl} 
            alt={listing.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center shadow-sm">
            <Star className="w-3.5 h-3.5 text-primary mr-1 fill-primary" />
            <span className="text-xs font-bold text-foreground">4.9</span>
          </div>
        </div>
        
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-foreground truncate max-w-[200px] sm:max-w-[240px]">
              {listing.city}
            </h3>
            <p className="text-muted-foreground text-sm mt-1 truncate max-w-[240px]">
              {listing.title}
            </p>
          </div>
        </div>
        
        <div className="mt-2 flex items-center text-sm">
          <span className="font-bold text-foreground">
            ${(listing.pricePerNight / 100).toLocaleString()}
          </span>
          <span className="text-muted-foreground ml-1">night</span>
        </div>
      </div>
    </Link>
  );
}
