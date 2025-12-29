import { AdminLayout } from "@admin/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Plane,
  Users,
  AlertTriangle,
  Clock,
  TrendingUp,
  Activity,
  MapPin,
  Phone,
  ArrowRight,
} from "lucide-react";
import { airAmbulanceLeads, airAmbulanceAircraft, airAmbulanceOperators } from "@admin/data/airAmbulanceData";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  
  const criticalLeads = airAmbulanceLeads.filter(l => l.emergencyLevel === "Critical");
  const activeLeads = airAmbulanceLeads.filter(l => l.status === "Mission Active");
  const availableAircraft = airAmbulanceAircraft.filter(a => a.availability === "Available");
  const pendingLeads = airAmbulanceLeads.filter(l => l.status === "New Lead" || l.status === "Medical Review");

  const stats = [
    {
      title: "Critical Missions",
      value: criticalLeads.length,
      icon: AlertTriangle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
      description: "Requiring immediate attention",
    },
    {
      title: "Active Missions",
      value: activeLeads.length,
      icon: Activity,
      color: "text-success",
      bgColor: "bg-success/10",
      description: "Currently in progress",
    },
    {
      title: "Available Aircraft",
      value: availableAircraft.length,
      icon: Plane,
      color: "text-primary",
      bgColor: "bg-primary/10",
      description: `of ${airAmbulanceAircraft.length} total fleet`,
    },
    {
      title: "Active Operators",
      value: airAmbulanceOperators.filter(o => o.status === "Active").length,
      icon: Users,
      color: "text-accent",
      bgColor: "bg-accent/10",
      description: "Ready for dispatch",
    },
  ];

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
      "New Lead": "bg-blue-500/20 text-blue-700 dark:text-blue-300",
      "Medical Review": "bg-purple-500/20 text-purple-700 dark:text-purple-300",
      "Mission Active": "bg-success/20 text-success",
      "Completed": "bg-muted text-muted-foreground",
    };
    return config[status] || "bg-muted text-muted-foreground";
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Emergency Banner */}
        {criticalLeads.filter(l => l.status !== "Completed" && l.status !== "Closed").length > 0 && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-destructive" />
              <div>
                <p className="font-semibold text-destructive">
                  {criticalLeads.filter(l => l.status !== "Completed" && l.status !== "Closed").length} Critical Mission(s) Active
                </p>
                <p className="text-sm text-muted-foreground">Immediate attention required</p>
              </div>
            </div>
            <Button 
              variant="destructive" 
              size="lg" 
              className="gap-2"
              onClick={() => navigate("/admin/air-ambulance/leads")}
            >
              <Phone className="w-4 h-4" />
              View Critical Leads
            </Button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.description}</p>
                  </div>
                  <div className={cn("p-3 rounded-xl", stat.bgColor)}>
                    <stat.icon className={cn("w-6 h-6", stat.color)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pending Leads */}
          <Card className="lg:col-span-2 border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-warning" />
                Pending Leads
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate("/admin/air-ambulance/leads")}
              >
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {pendingLeads.slice(0, 4).map((lead) => (
                <div
                  key={lead.id}
                  className="p-4 bg-secondary/50 rounded-xl border border-border hover:border-accent/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-foreground">{lead.patientName}</span>
                        <Badge className={getEmergencyBadge(lead.emergencyLevel)}>
                          {lead.emergencyLevel}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{lead.id}</p>
                    </div>
                    <Badge variant="outline" className={getStatusBadge(lead.status)}>
                      {lead.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <MapPin className="w-4 h-4" />
                    <span>{lead.sourceCity}</span>
                    <ArrowRight className="w-4 h-4" />
                    <span>{lead.destinationCity}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{lead.patientCondition}</p>
                </div>
              ))}
              {pendingLeads.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No pending leads at this time
                </div>
              )}
            </CardContent>
          </Card>

          {/* Fleet Status */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plane className="w-5 h-5 text-primary" />
                Fleet Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {airAmbulanceAircraft.slice(0, 5).map((aircraft) => (
                <div
                  key={aircraft.id}
                  className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg border border-border"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-3 h-3 rounded-full",
                      aircraft.availability === "Available" && "bg-success",
                      aircraft.availability === "On Mission" && "bg-warning",
                      aircraft.availability === "Maintenance" && "bg-destructive",
                      aircraft.availability === "Standby" && "bg-blue-500",
                    )} />
                    <div>
                      <p className="text-sm font-medium text-foreground">{aircraft.registration}</p>
                      <p className="text-xs text-muted-foreground">{aircraft.baseLocation}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {aircraft.availability}
                  </Badge>
                </div>
              ))}
              <Button 
                variant="outline" 
                className="w-full mt-2"
                onClick={() => navigate("/admin/air-ambulance/fleet")}
              >
                View Full Fleet
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Operator Performance */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-success" />
              Operator Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {airAmbulanceOperators.map((operator) => (
                <div
                  key={operator.id}
                  className="p-4 bg-secondary/50 rounded-xl border border-border"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-foreground">{operator.companyName}</h4>
                    <Badge variant={operator.status === "Active" ? "default" : "secondary"}>
                      {operator.status}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">SLA Rating</span>
                      <span className="font-medium text-foreground">{operator.slaRating}/5.0</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Missions</span>
                      <span className="font-medium text-foreground">{operator.totalMissions}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Success Rate</span>
                      <span className="font-medium text-success">{operator.successRate}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Avg Response</span>
                      <span className="font-medium text-foreground">{operator.responseTime}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
