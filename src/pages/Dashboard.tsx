import { useState, useEffect } from 'react';
import { useWasteManagement } from '../context/WasteManagementContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  Users, 
  RefreshCw,
  MapPin
} from 'lucide-react';

const Dashboard = () => {
  const { stats, loading, error, fetchData } = useWasteManagement();
  const [timeRange, setTimeRange] = useState('24h');

  // Mock data for charts since we don't have historical data from API
  const binStatusData = [
    { name: 'Empty', value: stats?.emptyBins || 0, color: '#10b981' },
    { name: 'Filling', value: stats?.fillingBins || 0, color: '#f59e0b' },
    { name: 'Full', value: stats?.fullBins || 0, color: '#ef4444' }
  ];

  const collectionData = [
    { time: '00:00', collections: 2 },
    { time: '04:00', collections: 1 },
    { time: '08:00', collections: 12 },
    { time: '12:00', collections: 18 },
    { time: '16:00', collections: 15 },
    { time: '20:00', collections: 8 },
    { time: '24:00', collections: 6 }
  ];

  const statusColors = {
    Full: 'bg-red-500',
    Filling: 'bg-yellow-500', 
    Empty: 'bg-green-500'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <main className="md:ml-[240px] p-4 md:p-6 pt-16 md:pt-6">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <main className="md:ml-[240px] p-4 md:p-6 pt-16 md:pt-6">
          <div className="text-center py-8">
            <div className="text-destructive font-semibold mb-2">Error Loading Dashboard</div>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchData} variant="outline">
              Retry
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="md:ml-[240px] p-4 md:p-6 pt-16 md:pt-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Waste Management Dashboard</h1>
            <p className="text-sm text-muted-foreground">Real-time monitoring and analytics</p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              onClick={fetchData} 
              variant="outline" 
              size="sm"
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Badge variant="secondary">Live Data</Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bins</CardTitle>
              <MapPin className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalBins || 0}</div>
              <p className="text-xs text-muted-foreground">All monitored bins</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Full Bins</CardTitle>
              <AlertTriangle className="w-4 h-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats?.fullBins || 0}</div>
              <p className="text-xs text-muted-foreground">Requires immediate attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Filling Bins</CardTitle>
              <TrendingUp className="w-4 h-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats?.fillingBins || 0}</div>
              <p className="text-xs text-muted-foreground">Monitoring required</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Empty Bins</CardTitle>
              <CheckCircle className="w-4 h-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats?.emptyBins || 0}</div>
              <p className="text-xs text-muted-foreground">Available capacity</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Drivers</CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.activeDrivers || 0}</div>
              <p className="text-xs text-muted-foreground">Currently on duty</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Bin Status Distribution */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Bin Status Distribution</CardTitle>
              <CardDescription>Current status across all bins</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={binStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {binStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center space-x-4 mt-4">
                {binStatusData.map((item) => (
                  <div key={item.name} className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm font-medium">{item.name}</span>
                    <span className="text-sm text-muted-foreground">({item.value})</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Collection Trends */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Collection Trends</CardTitle>
              <CardDescription>Collection activity over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end mb-4">
                <div className="flex space-x-2">
                  {['24h', '7d', '30d'].map((range) => (
                    <Button
                      key={range}
                      variant={timeRange === range ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTimeRange(range)}
                    >
                      {range}
                    </Button>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={collectionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="collections" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>System Performance</CardTitle>
            <CardDescription>Key performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">94%</div>
                <div className="text-sm text-muted-foreground">Collection Efficiency</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">2.1h</div>
                <div className="text-sm text-muted-foreground">Avg Response Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">156</div>
                <div className="text-sm text-muted-foreground">Bins/Day Capacity</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">A+</div>
                <div className="text-sm text-muted-foreground">System Rating</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;