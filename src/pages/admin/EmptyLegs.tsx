import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  CalendarIcon,
  MapPin,
  Plane,
  Plus,
  Search,
  Users,
  Edit,
  Trash2,
  MoreVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface EmptyLeg {
  id: string;
  aircraft: string;
  aircraftImage: string;
  origin: string;
  destination: string;
  date: Date;
  time: string;
  seats: number;
  pricePerSeat: number;
  priceWholeJet: number;
  available: boolean;
  operator: string;
}

const dummyDeals: EmptyLeg[] = [
  {
    id: "EL001",
    aircraft: "Citation 560XL",
    aircraftImage: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=400&auto=format&fit=crop",
    origin: "New Delhi (DEL)",
    destination: "Jaipur (JAI)",
    date: new Date("2024-12-20"),
    time: "09:30",
    seats: 6,
    pricePerSeat: 49999,
    priceWholeJet: 250000,
    available: true,
    operator: "JetSet Aviation",
  },
  {
    id: "EL002",
    aircraft: "Gulfstream G650",
    aircraftImage: "https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=400&auto=format&fit=crop",
    origin: "Mumbai (BOM)",
    destination: "Goa (GOI)",
    date: new Date("2024-12-22"),
    time: "14:15",
    seats: 10,
    pricePerSeat: 75000,
    priceWholeJet: 650000,
    available: true,
    operator: "Elite Wings",
  },
  {
    id: "EL003",
    aircraft: "Pilatus PC-12",
    aircraftImage: "https://images.unsplash.com/photo-1559628233-100c798642d4?w=400&auto=format&fit=crop",
    origin: "Bangalore (BLR)",
    destination: "Chennai (MAA)",
    date: new Date("2024-12-24"),
    time: "08:00",
    seats: 5,
    pricePerSeat: 35000,
    priceWholeJet: 150000,
    available: false,
    operator: "AirLux Services",
  },
];

const EmptyLegs = () => {
  const { toast } = useToast();
  const [deals, setDeals] = useState<EmptyLeg[]>(dummyDeals);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [date, setDate] = useState<Date>();

  const [formData, setFormData] = useState({
    aircraft: "",
    origin: "",
    destination: "",
    time: "",
    seats: "",
    pricePerSeat: "",
    priceWholeJet: "",
    imageUrl: "",
    available: true,
  });

  const filteredDeals = deals.filter(
    (deal) =>
      deal.aircraft.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.destination.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) {
      toast({ title: "Error", description: "Please select a date", variant: "destructive" });
      return;
    }

    const newDeal: EmptyLeg = {
      id: `EL${Date.now()}`,
      aircraft: formData.aircraft,
      aircraftImage: formData.imageUrl || "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=400&auto=format&fit=crop",
      origin: formData.origin,
      destination: formData.destination,
      date: date,
      time: formData.time,
      seats: parseInt(formData.seats),
      pricePerSeat: parseFloat(formData.pricePerSeat),
      priceWholeJet: parseFloat(formData.priceWholeJet),
      available: formData.available,
      operator: "Admin Created",
    };

    setDeals([...deals, newDeal]);
    setFormData({
      aircraft: "",
      origin: "",
      destination: "",
      time: "",
      seats: "",
      pricePerSeat: "",
      priceWholeJet: "",
      imageUrl: "",
      available: true,
    });
    setDate(undefined);
    setIsDialogOpen(false);
    toast({ title: "Empty Leg Added", description: "The deal has been created successfully." });
  };

  const toggleAvailability = (id: string) => {
    setDeals(deals.map((deal) => (deal.id === id ? { ...deal, available: !deal.available } : deal)));
    toast({ title: "Status Updated", description: "Deal availability has been changed." });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Empty Leg Deals</h1>
            <p className="text-muted-foreground mt-1">Manage discounted empty leg flights</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gold-gradient text-accent-foreground">
                <Plus className="w-4 h-4 mr-2" />
                Add Empty Leg
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Empty Leg Deal</DialogTitle>
                <DialogDescription>Enter the details of the empty leg flight</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Aircraft</Label>
                    <Select
                      value={formData.aircraft}
                      onValueChange={(value) => setFormData({ ...formData, aircraft: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select aircraft" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        <SelectItem value="Citation 560XL">Citation 560XL</SelectItem>
                        <SelectItem value="Gulfstream G650">Gulfstream G650</SelectItem>
                        <SelectItem value="Bombardier Global 7500">Bombardier Global 7500</SelectItem>
                        <SelectItem value="Pilatus PC-12">Pilatus PC-12</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Seats</Label>
                    <Input
                      type="number"
                      placeholder="6"
                      value={formData.seats}
                      onChange={(e) => setFormData({ ...formData, seats: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Origin</Label>
                    <Input
                      placeholder="City (CODE)"
                      value={formData.origin}
                      onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Destination</Label>
                    <Input
                      placeholder="City (CODE)"
                      value={formData.destination}
                      onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn("w-full justify-start", !date && "text-muted-foreground")}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-popover">
                        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label>Time</Label>
                    <Input
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Price per Seat (₹)</Label>
                    <Input
                      type="number"
                      placeholder="49999"
                      value={formData.pricePerSeat}
                      onChange={(e) => setFormData({ ...formData, pricePerSeat: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Whole Jet Price (₹)</Label>
                    <Input
                      type="number"
                      placeholder="250000"
                      value={formData.priceWholeJet}
                      onChange={(e) => setFormData({ ...formData, priceWholeJet: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={formData.available}
                      onCheckedChange={(checked) => setFormData({ ...formData, available: checked })}
                    />
                    <Label>Available</Label>
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="gold-gradient text-accent-foreground">
                      Add Deal
                    </Button>
                  </div>
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
                placeholder="Search by aircraft or route..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Deals Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Empty Leg Deals</CardTitle>
            <CardDescription>{filteredDeals.length} deals available</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Aircraft</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Route</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Date/Time</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Seats</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Per Seat</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Whole Jet</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDeals.map((deal) => (
                    <tr key={deal.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={deal.aircraftImage}
                            alt={deal.aircraft}
                            className="w-16 h-12 object-cover rounded-lg"
                          />
                          <div>
                            <p className="font-medium text-foreground">{deal.aircraft}</p>
                            <p className="text-xs text-muted-foreground">{deal.operator}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-accent" />
                          <div>
                            <p className="text-sm font-medium text-foreground">{deal.origin}</p>
                            <p className="text-xs text-muted-foreground">→ {deal.destination}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-foreground">{format(deal.date, "MMM d, yyyy")}</p>
                            <p className="text-xs text-muted-foreground">{deal.time}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium text-foreground">{deal.seats}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-semibold text-accent">₹{deal.pricePerSeat.toLocaleString()}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-semibold text-foreground">₹{deal.priceWholeJet.toLocaleString()}</span>
                      </td>
                      <td className="py-4 px-4">
                        <Switch checked={deal.available} onCheckedChange={() => toggleAvailability(deal.id)} />
                      </td>
                      <td className="py-4 px-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default EmptyLegs;