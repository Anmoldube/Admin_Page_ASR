import { useState } from "react";
import { AdminLayout } from "@admin/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MapPin,
  Plane,
  Clock,
  IndianRupee,
  Filter,
  Navigation,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { airAmbulanceAircraft, indianCities, type AirAmbulanceAircraft } from "@admin/data/airAmbulanceData";
import { cn } from "@/lib/utils";

const MapView = () => {
  const [sourceCity, setSourceCity] = useState("");
  const [destinationCity, setDestinationCity] = useState("");
  const [selectedAircraft, setSelectedAircraft] = useState<AirAmbulanceAircraft | null>(null);
  const [typeFilter, setTypeFilter] = useState("all");
  const [capabilityFilter, setCapabilityFilter] = useState("all");

  const filteredAircraft = airAmbulanceAircraft.filter((aircraft) => {
    const matchesType = typeFilter === "all" || aircraft.type === typeFilter;
    const matchesCapability =
      capabilityFilter === "all" ||
      (capabilityFilter === "icu" && aircraft.medicalConfig.icu) ||
      (capabilityFilter === "ventilator" && aircraft.medicalConfig.ventilator);
    const isAvailable = aircraft.availability === "Available" || aircraft.availability === "Standby";
    return matchesType && matchesCapability && isAvailable;
  });

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c);
  };

  const getSourceCoords = () => {
    const city = indianCities.find(c => c.name === sourceCity);
    return city || null;
  };

  const getSortedAircraft = () => {
    if (!sourceCity) return filteredAircraft;
    
    const sourceCoords = getSourceCoords();
    if (!sourceCoords) return filteredAircraft;

    return [...filteredAircraft].sort((a, b) => {
      const distA = calculateDistance(sourceCoords.lat, sourceCoords.lng, a.coordinates.lat, a.coordinates.lng);
      const distB = calculateDistance(sourceCoords.lat, sourceCoords.lng, b.coordinates.lat, b.coordinates.lng);
      return distA - distB;
    });
  };

  const estimatePrice = (aircraft: AirAmbulanceAircraft) => {
    if (!sourceCity || !destinationCity) return null;
    
    const source = indianCities.find(c => c.name === sourceCity);
    const dest = indianCities.find(c => c.name === destinationCity);
    if (!source || !dest) return null;

    const routeDistance = calculateDistance(source.lat, source.lng, dest.lat, dest.lng);
    const positioningDistance = calculateDistance(aircraft.coordinates.lat, aircraft.coordinates.lng, source.lat, source.lng);
    
    const baseCost = routeDistance * 150;
    const positioningCost = positioningDistance * 100;
    const medicalCost = 
      (aircraft.medicalConfig.icu ? 25000 : 0) +
      (aircraft.medicalConfig.ventilator ? 15000 : 0) +
      (aircraft.medicalConfig.doctorOnboard ? 20000 : 0) +
      (aircraft.medicalConfig.nurseOnboard ? 10000 : 0);
    const margin = (baseCost + positioningCost + medicalCost) * 0.15;
    const total = baseCost + positioningCost + medicalCost + margin;

    return {
      baseCost: Math.round(baseCost),
      positioningCost: Math.round(positioningCost),
      medicalCost: Math.round(medicalCost),
      margin: Math.round(margin),
      total: Math.round(total),
      routeDistance,
      positioningDistance,
      estimatedTime: Math.round((routeDistance + positioningDistance) / aircraft.speed * 60),
    };
  };

  const sortedAircraft = getSortedAircraft();

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Live Map & Route Planner</h1>
          <p className="text-muted-foreground">Track aircraft and plan routes in real-time</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Placeholder */}
          <div className="lg:col-span-2">
            <Card className="border-border h-[500px]">
              <CardContent className="p-0 h-full">
                <div className="relative w-full h-full bg-secondary/30 rounded-lg overflow-hidden">
                  {/* India Map SVG Placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                      <p className="text-lg font-medium text-muted-foreground">Interactive India Map</p>
                      <p className="text-sm text-muted-foreground/70">Aircraft positions & routes will display here</p>
                      <p className="text-xs text-muted-foreground/50 mt-2">Mapbox integration ready</p>
                    </div>
                  </div>

                  {/* Aircraft Markers (simulated positions) */}
                  {airAmbulanceAircraft.map((aircraft, index) => (
                    <div
                      key={aircraft.id}
                      className={cn(
                        "absolute w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all hover:scale-125 shadow-lg",
                        aircraft.availability === "Available" && "bg-success",
                        aircraft.availability === "On Mission" && "bg-warning",
                        aircraft.availability === "Maintenance" && "bg-destructive",
                        aircraft.availability === "Standby" && "bg-blue-500",
                      )}
                      style={{
                        left: `${20 + (index * 12) % 60}%`,
                        top: `${20 + (index * 15) % 50}%`,
                      }}
                      onClick={() => setSelectedAircraft(aircraft)}
                    >
                      <Plane className="w-4 h-4 text-white" />
                    </div>
                  ))}

                  {/* Legend */}
                  <div className="absolute bottom-4 left-4 bg-card/95 backdrop-blur-sm p-3 rounded-lg border border-border">
                    <p className="text-xs font-medium mb-2">Legend</p>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-success" />
                        <span className="text-xs">Available</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-warning" />
                        <span className="text-xs">On Mission</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                        <span className="text-xs">Standby</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-destructive" />
                        <span className="text-xs">Maintenance</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Route Panel */}
          <div className="space-y-4">
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Navigation className="w-4 h-4" />
                  Route Planner
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Source City</Label>
                  <Select value={sourceCity} onValueChange={setSourceCity}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      {indianCities.map((city) => (
                        <SelectItem key={city.name} value={city.name}>
                          {city.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Destination City</Label>
                  <Select value={destinationCity} onValueChange={setDestinationCity}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select destination" />
                    </SelectTrigger>
                    <SelectContent>
                      {indianCities.map((city) => (
                        <SelectItem key={city.name} value={city.name}>
                          {city.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {sourceCity && destinationCity && (
                  <div className="p-3 bg-secondary/50 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                      <span>{sourceCity}</span>
                      <ArrowRight className="w-4 h-4" />
                      <span>{destinationCity}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Filters */}
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Aircraft Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Fixed Wing">Fixed Wing</SelectItem>
                    <SelectItem value="Helicopter">Helicopter</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={capabilityFilter} onValueChange={setCapabilityFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Medical Capability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Capabilities</SelectItem>
                    <SelectItem value="icu">ICU Required</SelectItem>
                    <SelectItem value="ventilator">Ventilator Required</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Available Aircraft */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Plane className="w-5 h-5" />
                Available Aircraft
                {sourceCity && <span className="text-sm font-normal text-muted-foreground">(sorted by distance from {sourceCity})</span>}
              </span>
              <Badge variant="outline">{filteredAircraft.length} available</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedAircraft.map((aircraft) => {
                const pricing = estimatePrice(aircraft);
                const sourceCoords = getSourceCoords();
                const distanceFromSource = sourceCoords
                  ? calculateDistance(sourceCoords.lat, sourceCoords.lng, aircraft.coordinates.lat, aircraft.coordinates.lng)
                  : null;

                return (
                  <Card
                    key={aircraft.id}
                    className={cn(
                      "border-border cursor-pointer transition-all hover:shadow-lg",
                      selectedAircraft?.id === aircraft.id && "ring-2 ring-accent"
                    )}
                    onClick={() => setSelectedAircraft(aircraft)}
                  >
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold">{aircraft.name}</h4>
                          <p className="text-sm text-accent">{aircraft.registration}</p>
                        </div>
                        <Badge
                          className={cn(
                            aircraft.availability === "Available" && "bg-success/20 text-success",
                            aircraft.availability === "Standby" && "bg-blue-500/20 text-blue-600"
                          )}
                        >
                          {aircraft.availability}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{aircraft.baseLocation}</span>
                        {distanceFromSource !== null && (
                          <span className="text-accent font-medium">({distanceFromSource} km away)</span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {aircraft.medicalConfig.icu && (
                          <Badge variant="outline" className="text-xs">ICU</Badge>
                        )}
                        {aircraft.medicalConfig.ventilator && (
                          <Badge variant="outline" className="text-xs">Ventilator</Badge>
                        )}
                        {aircraft.medicalConfig.doctorOnboard && (
                          <Badge variant="outline" className="text-xs">Doctor</Badge>
                        )}
                      </div>

                      {pricing && (
                        <div className="pt-3 border-t border-border space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Est. Time</span>
                            <span className="font-medium">{pricing.estimatedTime} mins</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Est. Price</span>
                            <span className="font-bold text-lg flex items-center">
                              <IndianRupee className="w-4 h-4" />
                              {(pricing.total / 1000).toFixed(0)}K
                            </span>
                          </div>
                        </div>
                      )}

                      <Button className="w-full gold-gradient text-accent-foreground" size="sm">
                        Select Aircraft
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default MapView;
