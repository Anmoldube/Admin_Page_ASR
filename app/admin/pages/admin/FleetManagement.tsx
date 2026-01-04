import { useEffect, useState } from "react";
import { AdminLayout } from "@admin/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Upload,
  Plane,
  Search,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Users,
  Gauge,
  Navigation,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Aircraft {
  id: string;
  name: string;
  type: string;
  manufacturer: string;
  seats: number;
  range: string;
  speed: string;
  description: string;
  imageUrl: string;
  images?: {
    outside?: string;
    inside?: string;
    seats?: string;
    extra?: string;
  };
  available: boolean;
  visibleOnB2C: boolean;
  bookingEnabled: boolean;
  operator: string;
  pricePerHour: string;
}

// Load from API instead of static dummy data
/*
  {
    id: "AC001",
    name: "Citation 560XL",
    type: "Midsize Jet",
    manufacturer: "Cessna",
    seats: 8,
    range: "3,460 nm",
    speed: "528 mph",
    description: "The Citation Excel is a versatile midsize business jet known for its comfort and performance.",
    imageUrl: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&auto=format&fit=crop",
    available: true,
    visibleOnB2C: true,
    bookingEnabled: true,
    operator: "JetSet Aviation",
    pricePerHour: "₹2,50,000",
  },
  {
    id: "AC002",
    name: "Gulfstream G650",
    type: "Large Cabin Jet",
    manufacturer: "Gulfstream",
    seats: 14,
    range: "7,000 nm",
    speed: "610 mph",
    description: "The G650 is a flagship ultra-long-range business jet with unmatched comfort and speed.",
    imageUrl: "https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=800&auto=format&fit=crop",
    available: true,
    visibleOnB2C: true,
    bookingEnabled: true,
    operator: "Elite Wings",
    pricePerHour: "₹5,50,000",
  },
  {
    id: "AC003",
    name: "Bombardier Global 7500",
    type: "Ultra Long Range",
    manufacturer: "Bombardier",
    seats: 19,
    range: "7,700 nm",
    speed: "590 mph",
    description: "The world's largest and longest-range purpose-built business jet.",
    imageUrl: "https://images.unsplash.com/photo-1583395838144-09e18eb51d3e?w=800&auto=format&fit=crop",
    available: false,
    visibleOnB2C: false,
    bookingEnabled: false,
    operator: "SkyHigh Charters",
    pricePerHour: "₹7,00,000",
  },
  {
    id: "AC004",
    name: "Pilatus PC-12",
    type: "Turboprop",
    manufacturer: "Pilatus",
    seats: 6,
    range: "1,845 nm",
    speed: "285 mph",
    description: "A versatile single-engine turboprop aircraft ideal for short regional flights.",
    imageUrl: "https://images.unsplash.com/photo-1559628233-100c798642d4?w=800&auto=format&fit=crop",
    available: true,
    visibleOnB2C: true,
    bookingEnabled: true,
    operator: "AirLux Services",
    pricePerHour: "₹1,20,000",
  },
];
*/

const FleetManagement = () => {
  const { toast } = useToast();
  const [aircraft, setAircraft] = useState<Aircraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const res = await fetch('/api/fleet/charter');
        if (!res.ok) throw new Error('Failed to load fleet');
        const items = await res.json();
        const mapped: Aircraft[] = (Array.isArray(items) ? items : []).map((f:any) => {
          const primary = f?.image || f?.images?.outside || f?.images?.inside || f?.images?.seats || f?.images?.extra || '/placeholder.jpg';
          return {
            id: f._id,
            name: f.name || f.model || 'Aircraft',
            type: f.model || '',
            manufacturer: f.manufacturer || '',
            imageUrl: primary,
            images: f.images,
            seats: f.capacity || 0,
            range: f.range || '-',
            speed: f.speed || '-',
            available: (f.status || 'available') === 'available',
            visibleOnB2C: !!f.isActive,
            bookingEnabled: true,
            operator: f.operator || 'Direct',
            pricePerHour: typeof f.pricePerHour === 'number' ? `₹${f.pricePerHour.toLocaleString()}/hr` : 'On request',
          } as Aircraft;
        });
        if (isMounted) setAircraft(mapped);
      } catch (e:any) {
        if (isMounted) setError(e.message || 'Error');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, []);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewItem, setViewItem] = useState<Aircraft | null>(null);
  const [editItem, setEditItem] = useState<Aircraft | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    manufacturer: "",
    seats: "",
    range: "",
    speed: "",
    description: "",
    imageOutside: "",
    imageInside: "",
    imageSeats: "",
    imageExtra: "",
    pricePerHour: "",
    available: true,
    visibleOnB2C: true,
    bookingEnabled: true,
  });

  const filteredAircraft = aircraft.filter(
    (plane) =>
      plane.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plane.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plane.operator.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Map UI form to API model
      const priceAsNumber = Number(String(formData.pricePerHour).replace(/[^0-9.]/g, '')) || 0;
      const payload = {
        name: formData.name,
        model: formData.type, // using "type" input as model for now
        capacity: parseInt(formData.seats || '0', 10),
        range: formData.range,
        speed: formData.speed,
        pricePerHour: priceAsNumber,
        features: [],
        description: formData.description,
        images: {
          outside: formData.imageOutside || undefined,
          inside: formData.imageInside || undefined,
          seats: formData.imageSeats || undefined,
          extra: formData.imageExtra || undefined,
        },
        status: formData.available ? 'available' : 'maintenance',
        isActive: !!formData.visibleOnB2C,
      };

      const res = await fetch(`/api/fleet/charter${editItem ? `?id=${encodeURIComponent(editItem.id)}` : ''}`, {
        method: editItem ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editItem ? { _id: editItem.id, ...payload } : payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || `Failed to create aircraft (HTTP ${res.status})`);
      }

      const created = await res.json();

      const mapped: Aircraft = {
        id: created._id,
        name: created.name || created.model || 'Aircraft',
        type: created.model || formData.type,
        manufacturer: formData.manufacturer,
        seats: created.capacity ?? parseInt(formData.seats || '0', 10),
        range: created.range,
        speed: created.speed,
        description: created.description ?? formData.description,
        imageUrl: created.image ?? created.images?.outside ?? created.images?.inside ?? created.images?.seats ?? created.images?.extra ?? '/placeholder.jpg',
        images: created.images,
        available: created.status === 'available',
        visibleOnB2C: !!created.isActive,
        bookingEnabled: formData.bookingEnabled,
        operator: 'Direct',
        pricePerHour: formData.pricePerHour,
      };

      setAircraft(prev => editItem ? prev.map(p => p.id === mapped.id ? mapped : p) : [mapped, ...prev]);
      setEditItem(null);

      setFormData({
        name: '',
        type: '',
        manufacturer: '',
        seats: '',
        range: '',
        speed: '',
        description: '',
        imageOutside: '',
        imageInside: '',
        imageSeats: '',
        imageExtra: '',
        pricePerHour: '',
        available: true,
        visibleOnB2C: true,
        bookingEnabled: true,
      });
     setIsDialogOpen(false);
     toast({ title: editItem ? 'Aircraft Updated' : 'Aircraft Added', description: editItem ? 'The aircraft has been updated.' : 'The aircraft has been saved to the database.' });
    } catch (err: any) {
      toast({ title: 'Add failed', description: err?.message || 'Unable to add aircraft', variant: 'destructive' as any });
    }
  };

  const toggleProperty = (id: string, property: "available" | "visibleOnB2C" | "bookingEnabled") => {
    setAircraft(
      aircraft.map((plane) =>
        plane.id === id ? { ...plane, [property]: !plane[property] } : plane
      )
    );
    toast({
      title: "Updated",
      description: `Aircraft ${property} has been changed.`,
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {loading && <div className="text-sm text-muted-foreground">Loading fleet…</div>}
        {error && <div className="text-sm text-destructive">{error}</div>}
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Fleet Management</h1>
            <p className="text-muted-foreground mt-1">Manage all aircraft in the fleet</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gold-gradient text-accent-foreground" onClick={() => {
                setEditItem(null);
                setFormData({
                  name: '', type: '', manufacturer: '', seats: '', range: '', speed: '', description: '',
                  imageOutside: '', imageInside: '', imageSeats: '', imageExtra: '', pricePerHour: '',
                  available: true, visibleOnB2C: true, bookingEnabled: true,
                });
              }}>
                <Plus className="w-4 h-4 mr-2" />
                Add Aircraft
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editItem ? 'Edit Aircraft' : 'Add New Aircraft'}</DialogTitle>
                <DialogDescription>Enter the details of the aircraft</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Aircraft Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Citation 560XL"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Aircraft Type</Label>
                    <Input
                      id="type"
                      placeholder="e.g., Midsize Jet"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="manufacturer">Manufacturer</Label>
                    <Input
                      id="manufacturer"
                      placeholder="e.g., Cessna"
                      value={formData.manufacturer}
                      onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="seats">Seats</Label>
                    <Input
                      id="seats"
                      type="number"
                      placeholder="e.g., 8"
                      value={formData.seats}
                      onChange={(e) => setFormData({ ...formData, seats: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="range">Range</Label>
                    <Input
                      id="range"
                      placeholder="e.g., 3,460 nm"
                      value={formData.range}
                      onChange={(e) => setFormData({ ...formData, range: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="speed">Max Speed</Label>
                    <Input
                      id="speed"
                      placeholder="e.g., 528 mph"
                      value={formData.speed}
                      onChange={(e) => setFormData({ ...formData, speed: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pricePerHour">Price per Hour</Label>
                    <Input
                      id="pricePerHour"
                      placeholder="e.g., ₹2,50,000"
                      value={formData.pricePerHour}
                      onChange={(e) => setFormData({ ...formData, pricePerHour: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="imageOutside">Outside Image URL</Label>
                    <Input
                      id="imageOutside"
                      placeholder="https://... (outside)"
                      value={formData.imageOutside}
                      onChange={(e) => setFormData({ ...formData, imageOutside: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="imageInside">Inside Image URL</Label>
                    <Input
                      id="imageInside"
                      placeholder="https://... (inside)"
                      value={formData.imageInside}
                      onChange={(e) => setFormData({ ...formData, imageInside: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="imageSeats">Seats Image URL</Label>
                    <Input
                      id="imageSeats"
                      placeholder="https://... (seats)"
                      value={formData.imageSeats}
                      onChange={(e) => setFormData({ ...formData, imageSeats: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="imageExtra">Extra Image URL (optional)</Label>
                    <Input
                      id="imageExtra"
                      placeholder="https://... (extra)"
                      value={formData.imageExtra}
                      onChange={(e) => setFormData({ ...formData, imageExtra: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter aircraft description..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="flex flex-wrap gap-6 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={formData.available}
                      onCheckedChange={(checked) => setFormData({ ...formData, available: checked })}
                    />
                    <Label>Available</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={formData.visibleOnB2C}
                      onCheckedChange={(checked) => setFormData({ ...formData, visibleOnB2C: checked })}
                    />
                    <Label>Visible on B2C</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={formData.bookingEnabled}
                      onCheckedChange={(checked) => setFormData({ ...formData, bookingEnabled: checked })}
                    />
                    <Label>Booking Enabled</Label>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="gold-gradient text-accent-foreground">
                    Add Aircraft
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search aircraft by name, type, or operator..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Aircraft Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredAircraft.map((plane) => (
            <Card key={plane.id} className="overflow-hidden group hover:shadow-xl transition-all">
              <div className="relative h-48 overflow-hidden">
                <Carousel className="w-full h-full" autoPlay autoPlayInterval={4000}>
                  <CarouselContent className="h-48">
                    {(() => {
                      const imgs = Array.from(new Set([
                        plane.images?.outside,
                        plane.images?.inside,
                        plane.images?.seats,
                        plane.images?.extra,
                        plane.imageUrl,
                      ].filter(Boolean) as string[]));
                      const listBase = imgs.length > 0 ? imgs : ['/placeholder.jpg'];
const list = listBase.length === 1 ? [listBase[0], listBase[0]] : listBase;
                      return list.map((src, idx) => (
                        <CarouselItem key={idx} className="h-48">
                          <img src={src} alt={`${plane.name} ${idx+1}`} className="w-full h-full object-cover" />
                        </CarouselItem>
                      ));
                    })()}
                  </CarouselContent>
                  <CarouselPrevious className="left-2 bg-white/80 hover:bg-white" />
                  <CarouselNext className="right-2 bg-white/80 hover:bg-white" />
                </Carousel>
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent pointer-events-none" />
                <div className="absolute top-3 left-3 flex gap-2">
                  {plane.available ? (
                    <Badge className="bg-success text-success-foreground">Available</Badge>
                  ) : (
                    <Badge variant="secondary">Unavailable</Badge>
                  )}
                </div>
                <div className="absolute top-3 right-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="secondary" size="icon" className="h-8 w-8">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-popover">
                      <DropdownMenuItem onSelect={(e)=>{e.preventDefault(); setViewItem(plane);}}>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={(e)=>{e.preventDefault(); setEditItem(plane); setIsDialogOpen(true);
                        setFormData({
                          name: plane.name,
                          type: plane.type,
                          manufacturer: plane.manufacturer,
                          seats: String(plane.seats ?? ''),
                          range: plane.range,
                          speed: plane.speed,
                          description: plane.description || '',
                          imageOutside: plane.images?.outside || '',
                          imageInside: plane.images?.inside || '',
                          imageSeats: plane.images?.seats || '',
                          imageExtra: plane.images?.extra || '',
                          pricePerHour: plane.pricePerHour,
                          available: plane.available,
                          visibleOnB2C: plane.visibleOnB2C,
                          bookingEnabled: plane.bookingEnabled,
                        });
                      }}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onSelect={async (e)=>{
                        e.preventDefault();
                        if (!confirm(`Delete ${plane.name}?`)) return;
                        try {
                          const res = await fetch(`/api/fleet/charter?id=${encodeURIComponent(plane.id)}`, { method: 'DELETE' });
                          if (!res.ok) throw new Error('Delete failed');
                          setAircraft(prev=> prev.filter(p=>p.id!==plane.id));
                          
                        } catch(err:any){
                          console.error(err);
                        }
                      }}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-xl font-bold text-primary-foreground">{plane.name}</h3>
                  <p className="text-sm text-primary-foreground/80">{plane.type} • {plane.manufacturer}</p>
                </div>
              </div>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Operator</span>
                  <span className="font-medium text-foreground">{plane.operator}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Price/Hour</span>
                  <span className="font-semibold text-accent">{plane.pricePerHour}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 py-3 border-y border-border">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Users className="w-4 h-4 text-accent" />
                      <span className="font-bold text-foreground">{plane.seats}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Seats</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Navigation className="w-4 h-4 text-accent" />
                      <span className="font-bold text-foreground">{plane.range}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Range</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Gauge className="w-4 h-4 text-accent" />
                      <span className="font-bold text-foreground">{plane.speed}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Speed</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground">Visible on B2C</span>
                    <Switch
                      checked={plane.visibleOnB2C}
                      onCheckedChange={() => toggleProperty(plane.id, "visibleOnB2C")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground">Booking Enabled</span>
                    <Switch
                      checked={plane.bookingEnabled}
                      onCheckedChange={() => toggleProperty(plane.id, "bookingEnabled")}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default FleetManagement;