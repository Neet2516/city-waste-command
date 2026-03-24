import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { bins, type Bin } from "@/data/mockData";
import { motion } from "framer-motion";

function getColor(fillLevel: number): string {
  if (fillLevel >= 80) return "hsl(0, 72%, 51%)";
  if (fillLevel >= 50) return "hsl(38, 92%, 50%)";
  return "hsl(152, 60%, 45%)";
}

function createBinIcon(fillLevel: number) {
  const color = getColor(fillLevel);
  const size = fillLevel >= 80 ? 16 : 12;
  return L.divIcon({
    className: "custom-bin-marker",
    html: `<div style="
      width: ${size}px; height: ${size}px;
      background: ${color};
      border: 2px solid white;
      border-radius: 50%;
      box-shadow: 0 0 8px ${color}80;
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

// Optimized route connecting full bins
const routeCoords: [number, number][] = bins
  .filter((b) => b.fillLevel >= 50)
  .sort((a, b) => b.fillLevel - a.fillLevel)
  .map((b) => [b.lat, b.lng]);

function MapBounds() {
  const map = useMap();
  useEffect(() => {
    const bounds = L.latLngBounds(bins.map((b) => [b.lat, b.lng]));
    map.fitBounds(bounds.pad(0.3));
  }, [map]);
  return null;
}

function BinPopupContent({ bin }: { bin: Bin }) {
  const color = getColor(bin.fillLevel);
  return (
    <div className="p-3 min-w-[200px] text-sm space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-foreground">{bin.id}</span>
        <span className="text-xs font-mono font-semibold" style={{ color }}>{bin.fillLevel}%</span>
      </div>
      <p className="text-xs text-muted-foreground">{bin.location}</p>
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${bin.fillLevel}%`, backgroundColor: color }} />
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
        <div><span className="font-medium text-foreground">Last:</span> {bin.lastCollected}</div>
        <div><span className="font-medium text-foreground">Worker:</span> {bin.assignedWorker}</div>
      </div>
      <div className="text-xs font-medium text-primary">
        AI Prediction: Full in {bin.predictedFullTime}
      </div>
    </div>
  );
}

interface Props {
  showRoutes?: boolean;
}

const BinMap = ({ showRoutes = false }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="card-elevated p-4 h-[420px] md:h-[460px] relative overflow-hidden"
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">City Bin Network</h3>
          <p className="text-xs text-muted-foreground">{bins.length} bins monitored • Real-time status</p>
        </div>
        <div className="flex gap-3 text-[10px] font-medium">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-secondary" />Empty</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: "hsl(38, 92%, 50%)" }} />Half</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-destructive" />Full</span>
        </div>
      </div>
      <div className="h-[calc(100%-48px)] rounded-lg overflow-hidden border border-border">
        <MapContainer
          center={[40.7128, -74.006]}
          zoom={14}
          className="h-full w-full"
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          <MapBounds />
          {bins.map((bin) => (
            <Marker key={bin.id} position={[bin.lat, bin.lng]} icon={createBinIcon(bin.fillLevel)}>
              <Popup className="bin-popup" closeButton={false}>
                <BinPopupContent bin={bin} />
              </Popup>
            </Marker>
          ))}
          {showRoutes && routeCoords.length > 1 && (
            <Polyline
              positions={routeCoords}
              pathOptions={{ color: "hsl(217, 91%, 55%)", weight: 3, dashArray: "8 6", opacity: 0.8 }}
            />
          )}
        </MapContainer>
      </div>
    </motion.div>
  );
};

export default BinMap;
