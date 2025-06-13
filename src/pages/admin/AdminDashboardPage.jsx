import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  MessageSquare,
  Zap,
  KeyRound,
  BarChart,
  Bell,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Bot,
  Activity,
  Clock,
  Download,
  LineChart,
  PieChart,
  Calendar,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const StatCard = ({ title, value, icon, linkTo, trend, description }) => (
  <Link to={linkTo}>
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {React.cloneElement(icon, { className: "h-5 w-5 text-muted-foreground" })}
      </CardHeader>
      <CardContent>
        <div className="space-y-1.5">
          <div className="flex items-baseline space-x-2">
            <div className="text-2xl font-bold">{value}</div>
            {trend && (
              <div className={`flex items-center text-sm ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {trend > 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                <span>{Math.abs(trend)}%</span>
              </div>
            )}
          </div>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  </Link>
);

const NotificationCard = ({ title, message, type = "info", time }) => (
  <Card className={`border-l-4 ${type === 'warning' ? 'border-l-yellow-500' : 'border-l-blue-500'}`}>
    <CardHeader className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {type === 'warning' ? 
            <AlertTriangle className="h-5 w-5 text-yellow-500" /> : 
            <Bell className="h-5 w-5 text-blue-500" />
          }
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </div>
        <time className="text-xs text-muted-foreground">{time}</time>
      </div>
      <CardDescription className="mt-1">{message}</CardDescription>
    </CardHeader>
  </Card>
);

const ResourceUsage = ({ label, used, total, unit = "GB" }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-sm">
      <span className="font-medium">{label}</span>
      <span className="text-muted-foreground">
        {used}/{total} {unit}
      </span>
    </div>
    <Progress value={(used/total) * 100} className="h-2" />
    <p className="text-xs text-muted-foreground">
      {Math.round((used/total) * 100)}% utilized
    </p>
  </div>
);

const RecentActivity = ({ activities }) => (
  <div className="space-y-4">
    {activities.map((activity, index) => (
      <div key={index} className="flex items-start space-x-3">
        <div className="relative mt-1">
          <Activity className="h-5 w-5 text-muted-foreground" />
          {index !== activities.length - 1 && (
            <div className="absolute top-5 bottom-0 left-2.5 w-px bg-muted-foreground/20" />
          )}
        </div>
        <div className="flex-1 space-y-1">
          <p className="text-sm">{activity.description}</p>
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="mr-1 h-3 w-3" />
            <time>{activity.time}</time>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const Chart = ({ title, chart: ChartComponent, data, options, className }) => (
  <Card className={className}>
    <CardHeader>
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="h-[200px]">
        <ChartComponent data={data} options={options} />
      </div>
    </CardContent>
  </Card>
);

const AdminDashboardPage = () => {
  // Mock data - replace with real data in production
  const notifications = [
    { 
      title: "System Update", 
      message: "New version 2.1.0 is available for deployment", 
      type: "info",
      time: "5 min ago"
    },
    { 
      title: "High CPU Usage", 
      message: "Server CPU usage exceeded 80% in the last hour", 
      type: "warning",
      time: "1 hour ago"
    },
  ];

  const recentActivities = [
    {
      description: "New agent 'Customer Support Bot' deployed by admin",
      time: "10 minutes ago"
    },
    {
      description: "System backup completed successfully",
      time: "1 hour ago"
    },
    {
      description: "5 new API keys generated for client 'Acme Corp'",
      time: "2 hours ago"
    },
    {
      description: "Flow 'Order Processing' updated with new guardrails",
      time: "3 hours ago"
    }
  ];

  // Chart data
  const usageData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'API Calls',
        data: [3000, 4500, 3800, 5200, 4800, 3900, 4200],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const agentDistribution = {
    labels: ['Active', 'Idle', 'Error', 'Maintenance'],
    datasets: [
      {
        data: [45, 25, 15, 15],
        backgroundColor: [
          'rgb(34, 197, 94)',
          'rgb(99, 102, 241)',
          'rgb(239, 68, 68)',
          'rgb(234, 179, 8)',
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
          <Button>
            <LineChart className="mr-2 h-4 w-4" />
            View Analytics
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Users" 
          value="1,234" 
          icon={<Users />} 
          linkTo="/admin/users"
          trend={12}
          description="Active users in the last 30 days" 
        />
        <StatCard 
          title="Active Agents" 
          value="45" 
          icon={<Bot />} 
          linkTo="/admin/agents"
          trend={8}
          description="Deployed and running agents" 
        />
        <StatCard 
          title="Managed Flows" 
          value="89" 
          icon={<Zap />} 
          linkTo="/admin/flows"
          trend={-5}
          description="Total configured workflows" 
        />
        <StatCard 
          title="API Usage" 
          value="2.3M" 
          icon={<Activity />} 
          linkTo="/admin/apikeys"
          trend={15}
          description="API calls in the last 24 hours" 
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Chart
          title="API Usage Trends"
          chart={Line}
          data={usageData}
          options={chartOptions}
          className="col-span-2 md:col-span-1"
        />
        <Chart
          title="Agent Distribution"
          chart={Pie}
          data={agentDistribution}
          options={pieOptions}
          className="col-span-2 md:col-span-1"
        />
      </div>

      {/* Activity & Notifications */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="relative mt-1">
                    <Activity className="h-5 w-5 text-muted-foreground" />
                    {index !== recentActivities.length - 1 && (
                      <div className="absolute top-5 bottom-0 left-2.5 w-px bg-muted-foreground/20" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm">{activity.description}</p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="mr-1 h-3 w-3" />
                      <time>{activity.time}</time>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>System Notifications</CardTitle>
            <CardDescription>Important alerts and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notifications.map((notification, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 rounded-lg border p-4"
                >
                  <div className={`mt-0.5 ${
                    notification.type === 'warning' ? 'text-yellow-500' : 'text-blue-500'
                  }`}>
                    {notification.type === 'warning' ? (
                      <AlertTriangle className="h-5 w-5" />
                    ) : (
                      <Bell className="h-5 w-5" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="font-medium">{notification.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {notification.message}
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="mr-1 h-3 w-3" />
                      <time>{notification.time}</time>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
