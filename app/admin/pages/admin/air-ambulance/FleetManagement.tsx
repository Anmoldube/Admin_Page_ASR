import { useEffect, useState } from "react";
import { AdminLayout } from "@admin/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
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
  Edit,
  MapPin,
  Plane,
  Heart,
  Settings,
} from "lucide-react";

// Minimal shape from API
type FleetDoc = {
  _id: string;
  name: string;
  model: string;
  capacity: number;
  range?: string;
  speed?: string;
  pricePerHour?: number;
  description?: string;
  image?: string;
  status?: string; // available | maintenance | booked
  isActive?: boolean;
};

const FleetManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("all");
  const [selectedAircraft, setSelectedAircraft] = useState<FleetDoc | null>(null);
  const [items, setItems] = useState<FleetDoc[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    model: "",
    capacity: "",
    range: "",
    speed: "",
    pricePerHour: "",
    description: "",
    image: "",
    isActive: true,
  });

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/fleet/air-ambulance');
      if (!res.ok) throw new Error(`Failed to load (HTTP ${res.status})`);
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (e: any) {
      toast({ title: 'Load failed', description: e?.message || 'Unable to load fleet', variant: 'destructive' as any });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filteredAircraft = items.filter((aircraft) => {
    const matchesSearch =
      aircraft.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aircraft.model?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || aircraft.model === typeFilter;
    const matchesAvailability = availabilityFilter === "all" || (aircraft.status || 'available') === availabilityFilter;
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
          <Button className="gap-2 gold-gradient text-accent-foreground" onClick={() => setIsDialogOpen(true)}>
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
                  <p className="text-2xl font-bold">{items.length}</p>
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
                    {items.filter(a => (a.status || 'available') === 'available').length}
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
                    {items.filter(a => (a.status || 'available') === 'booked').length}
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
                    {items.filter(a => (a.status || 'available') === 'maintenance').length}
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
              key={(aircraft as any)._id || (aircraft as any).id}
              className="border-border hover:shadow-lg transition-all cursor-pointer group"
              onClick={() => setSelectedAircraft(aircraft)}
            >
              <CardContent className="p-0">
                {/* Image */}
                <div className="relative h-40 bg-secondary/50 rounded-t-lg overflow-hidden">
                  <Carousel className="w-full h-full" autoPlay autoPlayInterval={4000}>
                    <CarouselContent className="h-40">
                      {(() => {
                        const imgs = Array.from(new Set([
                          (aircraft as any).images?.outside,
                          (aircraft as any).images?.inside,
                          (aircraft as any).images?.seats,
                          (aircraft as any).images?.extra,
                          (aircraft as any).image,
                        ].filter(Boolean) as string[]))
                        const listBase = imgs.length > 0 ? imgs : ["/placeholder.jpg"]
const list = listBase.length === 1 ? [listBase[0], listBase[0]] : listBase
                        return list.map((src, idx) => (
                          <CarouselItem key={idx} className="h-40">
                            <img src={src} alt={`${aircraft.name} ${idx+1}`} className="w-full h-full object-cover" />
                          </CarouselItem>
                        ))
                      })()}
                    </CarouselContent>
                    <CarouselPrevious className="left-2 bg-white/80 hover:bg-white" />
                    <CarouselNext className="right-2 bg-white/80 hover:bg-white" />
                  </Carousel>
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
                    {(aircraft as any).medicalConfig?.icu && (
                      <Badge variant="outline" className="text-xs">ICU</Badge>
                    )}
                    {(aircraft as any).medicalConfig?.ventilator && (
                      <Badge variant="outline" className="text-xs">Ventilator</Badge>
                    )}
                    {(aircraft as any).medicalConfig?.doctorOnboard && (
                      <Badge variant="outline" className="text-xs">Doctor</Badge>
                    )}
                    {(aircraft as any).medicalConfig?.nurseOnboard && (
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
        {/* Create Aircraft Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add Air Ambulance Aircraft</DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="Name" value={form.name} onChange={e => setForm(s => ({...s, name: e.target.value}))} />
              <Input placeholder="Model" value={form.model} onChange={e => setForm(s => ({...s, model: e.target.value}))} />
              <Input placeholder="Capacity" value={form.capacity} onChange={e => setForm(s => ({...s, capacity: e.target.value}))} />
              <Input placeholder="Range (e.g. 2100 nm)" value={form.range} onChange={e => setForm(s => ({...s, range: e.target.value}))} />
              <Input placeholder="Speed (e.g. 441 kt)" value={form.speed} onChange={e => setForm(s => ({...s, speed: e.target.value}))} />
              <Input placeholder="Price per hour" value={form.pricePerHour} onChange={e => setForm(s => ({...s, pricePerHour: e.target.value}))} />
              <Input placeholder="Outside Image URL" className="col-span-2" value={(form as any).imageOutside || ''} onChange={e => setForm(s => ({...s, imageOutside: e.target.value}))} />
              <Input placeholder="Inside Image URL" className="col-span-2" value={(form as any).imageInside || ''} onChange={e => setForm(s => ({...s, imageInside: e.target.value}))} />
              <Input placeholder="Seats Image URL" className="col-span-2" value={(form as any).imageSeats || ''} onChange={e => setForm(s => ({...s, imageSeats: e.target.value}))} />
              <Input placeholder="Extra Image URL (optional)" className="col-span-2" value={(form as any).imageExtra || ''} onChange={e => setForm(s => ({...s, imageExtra: e.target.value}))} />
              <Input placeholder="Description" className="col-span-2" value={form.description} onChange={e => setForm(s => ({...s, description: e.target.value}))} />
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button
                className="gold-gradient text-accent-foreground"
                onClick={async () => {
                  try {
                    const payload = {
                      name: form.name,
                      model: form.model,
                      capacity: parseInt(String(form.capacity || '0'), 10),
                      range: form.range,
                      speed: form.speed,
                      pricePerHour: Number(String(form.pricePerHour).replace(/[^0-9.]/g, '')) || 0,
                      description: form.description,
                      image: form.image,
                      status: 'available',
                      isActive: true,
                    };

                    const res = await fetch('/api/fleet/air-ambulance', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(payload),
                    });

                    if (!res.ok) {
                      const err = await res.json().catch(() => ({}));
                      throw new Error(err?.error || `Create failed (HTTP ${res.status})`);
                    }

                    const created = await res.json();
                    setItems(prev => [created, ...prev]);
                    setIsDialogOpen(false);
                    setForm({ name: '', model: '', capacity: '', range: '', speed: '', pricePerHour: '', description: '', image: '', isActive: true });
                    toast({ title: 'Added', description: 'Aircraft saved to database.' });
                  } catch (e: any) {
                    toast({ title: 'Add failed', description: e?.message || 'Unable to add aircraft', variant: 'destructive' as any });
                  }
                }}
              >
                Save
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default FleetManagement;
