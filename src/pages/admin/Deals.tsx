import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
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

interface FeaturedDeal {
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

const dummyDeals: FeaturedDeal[] = [
  {
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
  {
    id: "FD004",
    title: "Pilot for a Day Experience",
    subtitle: "Cessna 172 • 60 mins",
    type: "joyride",
    imageUrl: "https://images.unsplash.com/photo-1559628233-100c798642d4?w=800&auto=format&fit=crop",
    originalPrice: 50000,
    discountedPrice: 45000,
    discount: 10,
    pinned: false,
    visible: false,
    priority: 4,
  },
];

const typeColors: Record<string, string> = {
  charter: "bg-accent/10 text-accent border-accent/20",
  "empty-leg": "bg-success/10 text-success border-success/20",
  joyride: "bg-warning/10 text-warning border-warning/20",
};

const Deals = () => {
  const { toast } = useToast();
  const [deals, setDeals] = useState<FeaturedDeal[]>(dummyDeals);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    type: "charter" as FeaturedDeal["type"],
    imageUrl: "",
    originalPrice: "",
    discountedPrice: "",
    pinned: false,
    visible: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const originalPrice = parseFloat(formData.originalPrice);
    const discountedPrice = parseFloat(formData.discountedPrice);
    const discount = Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);

    const newDeal: FeaturedDeal = {
      id: `FD${Date.now()}`,
      ...formData,
      originalPrice,
      discountedPrice,
      discount,
      priority: deals.length + 1,
    };
    setDeals([...deals, newDeal]);
    setFormData({
      title: "",
      subtitle: "",
      type: "charter",
      imageUrl: "",
      originalPrice: "",
      discountedPrice: "",
      pinned: false,
      visible: true,
    });
    setIsDialogOpen(false);
    toast({ title: "Deal Added", description: "The featured deal has been created." });
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
                <DialogTitle>Add Featured Deal</DialogTitle>
                <DialogDescription>Create a new featured listing for B2C</DialogDescription>
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
                <div className="space-y-2">
                  <Label>Subtitle</Label>
                  <Input
                    placeholder="e.g., Citation 560XL • 8 Seats"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Original Price (₹)</Label>
                    <Input
                      type="number"
                      placeholder="450000"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Discounted Price (₹)</Label>
                    <Input
                      type="number"
                      placeholder="350000"
                      value={formData.discountedPrice}
                      onChange={(e) => setFormData({ ...formData, discountedPrice: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Image URL</Label>
                  <Input
                    placeholder="https://..."
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  />
                </div>
                <div className="flex items-center gap-6 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={formData.pinned}
                      onCheckedChange={(checked) => setFormData({ ...formData, pinned: checked })}
                    />
                    <Label>Pinned</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={formData.visible}
                      onCheckedChange={(checked) => setFormData({ ...formData, visible: checked })}
                    />
                    <Label>Visible</Label>
                  </div>
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