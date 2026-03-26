import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useWasteManagement } from '../context/WasteManagementContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { 
  RefreshCw,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Circle,
  Filter
} from 'lucide-react';

// Fix for Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const MapView = () => {
  const { bins, wards, loading, error, fetchData } = useWasteManagement();
  const [selectedWard, setSelectedWard] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [mapCenter, setMapCenter] = useState([40.7128, -74.0060]); // Default to city center

  // Filter bins based on selections
  const filteredBins = bins.filter(bin => {
    const matchesWard = !selectedWard || bin.wardId === parseInt(selectedWard);
    const matchesStatus = !selectedStatus || bin.status === selectedStatus;
    return matchesWard && matchesStatus;
  });

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Full': return '#ef4444'; // Red
      case 'Filling': return '#f59e0b'; // Yellow
      case 'Empty': return '#10b981'; // Green
      default: return '#6b7280'; // Gray
    }
  };

  // Create custom marker icon
  const createMarkerIcon = (status) => {
    const color = getStatusColor(status);
    const size = status === 'Full' ? 16 : 12;
    return L.divIcon({
      className: 'custom-bin-marker',
      html: `
        <div style="
          width: ${size}px; height: ${size}px;
          background: ${color};
          border: 2px solid white;
          border-radius: 50%;
          box-shadow: 0 0 8px ${color}80;
          cursor: pointer;
        "></div>
      `,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });
  };

  // Fit map bounds to show all bins
  const MapBounds = () => {
    const map = useMap();
    useEffect(() => {
      if (filteredBins.length > 0) {
        const bounds = L.latLngBounds(filteredBins.map(bin => [bin.lat, bin.lng]));
        map.fitBounds(bounds.pad(0.3), { animate: true });
      }
    }, [filteredBins, map]);
    return null;
  };

  // Handle ward selection
  const handleWardSelect = (wardId) => {
    setSelectedWard(wardId);
    if (wardId) {
      // Find a bin in the selected ward to center the map
      const wardBin = bins.find(bin => bin.wardId === parseInt(wardId));
      if (wardBin) {
        setMapCenter([wardBin.lat, wardBin.lng]);
      }
    } else {
      setMapCenter([40.7128, -74.0060]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <main className="md:ml-[240px] p-4 md:p-6 pt-16 md:pt-6">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
            <div className="h-96 bg-muted rounded"></div>
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
            <div className="text-destructive font-semibold mb-2">Error Loading Map</div>
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
            <h1 className="text-2xl font-bold text-foreground">City Map View</h1>
            <p className="text-sm text-muted-foreground">Interactive map of all waste bins</p>
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
          </div>
        </div>

        {/* Controls */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Map Filters
            </CardTitle>
            <CardDescription>Filter bins displayed on the map</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Ward Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Filter by Ward</label>
                <Select value={selectedWard} onValueChange={handleWardSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Wards" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Wards</SelectItem>
                    {wards.map((ward) => (
                      <SelectItem key={ward.id} value={ward.id.toString()}>
                        {ward.name} (Ward {ward.id})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Filter by Status</label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Statuses</SelectItem>
                    <SelectItem value="Empty">Empty</SelectItem>
                    <SelectItem value="Filling">Filling</SelectItem>
                    <SelectItem value="Full">Full</SelectItem>
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
                      setSelectedWard('');
                      setSelectedStatus('');
                      setMapCenter([40.7128, -74.0060]);
                    }}
                  >
                    Clear Filters
                  </Button>
                  <Button onClick={fetchData} variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh Data
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-muted-foreground">
            Showing {filteredBins.length} of {bins.length} bins on map
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Empty</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Filling</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Full</span>
            </div>
          </div>
        </div>

        {/* Map */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Waste Bin Locations
            </CardTitle>
            <CardDescription>Real-time bin status across the city</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[500px] rounded-lg overflow-hidden border border-border">
              <MapContainer
                center={mapCenter}
                zoom={13}
                className="h-full w-full"
                zoomControl={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />
                <MapBounds />
                
                {filteredBins.map((bin) => (
                  <Marker
                    key={bin._id}
                    position={[bin.lat, bin.lng]}
                    icon={createMarkerIcon(bin.status)}
                  >
                    <Popup className="bin-popup" closeButton={false}>
                      <div className="p-3 min-w-[200px] text-sm space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-foreground">{bin.id}</span>
                          <Badge variant="outline" className={`text-xs ${bin.status === 'Full' ? 'bg-red-100 text-red-800' : bin.status === 'Filling' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                            {bin.status}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <div>Ward: {bin.wardId}</div>
                          <div>Category: {bin.category}</div>
                          <div>Location: {bin.lat.toFixed(4)}, {bin.lng.toFixed(4)}</div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Last Updated: {new Date(bin.lastUpdated).toLocaleString()}
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </CardContent>
        </Card>

        {/* Legend */}
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Map Legend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <div>
                  <div className="font-medium">Empty Bins</div>
                  <div className="text-muted-foreground">Ready for use</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                <div>
                  <div className="font-medium">Filling Bins</div>
                  <div className="text-muted-foreground">Monitoring required</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <div>
                  <div className="font-medium">Full Bins</div>
                  <div className="text-muted-foreground">Immediate attention needed</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default MapView;