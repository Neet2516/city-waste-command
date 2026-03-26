import { useState, useMemo } from 'react';
import { useWasteManagement } from '../context/WasteManagementContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { 
  Search, 
  Filter, 
  RefreshCw,
  Edit,
  CheckCircle,
  AlertTriangle,
  Circle,
  MapPin,
  Calendar
} from 'lucide-react';
import { format } from 'date-fns';

const Bins = () => {
  const { bins, wards, loading, error, updateBinStatus, updateFilters, filters, fetchData } = useWasteManagement();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  const [editingBin, setEditingBin] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  // Status color mapping
  const getStatusColor = (status) => {
    switch (status) {
      case 'Full': return 'bg-red-500';
      case 'Filling': return 'bg-yellow-500';
      case 'Empty': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  // Filtered and searched bins
  const filteredBins = useMemo(() => {
    return bins.filter(bin => {
      const matchesSearch = bin.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           bin.wardId.toString().includes(searchTerm.toLowerCase());
      const matchesStatus = !selectedStatus || bin.status === selectedStatus;
      const matchesWard = !selectedWard || bin.wardId === parseInt(selectedWard);
      return matchesSearch && matchesStatus && matchesWard;
    });
  }, [bins, searchTerm, selectedStatus, selectedWard]);

  const handleStatusUpdate = async (binId, status) => {
    try {
      await updateBinStatus(binId, status);
      setEditingBin(null);
      setNewStatus('');
    } catch (err) {
      console.error('Failed to update bin status:', err);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Full': return <AlertTriangle className="w-4 h-4" />;
      case 'Filling': return <Circle className="w-4 h-4" />;
      case 'Empty': return <CheckCircle className="w-4 h-4" />;
      default: return <Circle className="w-4 h-4" />;
    }
  };

  const getStatusIconColor = (status) => {
    switch (status) {
      case 'Full': return 'text-red-500';
      case 'Filling': return 'text-yellow-500';
      case 'Empty': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <main className="p-4 md:p-6 pt-16 md:pt-6">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
            <div className="space-y-4">
              <div className="h-12 bg-muted rounded"></div>
              <div className="h-96 bg-muted rounded"></div>
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
            <div className="text-destructive font-semibold mb-2">Error Loading Bins</div>
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
            <h1 className="text-2xl font-bold text-foreground">Bin Management</h1>
            <p className="text-sm text-muted-foreground">Manage and monitor waste bins across the city</p>
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
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters
            </CardTitle>
            <CardDescription>Filter bins by status, ward, or search</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search by Bin ID or Ward ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Empty">Empty</SelectItem>
                    <SelectItem value="Filling">Filling</SelectItem>
                    <SelectItem value="Full">Full</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Ward Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Ward</label>
                <Select value={selectedWard} onValueChange={setSelectedWard}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Wards" />
                  </SelectTrigger>
                  <SelectContent>
                    {wards.map((ward) => (
                      <SelectItem key={ward.id} value={ward.id.toString()}>
                        {ward.name} (Ward {ward.id})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Actions</label>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedStatus('');
                      setSelectedWard('');
                    }}
                  >
                    Clear Filters
                  </Button>
                  <Button onClick={fetchData} variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Sync Data
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-muted-foreground">
            Showing {filteredBins.length} of {bins.length} bins
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Empty: {bins.filter(b => b.status === 'Empty').length}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Filling: {bins.filter(b => b.status === 'Filling').length}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Full: {bins.filter(b => b.status === 'Full').length}</span>
            </div>
          </div>
        </div>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>Bin Inventory</CardTitle>
            <CardDescription>Complete list of all monitored bins</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bin ID</TableHead>
                    <TableHead>Ward</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBins.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No bins found matching your criteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredBins.map((bin) => (
                      <TableRow key={bin._id} className="hover:bg-muted/50">
                        <TableCell className="font-mono font-medium">{bin.id}</TableCell>
                        <TableCell>
                          <Badge variant="outline">Ward {bin.wardId}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${getStatusColor(bin.status)}`}></div>
                            <span className="font-medium">{bin.status}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{bin.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span>{bin.lat.toFixed(4)}, {bin.lng.toFixed(4)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span>{format(new Date(bin.lastUpdated), 'MMM dd, yyyy HH:mm')}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {editingBin === bin._id ? (
                            <div className="flex items-center gap-2">
                              <Select value={newStatus} onValueChange={setNewStatus}>
                                <SelectTrigger className="w-32">
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Empty">Empty</SelectItem>
                                  <SelectItem value="Filling">Filling</SelectItem>
                                  <SelectItem value="Full">Full</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button 
                                size="sm" 
                                onClick={() => handleStatusUpdate(bin._id, newStatus)}
                                disabled={!newStatus}
                              >
                                Update
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => setEditingBin(null)}
                              >
                                Cancel
                              </Button>
                            </div>
                          ) : (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => setEditingBin(bin._id)}
                              className="flex items-center gap-2"
                            >
                              <Edit className="w-4 h-4" />
                              Update Status
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Bins;
