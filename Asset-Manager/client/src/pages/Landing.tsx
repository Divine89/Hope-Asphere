import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, ShieldCheck, Star } from "lucide-react";
import { motion } from "framer-motion";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-background -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl"
            >
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-6">
                <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse" />
                Redefining the way you travel
              </div>
              <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1] mb-6">
                Find your next <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-foreground">
                  perfect stay.
                </span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Discover exceptional homes, apartments, and unique spaces around the globe. 
                Experience travel the way it was meant to be—comfortable, authentic, and unforgettable.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="rounded-xl h-14 px-8 text-base shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-1 transition-all"
                  onClick={() => window.location.href = "/api/login"}
                >
                  Start Exploring
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="rounded-xl h-14 px-8 text-base border-2 hover:bg-muted/50"
                  onClick={() => window.location.href = "/api/login"}
                >
                  Become a Host
                </Button>
              </div>
              
              <div className="mt-10 flex items-center gap-4 text-sm text-muted-foreground font-medium">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-muted flex items-center justify-center overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                    </div>
                  ))}
                </div>
                <p>Trusted by 10,000+ travelers</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative lg:h-[600px] rounded-[2.5rem] overflow-hidden shadow-2xl"
            >
              {/* landing page hero scenic modern architecture house */}
              <img 
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80" 
                alt="Modern luxury home" 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Floating Badge */}
              <div className="absolute bottom-8 left-8 right-8 glass bg-white/10 p-6 rounded-2xl backdrop-blur-md border border-white/20 text-white">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-lg">Villa Serenity</h3>
                    <p className="text-white/80 text-sm">Bali, Indonesia</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-xl">$350<span className="text-sm font-normal text-white/80">/night</span></p>
                    <div className="flex items-center justify-end text-yellow-400 mt-1">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="ml-1 text-sm font-bold text-white">4.98</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground">Why choose Home-Asphere?</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">
              We provide the highest quality stays with zero compromises on security, comfort, or style.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-3xl border border-border/50 card-hover">
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
                <MapPin className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Prime Locations</h3>
              <p className="text-muted-foreground leading-relaxed">
                Stay in the heart of the city or escape to remote getaways. We carefully curate properties in the best neighborhoods.
              </p>
            </div>
            
            <div className="bg-card p-8 rounded-3xl border border-border/50 card-hover">
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
                <Star className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Quality Assured</h3>
              <p className="text-muted-foreground leading-relaxed">
                Every host and property is vetted. Read genuine reviews from verified guests before you book.
              </p>
            </div>
            
            <div className="bg-card p-8 rounded-3xl border border-border/50 card-hover">
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Secure Booking</h3>
              <p className="text-muted-foreground leading-relaxed">
                Your payments are protected. 24/7 global customer support ensures you have peace of mind anywhere you go.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 border-t border-border bg-card text-center text-muted-foreground">
        <p className="font-medium">© 2024 Home-Asphere Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}
