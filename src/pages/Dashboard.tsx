import { useState, useEffect } from 'react';
import { useWasteManagement } from '../context/WasteManagementContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import api from '../services/api';
import { statsService } from '../services';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
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
  const [timeRange, setTimeRange] = useState('30d');
  const [collectionData, setCollectionData] = useState<Array<{ time: string; collections: number }>>([]);
  const [categoryData, setCategoryData] = useState<Array<{ category: string; total: number; full: number; filling: number; empty: number }>>([]);
  const [trendsLoading, setTrendsLoading] = useState(false);
  const [trendsError, setTrendsError] = useState<string | null>(null);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  // Mock data for charts since we don't have historical data from API
  const binStatusData = [
    { name: 'Empty', value: stats?.emptyBins || 0, color: '#10b981' },
    { name: 'Filling', value: stats?.fillingBins || 0, color: '#f59e0b' },
    { name: 'Full', value: stats?.fullBins || 0, color: '#ef4444' }
  ];
  const maxCollectionValue = Math.max(0, ...collectionData.map((item) => item.collections));
  const yAxisMax = Math.max(10, Math.ceil(maxCollectionValue / 10) * 10);
  const yAxisTicks = Array.from({ length: yAxisMax / 10 + 1 }, (_, index) => index * 10);

  useEffect(() => {
    let cancelled = false;

    const loadTrends = async () => {
      setTrendsLoading(true);
      setTrendsError(null);

      try {
        const response = await api.get('/stats/trends', {
          params: { range: timeRange },
        });
        const payload = response.data ?? {};
        const labels = Array.isArray(payload.labels)
          ? payload.labels
          : Array.isArray(payload.data?.labels)
            ? payload.data.labels
            : [];

        const rawSeries = Array.isArray(payload.data)
          ? payload.data
          : Array.isArray(payload.data?.data)
            ? payload.data.data
            : Array.isArray(payload.data?.values)
              ? payload.data.values
              : Array.isArray(payload.data?.collections)
                ? payload.data.collections
                : Array.isArray(payload.values)
                  ? payload.values
                  : Array.isArray(payload.collections)
                    ? payload.collections
                    : Array.isArray(payload.counts)
                      ? payload.counts
                      : Array.isArray(payload.data?.counts)
                        ? payload.data.counts
                        : Array.isArray(payload.series?.[0]?.data)
                          ? payload.series[0].data
                          : Array.isArray(payload.data?.series?.[0]?.data)
                            ? payload.data.series[0].data
                            : [];

        const normalized = labels.map((label: string, index: number) => ({
          time: label,
          collections: Number(rawSeries[index] ?? 0),
        }));

        if (!cancelled) {
          setCollectionData(normalized);
        }
      } catch (err) {
        if (!cancelled) {
          setTrendsError(err?.response?.data?.message || err?.message || 'Failed to load trends data');
          setCollectionData([]);
        }
      } finally {
        if (!cancelled) {
          setTrendsLoading(false);
        }
      }
    };

    loadTrends();

    return () => {
      cancelled = true;
    };
  }, [timeRange]);

  useEffect(() => {
    let cancelled = false;

    const loadCategories = async () => {
      setCategoriesLoading(true);
      setCategoriesError(null);

      try {
        const response = await statsService.getCategoryStats();
        const normalized = Array.isArray(response)
          ? response.map((item) => ({
              category: item._id,
              total: Number(item.total ?? 0),
              full: Number(item.full ?? 0),
              filling: Number(item.filling ?? 0),
              empty: Number(item.empty ?? 0),
            }))
          : [];

        if (!cancelled) {
          setCategoryData(normalized);
        }
      } catch (err) {
        if (!cancelled) {
          setCategoriesError(err?.response?.data?.message || err?.message || 'Failed to load category stats');
          setCategoryData([]);
        }
      } finally {
        if (!cancelled) {
          setCategoriesLoading(false);
        }
      }
    };

    loadCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  const statusColors = {
    Full: 'bg-red-500',
    Filling: 'bg-yellow-500', 
    Empty: 'bg-green-500'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <main className="p-4 md:p-6 pt-16 md:pt-6">
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
        <main className="p-4 md:p-6 pt-16 md:pt-6">
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
      <main className="p-4 md:p-6 pt-16 md:pt-6">
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
              Sync Data
            </Button>
            <Badge variant="secondary">Manual Sync</Badge>
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
              {trendsLoading ? (
                <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
                  Loading collection trends...
                </div>
              ) : trendsError ? (
                <div className="flex h-[200px] items-center justify-center text-sm text-destructive text-center">
                  {trendsError}
                </div>
              ) : (
                <div className="overflow-x-hidden">
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={collectionData}>
                    <CartesianGrid strokeDasharray="3 3" horizontal vertical strokeOpacity={0.35} />
                    <XAxis dataKey="time" interval="preserveStartEnd" minTickGap={20} tickMargin={8} />
                    <YAxis
                      domain={[0, yAxisMax]}
                      ticks={yAxisTicks}
                      allowDecimals={false}
                      interval={0}
                      width={40}
                    />
                    <Tooltip />
                    <Line type="monotone" dataKey="collections" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Category Breakdown */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Waste Category Breakdown</CardTitle>
            <CardDescription>Bin distribution by waste type and status</CardDescription>
          </CardHeader>
          <CardContent>
            {categoriesLoading ? (
              <div className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">
                Loading category stats...
              </div>
            ) : categoriesError ? (
              <div className="flex h-[280px] items-center justify-center text-sm text-destructive text-center">
                {categoriesError}
              </div>
            ) : (
              <div className="overflow-x-hidden">
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart
                    data={categoryData}
                    layout="vertical"
                    margin={{ top: 8, right: 24, left: 24, bottom: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal vertical strokeOpacity={0.35} />
                    <XAxis type="number" allowDecimals={false} tickMargin={8} />
                    <YAxis
                      type="category"
                      dataKey="category"
                      width={90}
                      tickMargin={8}
                    />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="full" stackId="status" fill="#ef4444" radius={[0, 6, 6, 0]} />
                    <Bar dataKey="filling" stackId="status" fill="#f59e0b" radius={[0, 6, 6, 0]} />
                    <Bar dataKey="empty" stackId="status" fill="#10b981" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
