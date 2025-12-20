import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Filter,
  MoreVertical,
  Eye,
  CheckCircle,
  XCircle,
  UserPlus,
  Plane,
  MapPin,
  Calendar,
  Users,
  Car,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Lead {
  id: string;
  clientName: string;
  email: string;
  phone: string;
  origin: string;
  destination: string;
  date: string;
  time: string;
  passengers: number;
  fleetAssigned: string | null;
  operatorAssigned: string | null;
  shuttleService: boolean;
  status: "pending" | "approved" | "completed" | "cancelled";
  createdAt: string;
}

const dummyLeads: Lead[] = [
  {
    id: "LD001",
    clientName: "Rajesh Sharma",
    email: "rajesh.sharma@email.com",
    phone: "+91 98765 43210",
    origin: "New Delhi (DEL)",
    destination: "Jaipur (JAI)",
    date: "Dec 20, 2024",
    time: "10:00 AM",
    passengers: 4,
    fleetAssigned: "Citation 560XL",
    operatorAssigned: "JetSet Aviation",
    shuttleService: true,
    status: "approved",
    createdAt: "Dec 15, 2024",
  },
  {
    id: "LD002",
    clientName: "Priya Mehta",
    email: "priya.mehta@email.com",
    phone: "+91 87654 32109",
    origin: "Mumbai (BOM)",
    destination: "Goa (GOI)",
    date: "Dec 22, 2024",
    time: "02:30 PM",
    passengers: 6,
    fleetAssigned: null,
    operatorAssigned: null,
    shuttleService: false,
    status: "pending",
    createdAt: "Dec 16, 2024",
  },
  {
    id: "LD003",
    clientName: "Vikram Industries",
    email: "bookings@vikram.com",
    phone: "+91 76543 21098",
    origin: "Bangalore (BLR)",
    destination: "Hyderabad (HYD)",
    date: "Dec 18, 2024",
    time: "08:00 AM",
    passengers: 2,
    fleetAssigned: "Gulfstream G650",
    operatorAssigned: "Elite Wings",
    shuttleService: true,
    status: "completed",
    createdAt: "Dec 10, 2024",
  },
  {
    id: "LD004",
    clientName: "Ananya Singh",
    email: "ananya.singh@email.com",
    phone: "+91 65432 10987",
    origin: "Chennai (MAA)",
    destination: "Cochin (COK)",
    date: "Dec 25, 2024",
    time: "11:30 AM",
    passengers: 3,
    fleetAssigned: null,
    operatorAssigned: null,
    shuttleService: false,
    status: "pending",
    createdAt: "Dec 17, 2024",
  },
  {
    id: "LD005",
    clientName: "Global Tech Corp",
    email: "travel@globaltech.com",
    phone: "+91 54321 09876",
    origin: "Pune (PNQ)",
    destination: "Ahmedabad (AMD)",
    date: "Dec 19, 2024",
    time: "04:00 PM",
    passengers: 8,
    fleetAssigned: "Bombardier Global 7500",
    operatorAssigned: "SkyHigh Charters",
    shuttleService: true,
    status: "cancelled",
    createdAt: "Dec 12, 2024",
  },
];

const statusColors: Record<string, string> = {
  pending: "bg-warning/10 text-warning border-warning/20",
  approved: "bg-accent/10 text-accent border-accent/20",
  completed: "bg-success/10 text-success border-success/20",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
};

const LeadsManagement = () => {
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>(dummyLeads);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.destination.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (leadId: string, newStatus: Lead["status"]) => {
    setLeads(leads.map((lead) => (lead.id === leadId ? { ...lead, status: newStatus } : lead)));
    toast({
      title: "Status Updated",
      description: `Lead ${leadId} marked as ${newStatus}`,
    });
  };

  const stats = {
    total: leads.length,
    pending: leads.filter((l) => l.status === "pending").length,
    approved: leads.filter((l) => l.status === "approved").length,
    completed: leads.filter((l) => l.status === "completed").length,
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Leads Management</h1>
            <p className="text-muted-foreground mt-1">Manage and track all charter booking leads</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total Leads</p>
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold text-warning">{stats.pending}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Approved</p>
              <p className="text-2xl font-bold text-accent">{stats.approved}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold text-success">{stats.completed}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by client, ID, or route..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Leads Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Leads</CardTitle>
            <CardDescription>
              {filteredLeads.length} leads found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                      Client
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                      Journey
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                      Date & Time
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                      PAX
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                      Fleet
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                      Operator
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                      Shuttle
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-foreground">{lead.clientName}</p>
                          <p className="text-xs text-muted-foreground">{lead.id}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3 h-3 text-accent" />
                          <span className="text-sm text-foreground">
                            {lead.origin} → {lead.destination}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-foreground">{lead.date}</p>
                            <p className="text-xs text-muted-foreground">{lead.time}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-muted-foreground" />
                          <span className="text-sm text-foreground">{lead.passengers}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        {lead.fleetAssigned ? (
                          <div className="flex items-center gap-1">
                            <Plane className="w-3 h-3 text-accent" />
                            <span className="text-sm text-foreground">{lead.fleetAssigned}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">Not assigned</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        {lead.operatorAssigned ? (
                          <span className="text-sm text-foreground">{lead.operatorAssigned}</span>
                        ) : (
                          <span className="text-sm text-muted-foreground">Not assigned</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        {lead.shuttleService ? (
                          <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                            <Car className="w-3 h-3 mr-1" />
                            Yes
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground">
                            No
                          </Badge>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant="outline" className={statusColors[lead.status]}>
                          {lead.status}
                        </Badge>
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
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <UserPlus className="w-4 h-4 mr-2" />
                              Assign Operator
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Plane className="w-4 h-4 mr-2" />
                              Assign Fleet
                            </DropdownMenuItem>
                            {lead.status === "pending" && (
                              <>
                                <DropdownMenuItem
                                  onClick={() => handleStatusChange(lead.id, "approved")}
                                >
                                  <CheckCircle className="w-4 h-4 mr-2 text-success" />
                                  Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleStatusChange(lead.id, "cancelled")}
                                >
                                  <XCircle className="w-4 h-4 mr-2 text-destructive" />
                                  Reject
                                </DropdownMenuItem>
                              </>
                            )}
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

export default LeadsManagement;