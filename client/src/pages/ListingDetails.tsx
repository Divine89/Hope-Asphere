import { useParams } from "wouter";
import { useState } from "react";
import { useListing } from "@/hooks/use-listings";
import { useCreateBooking } from "@/hooks/use-bookings";
import { useAuth } from "@/hooks/use-auth";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { DateRange } from "react-day-picker";
import { differenceInDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Star, CheckCircle2, ChevronLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

export default function ListingDetails() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: listing, isLoading } = useListing(parseInt(id));
  const createBooking = useCreateBooking();
  
  const [date, setDate] = useState<DateRange | undefined>();

  const days = date?.from && date?.to ? differenceInDays(date.to, date.from) : 0;
  const price = listing?.pricePerNight ? (listing.pricePerNight / 100) : 0;
  const total = days * price;
  const serviceFee = Math.round(total * 0.1);

  const handleBook = () => {
    if (!date?.from || !date?.to) {
      toast({ title: "Select dates", description: "Please select check-in and check-out dates.", variant: "destructive" });
      return;
    }
    if (!user) {
      window.location.href = "/api/login";
      return;
    }
    if (!listing) return;

    createBooking.mutate({
      listingId: listing.id,
      guestId: user.id,
      checkIn: date.from,
      checkOut: date.to,
      totalPrice: (total + serviceFee) * 100, // Convert to cents
      status: "confirmed"
    });
  };

  if (isLoading) {
    return <div className="min-h-screen pt-28 flex justify-center"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (!listing) {
    return <div className="min-h-screen pt-28 text-center text-xl font-bold">Listing not found.</div>;
  }

  const imageUrl = listing.images && listing.images.length > 0 
    ? listing.images[0] 
    : "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1200&q=80";

  return (
    <div className="min-h-screen bg-background pt-28 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Section */}
        <div className="mb-6">
          <Button variant="ghost" className="mb-4 pl-0 hover:bg-transparent text-muted-foreground" onClick={() => window.history.back()}>
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-2">{listing.title}</h1>
          <div className="flex items-center text-muted-foreground text-sm font-medium">
            <Star className="w-4 h-4 text-primary fill-primary mr-1" />
            <span className="text-foreground mr-1">4.98</span>
            <span className="mx-2">•</span>
            <MapPin className="w-4 h-4 mr-1" />
            <span className="underline">{listing.address}, {listing.city}</span>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="relative w-full aspect-[21/9] sm:aspect-[2.5/1] rounded-3xl overflow-hidden mb-12 bg-muted">
          <img src={imageUrl} alt={listing.title} className="w-full h-full object-cover" />
        </div>

        {/* Content Layout */}
        <div className="grid lg:grid-cols-[2fr_1fr] gap-12">
          
          {/* Left Column */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold">Entire home hosted by {listing.hostId.slice(0,6)}</h2>
                <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                  <span className="flex items-center"><Users className="w-4 h-4 mr-1"/> {listing.maxGuests} guests</span>
                </div>
              </div>
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center border-2 border-primary/20">
                <span className="font-bold text-primary text-xl">H</span>
              </div>
            </div>

            <Separator className="my-8" />

            <div className="prose prose-slate max-w-none text-muted-foreground">
              <p className="leading-relaxed text-lg">{listing.description}</p>
            </div>

            <Separator className="my-8" />

            <h3 className="text-xl font-bold mb-6">What this place offers</h3>
            <div className="grid grid-cols-2 gap-y-4 gap-x-8">
              {listing.amenities && listing.amenities.length > 0 ? (
                listing.amenities.map((amenity, i) => (
                  <div key={i} className="flex items-center text-muted-foreground font-medium">
                    <CheckCircle2 className="w-5 h-5 mr-3 text-primary" />
                    {amenity}
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-muted-foreground">Standard amenities included.</div>
              )}
            </div>
          </div>

          {/* Right Column - Booking Widget */}
          <div className="relative">
            <div className="sticky top-28 bg-card border border-border/50 shadow-xl shadow-black/5 rounded-3xl p-6 lg:p-8">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <span className="text-2xl font-extrabold">${price}</span>
                  <span className="text-muted-foreground ml-1">night</span>
                </div>
              </div>

              <div className="mb-6">
                <label className="text-sm font-bold mb-2 block">Dates</label>
                <DatePickerWithRange date={date} setDate={setDate} />
              </div>

              <Button 
                size="lg" 
                className="w-full h-14 rounded-xl text-lg font-bold shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all"
                onClick={handleBook}
                disabled={createBooking.isPending}
              >
                {createBooking.isPending ? "Confirming..." : "Reserve"}
              </Button>

              <p className="text-center text-sm text-muted-foreground mt-4 mb-6">You won't be charged yet</p>

              {days > 0 && (
                <div className="space-y-4 text-sm border-t border-border pt-6">
                  <div className="flex justify-between">
                    <span className="underline">${price} x {days} nights</span>
                    <span>${total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="underline">Cleaning fee</span>
                    <span>$0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="underline">Service fee</span>
                    <span>${serviceFee}</span>
                  </div>
                  <Separator className="my-4" />
                  <div className="flex justify-between font-bold text-base">
                    <span>Total</span>
                    <span>${total + serviceFee}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
