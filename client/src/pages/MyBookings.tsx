import { useBookings } from "@/hooks/use-bookings";
import { format } from "date-fns";
import { MapPin, Calendar, CheckCircle } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function MyBookings() {
  const { data: bookings, isLoading } = useBookings();

  if (isLoading) {
    return <div className="min-h-screen pt-28 flex justify-center"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen bg-background pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold mb-8">Trips</h1>
        
        {!bookings || bookings.length === 0 ? (
          <div className="bg-card p-8 rounded-3xl border border-border/50 text-center py-16 shadow-sm">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold mb-2">No trips booked... yet!</h2>
            <p className="text-muted-foreground mb-8">Time to dust off your bags and start planning your next adventure.</p>
            <Link href="/">
              <Button size="lg" className="rounded-full px-8">Start Searching</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <Link key={booking.id} href={`/listing/${booking.listingId}`}>
                <div className="flex flex-col sm:flex-row bg-card border border-border/50 rounded-3xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="w-full sm:w-64 h-48 sm:h-auto bg-muted shrink-0">
                    <img 
                      src={booking.listing.images?.[0] || "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800"} 
                      alt={booking.listing.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6 sm:p-8 flex flex-col justify-between flex-1">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-primary uppercase tracking-wider bg-primary/10 px-2.5 py-1 rounded-full flex items-center inline-flex">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {booking.status}
                        </span>
                        <span className="text-sm font-bold text-muted-foreground">
                          ${(booking.totalPrice / 100).toLocaleString()}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-foreground mt-3">{booking.listing.city}</h3>
                      <p className="text-muted-foreground text-sm mb-4">{booking.listing.title}</p>
                    </div>
                    
                    <div className="flex items-center text-sm font-medium border-t border-border pt-4">
                      <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span>{format(booking.checkIn, "MMM dd")} - {format(booking.checkOut, "MMM dd, yyyy")}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
