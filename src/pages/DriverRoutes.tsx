import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { MapContainer, Marker, Popup, TileLayer, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { routeService } from '../services';
import { AlertTriangle, MapPin, RefreshCw, Route, ShieldCheck } from 'lucide-react';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

type RoutePoint = {
  id: string;
  wardId: number;
  lat: number;
  lng: number;
  status: string;
  category: string;
  lastUpdated: string;
};

type RouteParams = {
  driverId: string;
  ward: string;
  lat: string;
  lng: string;
};

const defaultRouteParams: RouteParams = {
  driverId: 'D1',
  ward: '1',
  lat: '28.6139',
  lng: '77.2090',
};

const formatDateTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
};

const getMarkerColor = (status: string) => (status === 'Full' ? '#ef4444' : '#22c55e');

const createMarkerIcon = (status: string) =>
  L.divIcon({
    className: 'route-marker',
    html: `
      <div style="
        width: 16px;
        height: 16px;
        background: ${getMarkerColor(status)};
        border: 2px solid white;
        border-radius: 9999px;
        box-shadow: 0 0 0 4px ${getMarkerColor(status)}22;
      "></div>
    `,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -8],
  });

function RouteBounds({ points }: { points: RoutePoint[] }) {
  const map = useMap();

  useEffect(() => {
    if (!points.length) return;
    const bounds = L.latLngBounds(points.map((point) => [point.lat, point.lng]));
    map.fitBounds(bounds.pad(0.2), { animate: true });
  }, [map, points]);

  return null;
}

function RouteSizeFix({ deps }: { deps: string }) {
  const map = useMap();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      map.invalidateSize();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [map, deps]);

  return null;
}

const DriverRoutes = () => {
  const [params, setParams] = useState<RouteParams>(defaultRouteParams);
  const [routePoints, setRoutePoints] = useState<RoutePoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadRoute = async (nextParams: RouteParams = params) => {
    setLoading(true);
    setError('');

    try {
      const response = await routeService.getDriverRoute(nextParams);
      const normalized = Array.isArray(response)
        ? response.map((item: any) => ({
            id: String(item.id ?? ''),
            wardId: Number(item.wardId ?? nextParams.ward ?? 0),
            lat: Number(item.lat ?? nextParams.lat ?? 0),
            lng: Number(item.lng ?? nextParams.lng ?? 0),
            status: String(item.status ?? ''),
            category: String(item.category ?? ''),
            lastUpdated: String(item.lastUpdated ?? ''),
          }))
        : [];

      setRoutePoints(normalized);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to load driver route');
      setRoutePoints([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoute(defaultRouteParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const summary = useMemo(() => {
    const full = routePoints.filter((point) => point.status === 'Full').length;
    return {
      total: routePoints.length,
      full,
      active: routePoints.length - full,
      categories: new Set(routePoints.map((point) => point.category)).size,
    };
  }, [routePoints]);

  const mapCenter: [number, number] = routePoints.length
    ? [routePoints[0].lat, routePoints[0].lng]
    : [Number(params.lat) || 28.6139, Number(params.lng) || 77.2090];

  const handleChange = (field: keyof RouteParams) => (event: ChangeEvent<HTMLInputElement>) => {
    setParams((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    loadRoute(params);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.12),_transparent_35%),linear-gradient(180deg,_rgba(2,6,23,0.02),_transparent_35%)]">
      <main className="p-4 md:p-6 pt-16 md:pt-6">
        <Card className="mb-6 overflow-hidden border-0 bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 text-white shadow-xl">
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white/90">
                  <Route className="h-3.5 w-3.5" />
                  Driver route planning
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Driver Routes</h1>
                  <p className="mt-2 max-w-2xl text-sm text-white/75">
                    Search a driver route by driver ID, ward, and coordinates. The API response is mapped onto a dedicated route map and table.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-4">
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                  <div className="text-xs uppercase tracking-wide text-white/60">Locations</div>
                  <div className="mt-1 text-2xl font-semibold">{summary.total}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                  <div className="text-xs uppercase tracking-wide text-white/60">Full</div>
                  <div className="mt-1 text-2xl font-semibold text-red-300">{summary.full}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                  <div className="text-xs uppercase tracking-wide text-white/60">Active</div>
                  <div className="mt-1 text-2xl font-semibold text-emerald-300">{summary.active}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                  <div className="text-xs uppercase tracking-wide text-white/60">Categories</div>
                  <div className="mt-1 text-2xl font-semibold">{summary.categories}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" />
              Route Parameters
            </CardTitle>
            <CardDescription>Change the driver, ward, latitude, and longitude to load another route.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4 xl:grid-cols-[1fr_1fr_1fr_1fr_auto]" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-medium">Driver ID</label>
                <Input value={params.driverId} onChange={handleChange('driverId')} placeholder="D1" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Ward</label>
                <Input value={params.ward} onChange={handleChange('ward')} placeholder="1" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Latitude</label>
                <Input value={params.lat} onChange={handleChange('lat')} placeholder="28.6139" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Longitude</label>
                <Input value={params.lng} onChange={handleChange('lng')} placeholder="77.2090" />
              </div>
              <div className="flex items-end">
                <Button type="submit" className="w-full gap-2" disabled={loading}>
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  Load Route
                </Button>
              </div>
            </form>

            {error && (
              <div className="mt-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                <AlertTriangle className="mt-0.5 h-4 w-4" />
                <div className="flex-1">{error}</div>
                <Button type="button" variant="outline" size="sm" onClick={() => loadRoute(params)}>
                  Retry
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="border-border/60 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Route Map
              </CardTitle>
              <CardDescription>Red markers mean Full, green markers mean everything else.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative h-[520px] min-h-[520px] rounded-lg overflow-hidden border border-border bg-muted/20">
                {loading && routePoints.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                    Loading driver route...
                  </div>
                ) : (
                  <MapContainer
                    key={`route-${mapCenter[0]}-${mapCenter[1]}-${params.driverId}-${params.ward}-${routePoints.length}`}
                    center={mapCenter}
                    zoom={14}
                    className="absolute inset-0 h-full w-full"
                    zoomControl={true}
                    scrollWheelZoom={true}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <RouteSizeFix deps={`${params.driverId}-${params.ward}-${routePoints.length}`} />
                    <RouteBounds points={routePoints} />

                    {routePoints.map((point) => (
                      <Marker key={point.id} position={[point.lat, point.lng]} icon={createMarkerIcon(point.status)}>
                        <Popup>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between gap-3">
                              <span className="font-semibold">Bin {point.id}</span>
                              <Badge variant={point.status === 'Full' ? 'destructive' : 'secondary'}>{point.status}</Badge>
                            </div>
                            <div className="text-muted-foreground">
                              <div>ID: {point.id}</div>
                              <div>Ward: {point.wardId}</div>
                              <div>Category: {point.category}</div>
                              <div>Lat/Lng: {point.lat.toFixed(4)}, {point.lng.toFixed(4)}</div>
                              <div>Last Updated: {formatDateTime(point.lastUpdated)}</div>
                            </div>
                          </div>
                        </Popup>
                        <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                          {point.id} • {point.status}
                        </Tooltip>
                      </Marker>
                    ))}
                  </MapContainer>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-md">
            <CardHeader>
              <CardTitle>Route List</CardTitle>
              <CardDescription>All returned locations in a compact table.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-h-[520px] overflow-auto rounded-lg border border-border">
                <table className="w-full text-left text-sm">
                  <thead className="sticky top-0 bg-background/95 backdrop-blur">
                    <tr className="border-b">
                      <th className="px-4 py-3 font-medium">ID</th>
                      <th className="px-4 py-3 font-medium">Coords</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {routePoints.length ? (
                      routePoints.map((point) => {
                        const isFull = point.status === 'Full';

                        return (
                          <tr
                            key={point.id}
                            className={`border-b transition-colors ${
                              isFull ? 'bg-red-50/70 hover:bg-red-50' : 'bg-emerald-50/50 hover:bg-emerald-50/80'
                            }`}
                          >
                            <td className="px-4 py-3 font-medium">{point.id}</td>
                            <td className="px-4 py-3">
                              <div>{point.lat.toFixed(4)}</div>
                              <div className="text-xs text-muted-foreground">{point.lng.toFixed(4)}</div>
                            </td>
                            <td className="px-4 py-3">
                              <Badge variant={isFull ? 'destructive' : 'secondary'}>{point.status}</Badge>
                            </td>
                            <td className="px-4 py-3 capitalize">{point.category}</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td className="px-4 py-8 text-center text-muted-foreground" colSpan={4}>
                          {loading ? 'Loading route data...' : 'No route data loaded yet.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default DriverRoutes;
