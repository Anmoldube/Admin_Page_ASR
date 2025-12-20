import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plane, Calendar, ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-aviation-navy">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center space-y-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-accent rounded-2xl mb-6">
            <Plane className="w-10 h-10 text-accent-foreground" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground">
            ASR AVIATION
          </h1>
          
          <p className="text-xl md:text-2xl text-primary-foreground/80 max-w-2xl mx-auto">
            Premium Private Jet Charter Services
          </p>
          
          <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/admin/fleet">
              <Button 
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 px-8 py-6 text-lg"
              >
                <Plane className="w-5 h-5 mr-2" />
                Fleet Management
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            
            <Link to="/admin/leg-deals">
              <Button 
                size="lg"
                variant="outline"
                className="bg-transparent border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary px-8 py-6 text-lg"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Leg Deals Admin
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
          
          <div className="pt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="p-6 bg-card/10 backdrop-blur-sm rounded-lg border border-primary-foreground/20">
              <h3 className="text-lg font-semibold text-primary-foreground mb-2">Fleet Control</h3>
              <p className="text-primary-foreground/70">Manage your entire aircraft fleet with detailed specifications and availability</p>
            </div>
            
            <div className="p-6 bg-card/10 backdrop-blur-sm rounded-lg border border-primary-foreground/20">
              <h3 className="text-lg font-semibold text-primary-foreground mb-2">Empty Leg Deals</h3>
              <p className="text-primary-foreground/70">Create and manage empty leg flight opportunities for customers</p>
            </div>
            
            <div className="p-6 bg-card/10 backdrop-blur-sm rounded-lg border border-primary-foreground/20">
              <h3 className="text-lg font-semibold text-primary-foreground mb-2">Live Updates</h3>
              <p className="text-primary-foreground/70">All changes sync in real-time to your customer-facing platform</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
