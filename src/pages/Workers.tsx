import { useEffect, useMemo, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { driverService } from '../services';
import { MapPin, RefreshCw, Route, Users } from 'lucide-react';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

type Driver = {
  driverId: string;
  wardId: number;
  lat: number;
  lng: number;
};

const createDriverIcon = () =>
  L.divIcon({
    className: 'driver-marker',
    html: `
      <div style="
        width: 16px;
        height: 16px;
        background: hsl(217, 91%, 55%);
        border: 2px solid white;
        border-radius: 9999px;
        box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.18);
      "></div>
    `,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -8],
  });

function MapBounds({ drivers }: { drivers: Driver[] }) {
  const map = useMap();

  useEffect(() => {
    if (!drivers.length) return;
    const bounds = L.latLngBounds(drivers.map((driver) => [driver.lat, driver.lng]));
    map.fitBounds(bounds.pad(0.2), { animate: true });
  }, [drivers, map]);

  return null;
}

function MapSizeFix({ deps }: { deps: string }) {
  const map = useMap();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      map.invalidateSize();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [deps, map]);

  return null;
}

const Workers = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadDrivers = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await driverService.getDrivers();
      const normalized = Array.isArray(response)
        ? response.map((item: any) => ({
            driverId: String(item.driverId ?? ''),
            wardId: Number(item.wardId ?? 0),
            lat: Number(item.lat ?? 0),
            lng: Number(item.lng ?? 0),
          }))
        : [];

      setDrivers(normalized);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to load drivers');
      setDrivers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDrivers();
  }, []);

  const summary = useMemo(() => {
    const wards = new Set(drivers.map((driver) => driver.wardId)).size;
    return {
      total: drivers.length,
      wards,
    };
  }, [drivers]);

  const mapCenter: [number, number] = drivers.length
    ? [drivers[0].lat, drivers[0].lng]
    : [28.6139, 77.209];

  return (
    <div className="min-h-screen bg-background">
      <main className="p-4 md:p-6 pt-16 md:pt-6">
        <Card className="mb-6 overflow-hidden border-0 bg-gradient-to-r from-slate-950 via-blue-950 to-cyan-950 text-white shadow-xl">
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white/90">
                  <Users className="h-3.5 w-3.5" />
                  Driver operations
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Workers</h1>
                  <p className="mt-2 max-w-2xl text-sm text-white/75">
                    Live driver locations loaded from the backend and shown on the map and in the worker list.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                  <div className="text-xs uppercase tracking-wide text-white/60">Drivers</div>
                  <div className="mt-1 text-2xl font-semibold">{summary.total}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                  <div className="text-xs uppercase tracking-wide text-white/60">Wards covered</div>
                  <div className="mt-1 text-2xl font-semibold">{summary.wards}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            {error}
          </div>
        )}

        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="text-sm text-muted-foreground">
            Showing {drivers.length} driver{drivers.length === 1 ? '' : 's'} on the fleet map
          </div>
          <Button variant="outline" onClick={loadDrivers} disabled={loading} className="gap-2">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <Card className="border-border/60 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Driver Map
              </CardTitle>
              <CardDescription>Markers show each driver’s live position from the `/drivers` API.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative h-[560px] min-h-[560px] rounded-lg overflow-hidden border border-border bg-muted/20">
                {loading && drivers.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                    Loading drivers...
                  </div>
                ) : (
                  <MapContainer
                    key={`drivers-${mapCenter[0]}-${mapCenter[1]}-${drivers.length}`}
                    center={mapCenter}
                    zoom={13}
                    className="absolute inset-0 h-full w-full"
                    zoomControl={true}
                    scrollWheelZoom={true}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapSizeFix deps={`${drivers.length}`} />
                    <MapBounds drivers={drivers} />

                    {drivers.map((driver) => (
                      <Marker key={driver.driverId} position={[driver.lat, driver.lng]} icon={createDriverIcon()}>
                        <Popup>
                          <div className="space-y-2 text-sm">
                            <div className="font-semibold">{driver.driverId}</div>
                            <div className="text-muted-foreground">
                              <div>Ward: {driver.wardId}</div>
                              <div>Lat/Lng: {driver.lat.toFixed(4)}, {driver.lng.toFixed(4)}</div>
                            </div>
                          </div>
                        </Popup>
                        <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                          {driver.driverId}
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
              <CardTitle className="flex items-center gap-2">
                <Route className="w-5 h-5" />
                Driver List
              </CardTitle>
              <CardDescription>All drivers returned by the backend.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-h-[560px] overflow-auto rounded-lg border border-border">
                <table className="w-full text-left text-sm">
                  <thead className="sticky top-0 bg-background/95 backdrop-blur">
                    <tr className="border-b">
                      <th className="px-4 py-3 font-medium">Driver ID</th>
                      <th className="px-4 py-3 font-medium">Ward</th>
                      <th className="px-4 py-3 font-medium">Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td className="px-4 py-8 text-center text-muted-foreground" colSpan={3}>
                          Loading drivers...
                        </td>
                      </tr>
                    ) : drivers.length ? (
                      drivers.map((driver) => (
                        <tr key={driver.driverId} className="border-b">
                          <td className="px-4 py-3 font-medium">{driver.driverId}</td>
                          <td className="px-4 py-3">
                            <Badge variant="secondary">Ward {driver.wardId}</Badge>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {driver.lat.toFixed(4)}, {driver.lng.toFixed(4)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="px-4 py-8 text-center text-muted-foreground" colSpan={3}>
                          No drivers found.
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

export default Workers;
