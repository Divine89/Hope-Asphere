import { useState } from "react";
import { useCreateListing } from "@/hooks/use-listings";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Home, Image as ImageIcon } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function CreateListing() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const createListing = useCreateListing();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    pricePerNight: "",
    maxGuests: "",
    city: "",
    address: "",
    image: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    createListing.mutate({
      hostId: user.id,
      title: formData.title,
      description: formData.description,
      pricePerNight: parseInt(formData.pricePerNight) * 100, // to cents
      maxGuests: parseInt(formData.maxGuests),
      city: formData.city,
      address: formData.address,
      images: formData.image ? [formData.image] : [],
      amenities: ["Wifi", "Kitchen", "Free parking"],
      lat: "0", lng: "0"
    }, {
      onSuccess: () => {
        setLocation("/");
      }
    });
  };

  return (
    <div className="min-h-screen bg-muted/20 pt-28 pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="bg-card p-8 sm:p-10 rounded-3xl border border-border/50 shadow-xl shadow-black/5">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
            <Home className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-extrabold mb-2">Host your home</h1>
          <p className="text-muted-foreground mb-8 text-lg">Earn extra income and unlock new opportunities by sharing your space.</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-bold">Listing Title</Label>
              <Input id="title" required placeholder="e.g. Cozy Loft in Downtown" className="h-12 rounded-xl input-ring"
                value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="city" className="text-sm font-bold">City</Label>
                <Input id="city" required placeholder="e.g. New York" className="h-12 rounded-xl input-ring"
                  value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-bold">Address</Label>
                <Input id="address" required placeholder="123 Main St" className="h-12 rounded-xl input-ring"
                  value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-sm font-bold">Price per night ($)</Label>
                <Input id="price" required type="number" min="1" placeholder="e.g. 150" className="h-12 rounded-xl input-ring"
                  value={formData.pricePerNight} onChange={e => setFormData({...formData, pricePerNight: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="guests" className="text-sm font-bold">Max Guests</Label>
                <Input id="guests" required type="number" min="1" placeholder="e.g. 4" className="h-12 rounded-xl input-ring"
                  value={formData.maxGuests} onChange={e => setFormData({...formData, maxGuests: e.target.value})} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image" className="text-sm font-bold">Image URL (Optional)</Label>
              <div className="relative">
                <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input id="image" type="url" placeholder="https://unsplash.com/..." className="h-12 pl-12 rounded-xl input-ring"
                  value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-bold">Description</Label>
              <Textarea id="description" required placeholder="Describe what makes your place special..." className="h-32 rounded-xl resize-none input-ring p-4"
                value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>

            <Button 
              type="submit" 
              size="lg" 
              className="w-full h-14 rounded-xl text-lg shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all"
              disabled={createListing.isPending}
            >
              {createListing.isPending ? "Publishing..." : "Publish Listing"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
