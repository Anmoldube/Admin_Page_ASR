import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Search,
  Building2,
  Phone,
  Mail,
  Star,
  Plane,
  TrendingUp,
  MoreVertical,
  Eye,
  Edit,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface Operator {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  rating: number;
  totalFlights: number;
  activeAircraft: number;
  revenue: string;
  status: "active" | "inactive";
  joinedDate: string;
}

const dummyOperators: Operator[] = [
  {
    id: "OP001",
    companyName: "JetSet Aviation",
    contactPerson: "Arjun Kapoor",
    email: "arjun@jetset.com",
    phone: "+91 98765 43210",
    rating: 4.8,
    totalFlights: 245,
    activeAircraft: 5,
    revenue: "₹2.4Cr",
    status: "active",
    joinedDate: "Jan 2023",
  },
  {
    id: "OP002",
    companyName: "SkyHigh Charters",
    contactPerson: "Neha Sharma",
    email: "neha@skyhigh.com",
    phone: "+91 87654 32109",
    rating: 4.6,
    totalFlights: 189,
    activeAircraft: 3,
    revenue: "₹1.8Cr",
    status: "active",
    joinedDate: "Mar 2023",
  },
  {
    id: "OP003",
    companyName: "Elite Wings",
    contactPerson: "Rahul Verma",
    email: "rahul@elitewings.com",
    phone: "+91 76543 21098",
    rating: 4.9,
    totalFlights: 312,
    activeAircraft: 7,
    revenue: "₹3.2Cr",
    status: "active",
    joinedDate: "Feb 2022",
  },
  {
    id: "OP004",
    companyName: "AirLux Services",
    contactPerson: "Priya Patel",
    email: "priya@airlux.com",
    phone: "+91 65432 10987",
    rating: 4.4,
    totalFlights: 156,
    activeAircraft: 4,
    revenue: "₹1.5Cr",
    status: "inactive",
    joinedDate: "Aug 2023",
  },
  {
    id: "OP005",
    companyName: "Premier Jets",
    contactPerson: "Vikram Singh",
    email: "vikram@premierjets.com",
    phone: "+91 54321 09876",
    rating: 4.7,
    totalFlights: 203,
    activeAircraft: 6,
    revenue: "₹2.1Cr",
    status: "active",
    joinedDate: "Nov 2022",
  },
];

const OperatorsManagement = () => {
  const { toast } = useToast();
  const [operators, setOperators] = useState<Operator[]>(dummyOperators);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOperators = operators.filter(
    (op) =>
      op.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      op.contactPerson.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleStatus = (id: string) => {
    setOperators(
      operators.map((op) =>
        op.id === id
          ? { ...op, status: op.status === "active" ? "inactive" : "active" }
          : op
      )
    );
    toast({
      title: "Status Updated",
      description: "Operator status has been changed",
    });
  };

  const stats = {
    total: operators.length,
    active: operators.filter((o) => o.status === "active").length,
    totalAircraft: operators.reduce((sum, o) => sum + o.activeAircraft, 0),
    totalFlights: operators.reduce((sum, o) => sum + o.totalFlights, 0),
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Operators Management</h1>
          <p className="text-muted-foreground mt-1">Manage and monitor all charter operators</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Operators</p>
                  <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold text-foreground">{stats.active}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Plane className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Aircraft</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalAircraft}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                  <Star className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Flights</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalFlights}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search operators..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Operators Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOperators.map((operator) => (
            <Card key={operator.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{operator.companyName}</CardTitle>
                      <CardDescription>{operator.contactPerson}</CardDescription>
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
                        <Eye className="w-4 h-4 mr-2" />
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Plane className="w-4 h-4 mr-2" />
                        View Fleet
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    <span className="truncate">{operator.email}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Phone className="w-3 h-3" />
                  <span>{operator.phone}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-y border-border">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="w-4 h-4 text-warning fill-warning" />
                      <span className="text-lg font-bold text-foreground">{operator.rating}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Rating</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-foreground">{operator.totalFlights}</p>
                    <p className="text-xs text-muted-foreground">Flights</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-foreground">{operator.activeAircraft}</p>
                    <p className="text-xs text-muted-foreground">Aircraft</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-accent">{operator.revenue}</p>
                    <p className="text-xs text-muted-foreground">Revenue</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge
                      variant="outline"
                      className={
                        operator.status === "active"
                          ? "bg-success/10 text-success border-success/20"
                          : "bg-muted text-muted-foreground"
                      }
                    >
                      {operator.status}
                    </Badge>
                  </div>
                  <Switch
                    checked={operator.status === "active"}
                    onCheckedChange={() => toggleStatus(operator.id)}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default OperatorsManagement;