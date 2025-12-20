import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Plus,
  Eye,
  Edit,
  MapPin,
  Plane,
  Heart,
  Stethoscope,
  Settings,
  Filter,
} from "lucide-react";
import { airAmbulanceAircraft, type AirAmbulanceAircraft } from "@/data/airAmbulanceData";
import { cn } from "@/lib/utils";

const FleetManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("all");
  const [selectedAircraft, setSelectedAircraft] = useState<AirAmbulanceAircraft | null>(null);

  const filteredAircraft = airAmbulanceAircraft.filter((aircraft) => {
    const matchesSearch =
      aircraft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aircraft.registration.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aircraft.baseLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aircraft.operatorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || aircraft.type === typeFilter;
    const matchesAvailability = availabilityFilter === "all" || aircraft.availability === availabilityFilter;
    return matchesSearch && matchesType && matchesAvailability;
  });

  const getAvailabilityBadge = (status: string) => {
    const config = {
      Available: "bg-success/20 text-success border-success/30",
      "On Mission": "bg-warning/20 text-warning border-warning/30",
      Maintenance: "bg-destructive/20 text-destructive border-destructive/30",
      Standby: "bg-blue-500/20 text-blue-600 border-blue-500/30",
    };
    return config[status as keyof typeof config] || "";
  };

  const getComplianceBadge = (status: string) => {
    const config = {
      Valid: "bg-success/20 text-success",
      Expiring: "bg-warning/20 text-warning",
      Expired: "bg-destructive/20 text-destructive",
    };
    return config[status as keyof typeof config] || "";
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Fleet Management</h1>
            <p className="text-muted-foreground">Air ambulance aircraft registry and status</p>
          </div>
          <Button className="gap-2 gold-gradient text-accent-foreground">
            <Plus className="w-4 h-4" />
            Add Aircraft
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Fleet</p>
                  <p className="text-2xl font-bold">{airAmbulanceAircraft.length}</p>
                </div>
                <Plane className="w-8 h-8 text-primary opacity-50" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Available</p>
                  <p className="text-2xl font-bold text-success">
                    {airAmbulanceAircraft.filter(a => a.availability === "Available").length}
                  </p>
                </div>
                <div className="w-3 h-3 bg-success rounded-full" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">On Mission</p>
                  <p className="text-2xl font-bold text-warning">
                    {airAmbulanceAircraft.filter(a => a.availability === "On Mission").length}
                  </p>
                </div>
                <div className="w-3 h-3 bg-warning rounded-full" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Maintenance</p>
                  <p className="text-2xl font-bold text-destructive">
                    {airAmbulanceAircraft.filter(a => a.availability === "Maintenance").length}
                  </p>
                </div>
                <div className="w-3 h-3 bg-destructive rounded-full" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, registration, location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Aircraft type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Fixed Wing">Fixed Wing</SelectItem>
                  <SelectItem value="Helicopter">Helicopter</SelectItem>
                </SelectContent>
              </Select>
              <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="On Mission">On Mission</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                  <SelectItem value="Standby">Standby</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Aircraft Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAircraft.map((aircraft) => (
            <Card
              key={aircraft.id}
              className="border-border hover:shadow-lg transition-all cursor-pointer group"
              onClick={() => setSelectedAircraft(aircraft)}
            >
              <CardContent className="p-0">
                {/* Image */}
                <div className="relative h-40 bg-secondary/50 rounded-t-lg overflow-hidden">
                  <img
                    src={aircraft.image}
                    alt={aircraft.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className={getAvailabilityBadge(aircraft.availability)}>
                      {aircraft.availability}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3">
                    <Badge variant="outline" className="bg-background/80">
                      {aircraft.type}
                    </Badge>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">{aircraft.name}</h3>
                      <p className="text-sm text-accent font-medium">{aircraft.registration}</p>
                    </div>
                    <Badge className={getComplianceBadge(aircraft.complianceStatus)}>
                      {aircraft.complianceStatus}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{aircraft.baseLocation}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Heart className="w-4 h-4" />
                    <span>{aircraft.operatorName}</span>
                  </div>

                  {/* Medical Capabilities */}
                  <div className="flex flex-wrap gap-1 pt-2 border-t border-border">
                    {aircraft.medicalConfig.icu && (
                      <Badge variant="outline" className="text-xs">ICU</Badge>
                    )}
                    {aircraft.medicalConfig.ventilator && (
                      <Badge variant="outline" className="text-xs">Ventilator</Badge>
                    )}
                    {aircraft.medicalConfig.doctorOnboard && (
                      <Badge variant="outline" className="text-xs">Doctor</Badge>
                    )}
                    {aircraft.medicalConfig.nurseOnboard && (
                      <Badge variant="outline" className="text-xs">Nurse</Badge>
                    )}
                  </div>

                  {/* Specs */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border text-xs">
                    <div>
                      <span className="text-muted-foreground">Range</span>
                      <p className="font-medium">{aircraft.range} km</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Speed</span>
                      <p className="font-medium">{aircraft.speed} km/h</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Aircraft Detail Dialog */}
        <Dialog open={!!selectedAircraft} onOpenChange={() => setSelectedAircraft(null)}>
          <DialogContent className="max-w-2xl">
            {selectedAircraft && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3">
                    <span>{selectedAircraft.name}</span>
                    <Badge className={getAvailabilityBadge(selectedAircraft.availability)}>
                      {selectedAircraft.availability}
                    </Badge>
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="h-48 bg-secondary/50 rounded-lg overflow-hidden">
                    <img
                      src={selectedAircraft.image}
                      alt={selectedAircraft.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <span className="text-xs text-muted-foreground">Registration</span>
                        <p className="font-medium">{selectedAircraft.registration}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Type</span>
                        <p className="font-medium">{selectedAircraft.type}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Base Location</span>
                        <p className="font-medium">{selectedAircraft.baseLocation}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Airport</span>
                        <p className="font-medium text-sm">{selectedAircraft.baseAirport}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <span className="text-xs text-muted-foreground">Operator</span>
                        <p className="font-medium">{selectedAircraft.operatorName}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Range</span>
                        <p className="font-medium">{selectedAircraft.range} km</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Speed</span>
                        <p className="font-medium">{selectedAircraft.speed} km/h</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Compliance</span>
                        <Badge className={getComplianceBadge(selectedAircraft.complianceStatus)}>
                          {selectedAircraft.complianceStatus}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <span className="text-sm font-medium">Medical Configuration</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedAircraft.medicalConfig.icu && (
                        <Badge className="bg-destructive/10 text-destructive">ICU Setup</Badge>
                      )}
                      {selectedAircraft.medicalConfig.ventilator && (
                        <Badge className="bg-destructive/10 text-destructive">Ventilator</Badge>
                      )}
                      {selectedAircraft.medicalConfig.doctorOnboard && (
                        <Badge className="bg-primary/10 text-primary">Doctor Onboard</Badge>
                      )}
                      {selectedAircraft.medicalConfig.nurseOnboard && (
                        <Badge className="bg-primary/10 text-primary">Nurse Onboard</Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button variant="outline">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Details
                    </Button>
                    <Button variant="outline">
                      <Settings className="w-4 h-4 mr-2" />
                      Update Status
                    </Button>
                    <Button className="gold-gradient text-accent-foreground">
                      View on Map
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default FleetManagement;
