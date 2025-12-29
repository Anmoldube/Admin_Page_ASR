import { useEffect, useState } from "react";
import { AdminLayout } from "@admin/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Star,
  Pin,
  GripVertical,
  Edit,
  Trash2,
  MoreVertical,
  Eye,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FeaturedDealApi {
  _id: string;
  title: string;
  description?: string;
  from: string;
  to: string;
  date: string;
  time?: string;
  aircraft: string;
  price: number;
  image?: string;
  isActive: boolean;
  tags?: string[];
}

interface FeaturedDealUI {
  id: string;
  title: string;
  subtitle: string;
  type: "charter" | "empty-leg" | "joyride";
  imageUrl: string;
  originalPrice: number;
  discountedPrice: number;
  discount: number;
  pinned: boolean;
  visible: boolean;
  priority: number;
}

type FeaturedDeal = FeaturedDealUI;

// Load from API instead of static dummy data
/*
    id: "FD001",
    title: "Delhi to Jaipur Charter",
    subtitle: "Citation 560XL • 8 Seats",
    type: "charter",
    imageUrl: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&auto=format&fit=crop",
    originalPrice: 450000,
    discountedPrice: 350000,
    discount: 22,
    pinned: true,
    visible: true,
    priority: 1,
  },
  {
    id: "FD002",
    title: "Mumbai Skyline Helicopter",
    subtitle: "Robinson R44 • 30 mins",
    type: "joyride",
    imageUrl: "https://images.unsplash.com/photo-1542296332-2e4473faf563?w=800&auto=format&fit=crop",
    originalPrice: 30000,
    discountedPrice: 25000,
    discount: 17,
    pinned: true,
    visible: true,
    priority: 2,
  },
  {
    id: "FD003",
    title: "Mumbai to Goa Empty Leg",
    subtitle: "Gulfstream G650 • Dec 22",
    type: "empty-leg",
    imageUrl: "https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=800&auto=format&fit=crop",
    originalPrice: 800000,
    discountedPrice: 650000,
    discount: 19,
    pinned: false,
    visible: true,
    priority: 3,
  },
*/

const typeColors: Record<string, string> = {
  charter: "bg-accent/10 text-accent border-accent/20",
  "empty-leg": "bg-success/10 text-success border-success/20",
  joyride: "bg-warning/10 text-warning border-warning/20",
};

const Deals = () => {
  const { toast } = useToast();
  const [deals, setDeals] = useState<FeaturedDealUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const res = await fetch('/api/deals');
        if (!res.ok) throw new Error('Failed to load deals');
        const data = await res.json() as { items?: FeaturedDealApi[] } | FeaturedDealApi[];
        const items = Array.isArray(data) ? data : (data.items || []);
        const mapped: FeaturedDealUI[] = items.map((d, idx) => ({
          id: d._id,
          title: d.title,
          subtitle: `${d.from} → ${d.to}`,
          type: 'charter',
          imageUrl: d.image || '/placeholder.jpg',
          originalPrice: Math.round(d.price * 1.2),
          discountedPrice: d.price,
          discount: Math.max(0, Math.round((1 - d.price / Math.max(1, Math.round(d.price * 1.2))) * 100)),
          pinned: false,
          visible: d.isActive,
          priority: idx + 1,
        }));
        if (isMounted) setDeals(mapped);
      } catch (e:any) {
        if (isMounted) setError(e.message || 'Error');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, []);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    from: "",
    to: "",
    date: "",
    time: "",
    aircraft: "",
    price: "",
    description: "",
    image: "",
    isActive: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.title || !formData.from || !formData.to || !formData.date || !formData.aircraft || !formData.price) {
      toast({ title: "Missing fields", description: "Please fill in Title, From, To, Date, Aircraft and Price", variant: "destructive" as any });
      return;
    }

    try {
      const res = await fetch('/api/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          from: formData.from,
          to: formData.to,
          date: formData.date,
          time: formData.time || undefined,
          aircraft: formData.aircraft,
          price: Number(formData.price),
          description: formData.description || undefined,
          image: formData.image || undefined,
          isActive: formData.isActive,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || `Failed to create deal (HTTP ${res.status})`);
      }

      const created = await res.json();

      // Map created deal to UI model
      const ui: FeaturedDealUI = {
        id: created._id,
        title: created.title,
        subtitle: `${created.from} → ${created.to}`,
        type: 'charter',
        imageUrl: created.image || '/placeholder.jpg',
        originalPrice: Math.round(Number(created.price) * 1.2),
        discountedPrice: Number(created.price),
        discount: Math.max(0, Math.round((1 - Number(created.price) / Math.max(1, Math.round(Number(created.price) * 1.2))) * 100)),
        pinned: false,
        visible: !!created.isActive,
        priority: deals.length + 1,
      };

      setDeals(prev => [...prev, ui]);

      setFormData({
        title: "",
        from: "",
        to: "",
        date: "",
        time: "",
        aircraft: "",
        price: "",
        description: "",
        image: "",
        isActive: true,
      });
      setIsDialogOpen(false);
      toast({ title: "Deal Added", description: "The featured deal has been created." });
    } catch (err: any) {
      toast({ title: "Error", description: err.message || 'Failed to create deal', variant: "destructive" as any });
    }
  };

  const toggleProperty = (id: string, property: "pinned" | "visible") => {
    setDeals(deals.map((deal) => (deal.id === id ? { ...deal, [property]: !deal[property] } : deal)));
    toast({ title: "Updated", description: `Deal ${property} status has been changed.` });
  };

  const moveDeal = (id: string, direction: "up" | "down") => {
    const index = deals.findIndex((d) => d.id === id);
    if ((direction === "up" && index === 0) || (direction === "down" && index === deals.length - 1)) {
      return;
    }
    const newDeals = [...deals];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    [newDeals[index], newDeals[swapIndex]] = [newDeals[swapIndex], newDeals[index]];
    newDeals.forEach((deal, i) => (deal.priority = i + 1));
    setDeals(newDeals);
    toast({ title: "Reordered", description: "Deal priority has been updated." });
  };

  const sortedDeals = [...deals].sort((a, b) => a.priority - b.priority);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {loading && <div className="text-sm text-muted-foreground">Loading deals…</div>}
        {error && <div className="text-sm text-destructive">{error}</div>}
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Featured Deals</h1>
            <p className="text-muted-foreground mt-1">Manage B2C featured listings and promotions</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gold-gradient text-accent-foreground">
                <Plus className="w-4 h-4 mr-2" />
                Add Deal
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Add Deal</DialogTitle>
                <DialogDescription>Create a new deal that appears on Featured Deals</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    placeholder="e.g., Delhi to Jaipur Charter"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>From</Label>
                    <Input
                      placeholder="Origin (City or Airport)"
                      value={formData.from}
                      onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>To</Label>
                    <Input
                      placeholder="Destination (City or Airport)"
                      value={formData.to}
                      onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Time</Label>
                    <Input
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Aircraft</Label>
                    <Input
                      placeholder="e.g., Citation 560XL"
                      value={formData.aircraft}
                      onChange={(e) => setFormData({ ...formData, aircraft: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Price (₹)</Label>
                    <Input
                      type="number"
                      placeholder="350000"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Image URL</Label>
                  <Input
                    placeholder="https://..."
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input
                    placeholder="Optional description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <Switch
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  />
                  <Label>Active</Label>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="gold-gradient text-accent-foreground">
                    Add Deal
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Deals List */}
        <Card>
          <CardHeader>
            <CardTitle>All Featured Deals</CardTitle>
            <CardDescription>Drag to reorder or use arrows to change priority</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {sortedDeals.map((deal, index) => (
              <div
                key={deal.id}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                  deal.visible ? "bg-card border-border" : "bg-muted/50 border-muted opacity-60"
                }`}
              >
                <div className="flex flex-col gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => moveDeal(deal.id, "up")}
                    disabled={index === 0}
                  >
                    <ArrowUp className="w-3 h-3" />
                  </Button>
                  <span className="text-xs text-muted-foreground text-center">{deal.priority}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => moveDeal(deal.id, "down")}
                    disabled={index === sortedDeals.length - 1}
                  >
                    <ArrowDown className="w-3 h-3" />
                  </Button>
                </div>

                <img
                  src={deal.imageUrl}
                  alt={deal.title}
                  className="w-24 h-16 object-cover rounded-lg"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-foreground truncate">{deal.title}</h4>
                    {deal.pinned && (
                      <Pin className="w-4 h-4 text-accent fill-accent" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{deal.subtitle}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className={typeColors[deal.type]}>
                      {deal.type}
                    </Badge>
                    <Badge variant="secondary" className="bg-success/10 text-success">
                      {deal.discount}% OFF
                    </Badge>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm text-muted-foreground line-through">
                    ₹{deal.originalPrice.toLocaleString()}
                  </p>
                  <p className="text-lg font-bold text-accent">
                    ₹{deal.discountedPrice.toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Pin className="w-4 h-4 text-muted-foreground" />
                      <Switch
                        checked={deal.pinned}
                        onCheckedChange={() => toggleProperty(deal.id, "pinned")}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-muted-foreground" />
                      <Switch
                        checked={deal.visible}
                        onCheckedChange={() => toggleProperty(deal.id, "visible")}
                      />
                    </div>
                  </div>

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
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Deals;