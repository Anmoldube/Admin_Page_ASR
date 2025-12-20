import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
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
  Sparkles,
  Clock,
  Users,
  MapPin,
  Plane,
  Edit,
  Trash2,
  MoreVertical,
  IndianRupee,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Joyride {
  id: string;
  name: string;
  description: string;
  aircraft: string;
  duration: string;
  capacity: number;
  price: number;
  location: string;
  imageUrl: string;
  available: boolean;
  bookingsEnabled: boolean;
  type: "helicopter" | "fixed-wing" | "special";
}

const dummyJoyrides: Joyride[] = [
  {
    id: "JR001",
    name: "Mumbai Skyline Experience",
    description: "Experience breathtaking views of Mumbai's iconic skyline, including Marine Drive, Gateway of India, and Bandra-Worli Sea Link.",
    aircraft: "Robinson R44",
    duration: "30 mins",
    capacity: 3,
    price: 25000,
    location: "Mumbai",
    imageUrl: "https://images.unsplash.com/photo-1542296332-2e4473faf563?w=800&auto=format&fit=crop",
    available: true,
    bookingsEnabled: true,
    type: "helicopter",
  },
  {
    id: "JR002",
    name: "Pilot for a Day",
    description: "Live your aviation dream! Get hands-on experience in a real cockpit with a certified instructor.",
    aircraft: "Cessna 172",
    duration: "60 mins",
    capacity: 1,
    price: 45000,
    location: "Delhi NCR",
    imageUrl: "https://images.unsplash.com/photo-1559628233-100c798642d4?w=800&auto=format&fit=crop",
    available: true,
    bookingsEnabled: true,
    type: "special",
  },
  {
    id: "JR003",
    name: "Goa Coastal Tour",
    description: "Fly along the beautiful Goan coastline, viewing pristine beaches, historic forts, and the magnificent Western Ghats.",
    aircraft: "Bell 206",
    duration: "45 mins",
    capacity: 4,
    price: 35000,
    location: "Goa",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop",
    available: true,
    bookingsEnabled: false,
    type: "helicopter",
  },
  {
    id: "JR004",
    name: "Bangalore City Aerial Tour",
    description: "Discover the Garden City from above - see tech parks, Ulsoor Lake, and the historic Bangalore Palace.",
    aircraft: "Piper PA-28",
    duration: "40 mins",
    capacity: 2,
    price: 30000,
    location: "Bangalore",
    imageUrl: "https://images.unsplash.com/photo-1583395838144-09e18eb51d3e?w=800&auto=format&fit=crop",
    available: false,
    bookingsEnabled: false,
    type: "fixed-wing",
  },
];

const typeColors: Record<string, string> = {
  helicopter: "bg-accent/10 text-accent border-accent/20",
  "fixed-wing": "bg-primary/10 text-primary border-primary/20",
  special: "bg-warning/10 text-warning border-warning/20",
};

const Joyrides = () => {
  const { toast } = useToast();
  const [joyrides, setJoyrides] = useState<Joyride[]>(dummyJoyrides);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    aircraft: "",
    duration: "",
    capacity: "",
    price: "",
    location: "",
    imageUrl: "",
    type: "helicopter" as Joyride["type"],
    available: true,
    bookingsEnabled: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newJoyride: Joyride = {
      id: `JR${Date.now()}`,
      ...formData,
      capacity: parseInt(formData.capacity),
      price: parseFloat(formData.price),
    };
    setJoyrides([...joyrides, newJoyride]);
    setFormData({
      name: "",
      description: "",
      aircraft: "",
      duration: "",
      capacity: "",
      price: "",
      location: "",
      imageUrl: "",
      type: "helicopter",
      available: true,
      bookingsEnabled: true,
    });
    setIsDialogOpen(false);
    toast({ title: "Joyride Created", description: "The joyride experience has been added." });
  };

  const toggleProperty = (id: string, property: "available" | "bookingsEnabled") => {
    setJoyrides(
      joyrides.map((jr) => (jr.id === id ? { ...jr, [property]: !jr[property] } : jr))
    );
    toast({ title: "Updated", description: `Joyride ${property} has been changed.` });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Joyrides Management</h1>
            <p className="text-muted-foreground mt-1">Manage scenic flight experiences</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gold-gradient text-accent-foreground">
                <Plus className="w-4 h-4 mr-2" />
                Add Joyride
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Joyride</DialogTitle>
                <DialogDescription>Set up a new scenic flight experience</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label>Experience Name</Label>
                    <Input
                      placeholder="e.g., Mumbai Skyline Experience"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Description</Label>
                    <Textarea
                      placeholder="Describe the experience..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Aircraft</Label>
                    <Input
                      placeholder="e.g., Robinson R44"
                      value={formData.aircraft}
                      onChange={(e) => setFormData({ ...formData, aircraft: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input
                      placeholder="e.g., Mumbai"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Duration</Label>
                    <Input
                      placeholder="e.g., 30 mins"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Capacity</Label>
                    <Input
                      type="number"
                      placeholder="3"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Price (₹)</Label>
                    <Input
                      type="number"
                      placeholder="25000"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Image URL</Label>
                    <Input
                      placeholder="https://..."
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    />
                  </div>
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
                      checked={formData.bookingsEnabled}
                      onCheckedChange={(checked) => setFormData({ ...formData, bookingsEnabled: checked })}
                    />
                    <Label>Bookings Enabled</Label>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="gold-gradient text-accent-foreground">
                    Create Joyride
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Joyrides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {joyrides.map((joyride) => (
            <Card key={joyride.id} className="overflow-hidden group hover:shadow-xl transition-all">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={joyride.imageUrl}
                  alt={joyride.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                <div className="absolute top-3 left-3">
                  <Badge variant="outline" className={typeColors[joyride.type]}>
                    <Sparkles className="w-3 h-3 mr-1" />
                    {joyride.type}
                  </Badge>
                </div>
                <div className="absolute top-3 right-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="secondary" size="icon" className="h-8 w-8">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-popover">
                      <DropdownMenuItem>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-lg font-bold text-primary-foreground">{joyride.name}</h3>
                  <div className="flex items-center gap-1 text-primary-foreground/80">
                    <MapPin className="w-3 h-3" />
                    <span className="text-sm">{joyride.location}</span>
                  </div>
                </div>
              </div>
              <CardContent className="p-4 space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">{joyride.description}</p>

                <div className="grid grid-cols-2 gap-4 py-3 border-y border-border">
                  <div className="flex items-center gap-2">
                    <Plane className="w-4 h-4 text-accent" />
                    <span className="text-sm text-foreground">{joyride.aircraft}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{joyride.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{joyride.capacity} pax</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IndianRupee className="w-4 h-4 text-accent" />
                    <span className="text-sm font-semibold text-accent">
                      {joyride.price.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground">Available</span>
                    <Switch
                      checked={joyride.available}
                      onCheckedChange={() => toggleProperty(joyride.id, "available")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground">Bookings Enabled</span>
                    <Switch
                      checked={joyride.bookingsEnabled}
                      onCheckedChange={() => toggleProperty(joyride.id, "bookingsEnabled")}
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

export default Joyrides;