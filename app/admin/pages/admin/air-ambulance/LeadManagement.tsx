import { useState } from "react";
import { AdminLayout } from "@admin/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  ArrowRight,
  Clock,
  FileText,
  User,
  MapPin,
  Phone,
  Mail,
  Heart,
  Stethoscope,
  Shield,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import {
  airAmbulanceLeads,
  airAmbulanceOperators,
  airAmbulanceAircraft,
  leadStatusFlow,
  conditionCategories,
  type AirAmbulanceLead,
  type LeadStatus,
} from "@admin/data/airAmbulanceData";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

const LeadManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [emergencyFilter, setEmergencyFilter] = useState<string>("all");
  const [selectedLead, setSelectedLead] = useState<AirAmbulanceLead | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const filteredLeads = airAmbulanceLeads.filter((lead) => {
    const matchesSearch =
      lead.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.sourceCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.destinationCity.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    const matchesEmergency = emergencyFilter === "all" || lead.emergencyLevel === emergencyFilter;
    return matchesSearch && matchesStatus && matchesEmergency;
  });

  const getEmergencyBadge = (level: string) => {
    const config = {
      Critical: "bg-destructive text-destructive-foreground",
      High: "bg-warning text-warning-foreground",
      Planned: "bg-muted text-muted-foreground",
    };
    return config[level as keyof typeof config] || config.Planned;
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, string> = {
      "New Lead": "bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30",
      "Medical Review": "bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/30",
      "Aircraft Feasibility": "bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border-cyan-500/30",
      "Quote Generated": "bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30",
      "Shared with Client": "bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-500/30",
      "Assigned to Operator": "bg-teal-500/20 text-teal-700 dark:text-teal-300 border-teal-500/30",
      "Mission Active": "bg-success/20 text-success border-success/30",
      "Completed": "bg-muted text-muted-foreground border-border",
      "Closed": "bg-muted text-muted-foreground border-border",
    };
    return config[status] || "bg-muted text-muted-foreground border-border";
  };

  const getInsuranceBadge = (status: string) => {
    const config = {
      Verified: "bg-success/20 text-success",
      Pending: "bg-warning/20 text-warning",
      "Not Covered": "bg-destructive/20 text-destructive",
    };
    return config[status as keyof typeof config] || "";
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Lead Management</h1>
            <p className="text-muted-foreground">Manage air ambulance requests and missions</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2 gold-gradient text-accent-foreground">
                <Plus className="w-4 h-4" />
                New Lead
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Air Ambulance Lead</DialogTitle>
              </DialogHeader>
              <NewLeadForm />
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by patient, ID, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {leadStatusFlow.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={emergencyFilter} onValueChange={setEmergencyFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Emergency level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Planned">Planned</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Leads Table */}
        <Card className="border-border">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/50">
                  <TableHead>Lead ID</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Emergency</TableHead>
                  <TableHead>Insurance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Operator</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => (
                  <TableRow
                    key={lead.id}
                    className={cn(
                      "hover:bg-secondary/30 cursor-pointer",
                      lead.emergencyLevel === "Critical" && lead.status !== "Completed" && lead.status !== "Closed" && "bg-destructive/5"
                    )}
                    onClick={() => {
                      setSelectedLead(lead);
                      setIsDetailOpen(true);
                    }}
                  >
                    <TableCell className="font-medium">{lead.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{lead.patientName}</p>
                        <p className="text-xs text-muted-foreground">
                          {lead.age}y, {lead.gender}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <span>{lead.sourceCity}</span>
                        <ArrowRight className="w-3 h-3" />
                        <span>{lead.destinationCity}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getEmergencyBadge(lead.emergencyLevel)}>
                        {lead.emergencyLevel}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getInsuranceBadge(lead.insuranceStatus)}>
                        {lead.insuranceStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusBadge(lead.status)}>
                        {lead.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {lead.assignedOperator ? (
                        <span className="text-sm">{lead.assignedOperator}</span>
                      ) : (
                        <span className="text-sm text-muted-foreground">Unassigned</span>
                      )}
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

        {/* Lead Detail Dialog */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
            {selectedLead && <LeadDetail lead={selectedLead} />}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

const NewLeadForm = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="patient">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="patient">Patient Info</TabsTrigger>
          <TabsTrigger value="medical">Medical Details</TabsTrigger>
          <TabsTrigger value="route">Route & Hospital</TabsTrigger>
          <TabsTrigger value="insurance">Insurance</TabsTrigger>
        </TabsList>

        <TabsContent value="patient" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Patient Name *</Label>
              <Input placeholder="Enter patient name" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Age *</Label>
                <Input type="number" placeholder="Age" />
              </div>
              <div className="space-y-2">
                <Label>Gender *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Contact Phone *</Label>
              <Input placeholder="+91 XXXXX XXXXX" />
            </div>
            <div className="space-y-2">
              <Label>Contact Email</Label>
              <Input type="email" placeholder="email@example.com" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Lead Source *</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Call">Phone Call</SelectItem>
                  <SelectItem value="Website">Website</SelectItem>
                  <SelectItem value="Hospital">Hospital Referral</SelectItem>
                  <SelectItem value="Partner">Partner Network</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Emergency Level *</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Planned">Planned</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="medical" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Condition Category *</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {conditionCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Patient Condition (Detailed) *</Label>
            <Textarea placeholder="Describe the patient's condition in detail..." rows={4} />
          </div>
          <div className="space-y-3">
            <Label>Medical Requirements</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="icu" />
                <label htmlFor="icu" className="text-sm">ICU Setup Required</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="ventilator" />
                <label htmlFor="ventilator" className="text-sm">Ventilator Required</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="doctor" />
                <label htmlFor="doctor" className="text-sm">Doctor Onboard</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="nurse" />
                <label htmlFor="nurse" className="text-sm">Nurse Onboard</label>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="route" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4 p-4 bg-secondary/30 rounded-lg">
              <h4 className="font-semibold flex items-center gap-2">
                <MapPin className="w-4 h-4 text-destructive" />
                Source
              </h4>
              <div className="space-y-2">
                <Label>Hospital Name *</Label>
                <Input placeholder="Enter hospital name" />
              </div>
              <div className="space-y-2">
                <Label>City *</Label>
                <Input placeholder="Enter city" />
              </div>
            </div>
            <div className="space-y-4 p-4 bg-secondary/30 rounded-lg">
              <h4 className="font-semibold flex items-center gap-2">
                <MapPin className="w-4 h-4 text-success" />
                Destination
              </h4>
              <div className="space-y-2">
                <Label>Hospital Name *</Label>
                <Input placeholder="Enter hospital name" />
              </div>
              <div className="space-y-2">
                <Label>City *</Label>
                <Input placeholder="Enter city" />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="insurance" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Insurance Provider</Label>
              <Input placeholder="Enter insurance provider" />
            </div>
            <div className="space-y-2">
              <Label>Plan Name</Label>
              <Input placeholder="Enter plan name" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Coverage Status</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Verified">Verified</SelectItem>
                <SelectItem value="Pending">Pending Verification</SelectItem>
                <SelectItem value="Not Covered">Not Covered</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline">Cancel</Button>
        <Button className="gold-gradient text-accent-foreground">Create Lead</Button>
      </div>
    </div>
  );
};

const LeadDetail = ({ lead }: { lead: AirAmbulanceLead }) => {
  const getStatusBadge = (status: string) => {
    const config: Record<string, string> = {
      "New Lead": "bg-blue-500/20 text-blue-700 dark:text-blue-300",
      "Medical Review": "bg-purple-500/20 text-purple-700 dark:text-purple-300",
      "Aircraft Feasibility": "bg-cyan-500/20 text-cyan-700 dark:text-cyan-300",
      "Quote Generated": "bg-amber-500/20 text-amber-700 dark:text-amber-300",
      "Shared with Client": "bg-indigo-500/20 text-indigo-700 dark:text-indigo-300",
      "Assigned to Operator": "bg-teal-500/20 text-teal-700 dark:text-teal-300",
      "Mission Active": "bg-success/20 text-success",
      "Completed": "bg-muted text-muted-foreground",
      "Closed": "bg-muted text-muted-foreground",
    };
    return config[status] || "bg-muted text-muted-foreground";
  };

  return (
    <div className="space-y-6">
      <DialogHeader>
        <div className="flex items-center justify-between">
          <div>
            <DialogTitle className="text-xl">{lead.id}</DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Created: {new Date(lead.createdAt).toLocaleString()}
            </p>
          </div>
          {lead.emergencyLevel === "Critical" && (
            <div className="flex items-center gap-2 px-3 py-2 bg-destructive/10 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              <span className="font-semibold text-destructive">CRITICAL</span>
            </div>
          )}
        </div>
      </DialogHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Info */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <User className="w-4 h-4" />
              Patient Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name</span>
              <span className="font-medium">{lead.patientName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Age</span>
              <span className="font-medium">{lead.age} years</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Gender</span>
              <span className="font-medium">{lead.gender}</span>
            </div>
            <div className="pt-2 border-t">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>{lead.contactPhone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm mt-1">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span>{lead.contactEmail}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Medical Info */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Stethoscope className="w-4 h-4" />
              Medical Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <span className="text-xs text-muted-foreground">Condition</span>
              <p className="text-sm font-medium">{lead.conditionCategory}</p>
            </div>
            <p className="text-sm text-muted-foreground">{lead.patientCondition}</p>
            <div className="pt-2 border-t space-y-2">
              <span className="text-xs text-muted-foreground">Requirements</span>
              <div className="flex flex-wrap gap-2">
                {lead.medicalRequirements.icu && (
                  <Badge variant="outline" className="bg-destructive/10">ICU</Badge>
                )}
                {lead.medicalRequirements.ventilator && (
                  <Badge variant="outline" className="bg-destructive/10">Ventilator</Badge>
                )}
                {lead.medicalRequirements.doctorOnboard && (
                  <Badge variant="outline" className="bg-primary/10">Doctor</Badge>
                )}
                {lead.medicalRequirements.nurseOnboard && (
                  <Badge variant="outline" className="bg-primary/10">Nurse</Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Insurance */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Insurance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Provider</span>
              <span className="font-medium">{lead.insuranceProvider}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Plan</span>
              <span className="font-medium">{lead.insurancePlan}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Status</span>
              <Badge className={cn(
                lead.insuranceStatus === "Verified" && "bg-success/20 text-success",
                lead.insuranceStatus === "Pending" && "bg-warning/20 text-warning",
                lead.insuranceStatus === "Not Covered" && "bg-destructive/20 text-destructive"
              )}>
                {lead.insuranceStatus}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Route */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Route Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <p className="text-sm text-muted-foreground">From</p>
              <p className="font-semibold text-lg">{lead.sourceCity}</p>
              <p className="text-sm text-muted-foreground">{lead.sourceHospital}</p>
            </div>
            <div className="flex items-center justify-center px-8">
              <div className="w-16 h-px bg-border" />
              <ArrowRight className="w-6 h-6 text-muted-foreground mx-2" />
              <div className="w-16 h-px bg-border" />
            </div>
            <div className="text-center flex-1">
              <p className="text-sm text-muted-foreground">To</p>
              <p className="font-semibold text-lg">{lead.destinationCity}</p>
              <p className="text-sm text-muted-foreground">{lead.destinationHospital}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Timeline */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Status Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {lead.statusHistory.map((log, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className={cn(
                    "w-3 h-3 rounded-full",
                    index === lead.statusHistory.length - 1 ? "bg-accent" : "bg-muted"
                  )} />
                  {index < lead.statusHistory.length - 1 && (
                    <div className="w-px h-8 bg-border" />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className={getStatusBadge(log.status)}>
                      {log.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">By {log.adminUser}</p>
                  {log.notes && (
                    <p className="text-sm mt-1 p-2 bg-secondary/50 rounded">{log.notes}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline">
          <FileText className="w-4 h-4 mr-2" />
          Documents
        </Button>
        <Button variant="outline">Update Status</Button>
        <Button variant="outline">Assign Operator</Button>
        <Button className="gold-gradient text-accent-foreground">Generate Quote</Button>
      </div>
    </div>
  );
};

export default LeadManagement;
