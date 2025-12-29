import { useState } from "react";
import { AdminLayout } from "@admin/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Plus,
  Eye,
  Edit,
  Phone,
  Mail,
  MapPin,
  Plane,
  Star,
  TrendingUp,
  Clock,
  CheckCircle,
  Users,
} from "lucide-react";
import { airAmbulanceOperators, airAmbulanceAircraft, type AirAmbulanceOperator } from "@admin/data/airAmbulanceData";
import { cn } from "@/lib/utils";

const OperatorsManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOperator, setSelectedOperator] = useState<AirAmbulanceOperator | null>(null);

  const filteredOperators = airAmbulanceOperators.filter((operator) => {
    const matchesSearch =
      operator.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      operator.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      operator.coveredRegions.some(r => r.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  const getOperatorAircraft = (aircraftIds: string[]) => {
    return airAmbulanceAircraft.filter(a => aircraftIds.includes(a.id));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Operators Management</h1>
            <p className="text-muted-foreground">Air ambulance operator registry and performance</p>
          </div>
          <Button className="gap-2 gold-gradient text-accent-foreground">
            <Plus className="w-4 h-4" />
            Add Operator
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Operators</p>
                  <p className="text-2xl font-bold">{airAmbulanceOperators.length}</p>
                </div>
                <Users className="w-8 h-8 text-primary opacity-50" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold text-success">
                    {airAmbulanceOperators.filter(o => o.status === "Active").length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-success opacity-50" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Missions</p>
                  <p className="text-2xl font-bold">
                    {airAmbulanceOperators.reduce((acc, o) => acc + o.totalMissions, 0)}
                  </p>
                </div>
                <Plane className="w-8 h-8 text-accent opacity-50" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Rating</p>
                  <p className="text-2xl font-bold">
                    {(airAmbulanceOperators.reduce((acc, o) => acc + o.slaRating, 0) / airAmbulanceOperators.length).toFixed(1)}
                  </p>
                </div>
                <Star className="w-8 h-8 text-warning opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by company, contact, or region..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Operators Table */}
        <Card className="border-border">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/50">
                  <TableHead>Operator</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Coverage</TableHead>
                  <TableHead>Fleet</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOperators.map((operator) => (
                  <TableRow
                    key={operator.id}
                    className="hover:bg-secondary/30 cursor-pointer"
                    onClick={() => setSelectedOperator(operator)}
                  >
                    <TableCell>
                      <div>
                        <p className="font-medium">{operator.companyName}</p>
                        <p className="text-xs text-muted-foreground">{operator.id}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{operator.contactPerson}</p>
                        <p className="text-xs text-muted-foreground">{operator.contactPhone}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {operator.coveredRegions.slice(0, 2).map((region) => (
                          <Badge key={region} variant="outline" className="text-xs">
                            {region}
                          </Badge>
                        ))}
                        {operator.coveredRegions.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{operator.coveredRegions.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{operator.aircraftCount}</span>
                      <span className="text-muted-foreground"> aircraft</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-warning fill-warning" />
                        <span className="font-medium">{operator.slaRating}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Missions:</span>
                          <span className="text-sm font-medium">{operator.totalMissions}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Success:</span>
                          <span className="text-sm font-medium text-success">{operator.successRate}%</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          operator.status === "Active" && "bg-success/20 text-success",
                          operator.status === "Inactive" && "bg-muted text-muted-foreground"
                        )}
                      >
                        {operator.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Operator Detail Dialog */}
        <Dialog open={!!selectedOperator} onOpenChange={() => setSelectedOperator(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            {selectedOperator && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center justify-between">
                    <span>{selectedOperator.companyName}</span>
                    <Badge
                      className={cn(
                        selectedOperator.status === "Active" && "bg-success/20 text-success",
                        selectedOperator.status === "Inactive" && "bg-muted text-muted-foreground"
                      )}
                    >
                      {selectedOperator.status}
                    </Badge>
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  {/* Contact Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="border-border">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Contact Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{selectedOperator.contactPerson}</p>
                            <p className="text-xs text-muted-foreground">Primary Contact</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span>{selectedOperator.contactPhone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <span>{selectedOperator.contactEmail}</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-border">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Performance Metrics</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">SLA Rating</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-warning fill-warning" />
                            <span className="font-bold text-lg">{selectedOperator.slaRating}</span>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Missions</span>
                          <span className="font-medium">{selectedOperator.totalMissions}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Success Rate</span>
                          <span className="font-medium text-success">{selectedOperator.successRate}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Avg Response Time</span>
                          <span className="font-medium">{selectedOperator.responseTime}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Coverage */}
                  <Card className="border-border">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Coverage Areas
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {selectedOperator.coveredRegions.map((region) => (
                          <Badge key={region} variant="outline" className="bg-secondary/50">
                            {region}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Fleet */}
                  <Card className="border-border">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Plane className="w-4 h-4" />
                        Fleet ({selectedOperator.aircraftCount} Aircraft)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {getOperatorAircraft(selectedOperator.aircraftIds).map((aircraft) => (
                          <div
                            key={aircraft.id}
                            className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg"
                          >
                            <div className="w-16 h-12 bg-secondary rounded overflow-hidden">
                              <img
                                src={aircraft.image}
                                alt={aircraft.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-sm">{aircraft.name}</p>
                              <p className="text-xs text-accent">{aircraft.registration}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <div className={cn(
                                  "w-2 h-2 rounded-full",
                                  aircraft.availability === "Available" && "bg-success",
                                  aircraft.availability === "On Mission" && "bg-warning",
                                  aircraft.availability === "Maintenance" && "bg-destructive",
                                  aircraft.availability === "Standby" && "bg-blue-500",
                                )} />
                                <span className="text-xs text-muted-foreground">
                                  {aircraft.availability}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button variant="outline">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Details
                    </Button>
                    <Button variant="outline">View Mission History</Button>
                    <Button className="gold-gradient text-accent-foreground">
                      Assign Lead
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

export default OperatorsManagement;
