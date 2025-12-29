import { AdminLayout } from "@admin/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DollarSign,
  Users,
  Plane,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const revenueData = [
  { month: "Jan", revenue: 120000 },
  { month: "Feb", revenue: 150000 },
  { month: "Mar", revenue: 180000 },
  { month: "Apr", revenue: 220000 },
  { month: "May", revenue: 190000 },
  { month: "Jun", revenue: 280000 },
  { month: "Jul", revenue: 320000 },
];

const operatorData = [
  { name: "JetSet Aviation", bookings: 45 },
  { name: "SkyHigh Charters", bookings: 38 },
  { name: "Elite Wings", bookings: 32 },
  { name: "AirLux Services", bookings: 28 },
  { name: "Premier Jets", bookings: 22 },
];

const recentBookings = [
  {
    id: "BK001",
    client: "Rajesh Sharma",
    route: "DEL → JAI",
    date: "Dec 18, 2024",
    amount: "₹4,50,000",
    status: "completed",
  },
  {
    id: "BK002",
    client: "Priya Mehta",
    route: "MUM → GOA",
    date: "Dec 19, 2024",
    amount: "₹3,20,000",
    status: "pending",
  },
  {
    id: "BK003",
    client: "Vikram Industries",
    route: "BLR → HYD",
    date: "Dec 20, 2024",
    amount: "₹2,80,000",
    status: "approved",
  },
  {
    id: "BK004",
    client: "Ananya Singh",
    route: "DEL → MUM",
    date: "Dec 21, 2024",
    amount: "₹5,10,000",
    status: "pending",
  },
];

const kpiCards = [
  {
    title: "Total Revenue",
    value: "₹32.4L",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    description: "vs last month",
  },
  {
    title: "Active Leads",
    value: "156",
    change: "+8.2%",
    trend: "up",
    icon: Users,
    description: "new this week",
  },
  {
    title: "Total Flights",
    value: "89",
    change: "-2.1%",
    trend: "down",
    icon: Plane,
    description: "this month",
  },
  {
    title: "Conversion Rate",
    value: "24.8%",
    change: "+4.3%",
    trend: "up",
    icon: TrendingUp,
    description: "from leads",
  },
];

const statusColors: Record<string, string> = {
  completed: "bg-success/10 text-success",
  pending: "bg-warning/10 text-warning",
  approved: "bg-accent/10 text-accent",
  cancelled: "bg-destructive/10 text-destructive",
};

const Dashboard = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening today.</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiCards.map((kpi) => (
            <Card key={kpi.title} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                    <kpi.icon className="w-6 h-6 text-accent" />
                  </div>
                  <div
                    className={`flex items-center gap-1 text-sm font-medium ${
                      kpi.trend === "up" ? "text-success" : "text-destructive"
                    }`}
                  >
                    {kpi.trend === "up" ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                    {kpi.change}
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
                  <p className="text-sm text-muted-foreground">{kpi.title}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
              <CardDescription>Monthly revenue for the current year</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(43, 96%, 56%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(43, 96%, 56%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" tickFormatter={(value) => `₹${value / 1000}k`} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number) => [`₹${value.toLocaleString()}`, "Revenue"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="hsl(43, 96%, 56%)"
                      strokeWidth={2}
                      fill="url(#revenueGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Top Operators */}
          <Card>
            <CardHeader>
              <CardTitle>Top Operators</CardTitle>
              <CardDescription>By number of bookings this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={operatorData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis type="number" className="text-xs" />
                    <YAxis dataKey="name" type="category" className="text-xs" width={100} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="bookings" fill="hsl(43, 96%, 56%)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>Latest charter booking requests</CardDescription>
              </div>
              <Calendar className="w-5 h-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                      ID
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                      Client
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                      Route
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                      Amount
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-3 px-4 text-sm font-mono text-foreground">{booking.id}</td>
                      <td className="py-3 px-4 text-sm font-medium text-foreground">
                        {booking.client}
                      </td>
                      <td className="py-3 px-4 text-sm text-foreground">{booking.route}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{booking.date}</td>
                      <td className="py-3 px-4 text-sm font-semibold text-foreground">
                        {booking.amount}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                            statusColors[booking.status]
                          }`}
                        >
                          {booking.status}
                        </span>
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

export default Dashboard;