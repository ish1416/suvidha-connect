import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LayoutDashboard, FileText, AlertTriangle, Settings,
  CreditCard, MessageSquareWarning, FilePlus, Users,
  Activity, Shield, Database, LogOut, TrendingUp,
  Clock, CheckCircle, XCircle, Eye, Download, RefreshCw
} from 'lucide-react';
import { 
  kioskStats, auditLogs, threatAlerts, complaints, 
  serviceRequests, integrityRecords, civicAlerts
} from '@/lib/mockData';
import { toast } from 'sonner';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const transactionData = [
    { name: 'Mon', transactions: 45, revenue: 32500 },
    { name: 'Tue', transactions: 52, revenue: 38200 },
    { name: 'Wed', transactions: 38, revenue: 28100 },
    { name: 'Thu', transactions: 67, revenue: 48900 },
    { name: 'Fri', transactions: 58, revenue: 42300 },
    { name: 'Sat', transactions: 23, revenue: 15800 },
    { name: 'Sun', transactions: 12, revenue: 8400 }
  ];

  const serviceData = [
    { name: 'Electricity', value: 45, color: 'hsl(45, 93%, 47%)' },
    { name: 'Gas', value: 28, color: 'hsl(25, 95%, 53%)' },
    { name: 'Water', value: 27, color: 'hsl(200, 80%, 50%)' }
  ];

  const chartConfig = {
    transactions: { label: 'Transactions', color: 'hsl(var(--primary))' },
    revenue: { label: 'Revenue', color: 'hsl(var(--secondary))' }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today's Transactions</p>
                <p className="text-3xl font-bold">{kioskStats.todayTransactions}</p>
              </div>
              <CreditCard className="w-10 h-10 text-primary opacity-50" />
            </div>
            <div className="mt-4 flex items-center text-sm text-accent">
              <TrendingUp className="w-4 h-4 mr-1" />
              +12% from yesterday
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today's Revenue</p>
                <p className="text-3xl font-bold">₹{kioskStats.todayRevenue.toLocaleString('en-IN')}</p>
              </div>
              <Activity className="w-10 h-10 text-secondary opacity-50" />
            </div>
            <div className="mt-4 flex items-center text-sm text-accent">
              <TrendingUp className="w-4 h-4 mr-1" />
              +8% from yesterday
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Kiosks</p>
                <p className="text-3xl font-bold">{kioskStats.activeKiosks}/{kioskStats.totalKiosks}</p>
              </div>
              <LayoutDashboard className="w-10 h-10 text-accent opacity-50" />
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              {kioskStats.totalKiosks - kioskStats.activeKiosks} offline
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Complaints</p>
                <p className="text-3xl font-bold">{kioskStats.complaintsReceived - kioskStats.complaintsResolved}</p>
              </div>
              <MessageSquareWarning className="w-10 h-10 text-destructive opacity-50" />
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              {kioskStats.complaintsResolved} resolved
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={transactionData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="transactions" fill="hsl(var(--primary))" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Service Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={serviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {serviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="flex justify-center gap-6 mt-4">
              {serviceData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm">{item.name}: {item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Audit Logs</CardTitle>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {auditLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                <div className={`w-2 h-2 rounded-full ${
                  log.action.includes('SUCCESS') ? 'bg-accent' :
                  log.action.includes('FAILED') ? 'bg-destructive' : 'bg-primary'
                }`} />
                <div className="flex-1">
                  <p className="font-medium text-sm">{log.action}</p>
                  <p className="text-xs text-muted-foreground">{log.details}</p>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  <p>{log.kioskId}</p>
                  <p>{new Date(log.timestamp).toLocaleTimeString()}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderComplaints = () => (
    <Card>
      <CardHeader>
        <CardTitle>Complaint Management</CardTitle>
        <CardDescription>Monitor and manage citizen complaints</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {complaints.map((complaint) => (
            <div key={complaint.id} className="flex items-center gap-4 p-4 rounded-lg border">
              <div className={`w-3 h-3 rounded-full ${
                complaint.status === 'resolved' ? 'bg-accent' :
                complaint.status === 'under_review' ? 'bg-primary' :
                complaint.status === 'in_progress' ? 'bg-secondary' : 'bg-muted'
              }`} />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold">{complaint.id}</span>
                  <span className="px-2 py-0.5 text-xs bg-muted rounded capitalize">
                    {complaint.category.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{complaint.description}</p>
                <p className="text-xs text-muted-foreground mt-1">{complaint.location}</p>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 text-xs rounded-full ${
                  complaint.status === 'resolved' ? 'bg-accent/20 text-accent' :
                  complaint.status === 'under_review' ? 'bg-primary/20 text-primary' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {complaint.status.replace('_', ' ')}
                </span>
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(complaint.createdAt).toLocaleDateString()}
                </p>
              </div>
              <Button variant="ghost" size="icon">
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderSecurity = () => (
    <div className="space-y-6">
      {/* Threat Alerts */}
      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            Cyber Threat Monitor
          </CardTitle>
          <CardDescription>AI-driven anomaly detection system</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {threatAlerts.map((threat) => (
            <div key={threat.id} className={`p-4 rounded-lg border-2 ${
              threat.resolved ? 'border-muted bg-muted/30' :
              threat.severity === 'high' ? 'border-destructive/50 bg-destructive/5' :
              threat.severity === 'medium' ? 'border-secondary/50 bg-secondary/5' :
              'border-primary/50 bg-primary/5'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertTriangle className={`w-5 h-5 ${
                    threat.resolved ? 'text-muted-foreground' :
                    threat.severity === 'high' ? 'text-destructive' :
                    threat.severity === 'medium' ? 'text-secondary' : 'text-primary'
                  }`} />
                  <div>
                    <p className="font-medium">{threat.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {threat.kioskId} • {new Date(threat.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs rounded uppercase font-semibold ${
                    threat.resolved ? 'bg-accent text-accent-foreground' :
                    threat.severity === 'high' ? 'bg-destructive text-destructive-foreground' :
                    threat.severity === 'medium' ? 'bg-secondary text-secondary-foreground' :
                    'bg-primary text-primary-foreground'
                  }`}>
                    {threat.resolved ? 'Resolved' : threat.severity}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Integrity Ledger */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-accent" />
            Blockchain Integrity Ledger
          </CardTitle>
          <CardDescription>Tamper-proof transaction verification</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {integrityRecords.map((record, idx) => (
              <div key={record.id} className="p-4 rounded-lg bg-muted/50 font-mono text-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-primary font-bold">Block #{idx + 1}</span>
                  <span className="flex items-center gap-1 text-accent">
                    <CheckCircle className="w-4 h-4" />
                    Verified
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">Type:</span> {record.recordType}
                  </div>
                  <div>
                    <span className="text-muted-foreground">ID:</span> {record.recordId}
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Hash:</span>
                    <span className="ml-2 break-all">{record.hash.substring(0, 32)}...</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Previous:</span>
                    <span className="ml-2 break-all">{record.previousHash.substring(0, 32)}...</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAlerts = () => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Manage Civic Alerts</CardTitle>
          <CardDescription>Create and manage public notifications</CardDescription>
        </div>
        <Button>
          <FilePlus className="w-4 h-4 mr-2" />
          New Alert
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {civicAlerts.map((alert) => (
            <div key={alert.id} className="p-4 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">{alert.title}</h4>
                <span className={`px-2 py-1 text-xs rounded uppercase ${
                  alert.severity === 'critical' ? 'bg-destructive text-destructive-foreground' :
                  alert.severity === 'warning' ? 'bg-secondary text-secondary-foreground' :
                  'bg-primary text-primary-foreground'
                }`}>
                  {alert.severity}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Zones: {alert.zones.join(', ')}</span>
                <span>Expires: {new Date(alert.expiresAt).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="bg-sidebar text-sidebar-foreground">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Shield className="w-10 h-10" />
            <div>
              <h1 className="text-xl font-bold">SUVIDHA Admin Dashboard</h1>
              <p className="text-xs opacity-70">Kiosk Management System</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs opacity-70">Last login: Today, 09:00 AM</p>
            </div>
            <Button variant="destructive" size="sm" onClick={onLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-[calc(100vh-72px)] bg-card border-r p-4">
          <nav className="space-y-2">
            {[
              { id: 'overview', label: 'Overview', icon: LayoutDashboard },
              { id: 'complaints', label: 'Complaints', icon: MessageSquareWarning },
              { id: 'requests', label: 'Service Requests', icon: FilePlus },
              { id: 'security', label: 'Security & Integrity', icon: Shield },
              { id: 'alerts', label: 'Manage Alerts', icon: AlertTriangle },
              { id: 'reports', label: 'Reports', icon: FileText },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === item.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'complaints' && renderComplaints()}
          {activeTab === 'security' && renderSecurity()}
          {activeTab === 'alerts' && renderAlerts()}
          {activeTab === 'requests' && (
            <Card>
              <CardHeader>
                <CardTitle>Service Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {serviceRequests.map((req) => (
                    <div key={req.id} className="p-4 rounded-lg border flex items-center justify-between">
                      <div>
                        <p className="font-mono font-bold">{req.referenceNumber}</p>
                        <p className="text-sm text-muted-foreground">{req.applicantName} - {req.type.replace('_', ' ')}</p>
                      </div>
                      <span className={`px-3 py-1 text-xs rounded-full ${
                        req.status === 'approved' ? 'bg-accent/20 text-accent' :
                        req.status === 'under_review' ? 'bg-primary/20 text-primary' :
                        'bg-muted'
                      }`}>
                        {req.status}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          {activeTab === 'reports' && (
            <Card>
              <CardHeader>
                <CardTitle>Generate Reports</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {['Daily Transaction Report', 'Weekly Complaint Summary', 'Monthly Revenue Report', 'Audit Trail Export'].map((report) => (
                  <div key={report} className="flex items-center justify-between p-4 rounded-lg border">
                    <span>{report}</span>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
          {activeTab === 'settings' && (
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">System configuration options coming soon...</p>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
