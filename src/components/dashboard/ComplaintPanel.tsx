import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { complaintService } from "@/services";
import { AlertTriangle, ImageIcon, MapPin, MessageSquareWarning } from "lucide-react";

type Complaint = {
  _id: string;
  wardId: number;
  lat: number;
  lng: number;
  message: string;
  imageUrl: string | null;
  createdAt: string;
};

const formatDateTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const ComplaintPanel = () => {
  const [wardFilter, setWardFilter] = useState("all");
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [wardOptions, setWardOptions] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadComplaints = async (selectedWard = wardFilter) => {
    setLoading(true);
    setError("");

    try {
      const response =
        selectedWard === "all"
          ? await complaintService.getComplaints()
          : await complaintService.getComplaintsByWard(selectedWard);

      const normalized = Array.isArray(response?.complaints) ? response.complaints : [];
      const mapped = normalized.map((item: any) => ({
          _id: String(item._id ?? ""),
          wardId: Number(item.wardId ?? 0),
          lat: Number(item.lat ?? 0),
          lng: Number(item.lng ?? 0),
          message: String(item.message ?? ""),
          imageUrl: item.imageUrl ?? null,
          createdAt: String(item.createdAt ?? ""),
        }));

      setComplaints(mapped);
      if (selectedWard === "all") {
        setWardOptions(Array.from(new Set(mapped.map((item) => item.wardId))).sort((a, b) => a - b));
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to load complaints");
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints("all");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visibleComplaints = useMemo(() => complaints, [complaints]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="card-elevated p-4"
    >
      <div className="flex items-center justify-between mb-4 gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
            <MessageSquareWarning className="w-4 h-4 text-destructive" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Complaint Panel</h3>
            <p className="text-xs text-muted-foreground">{visibleComplaints.length} complaint{visibleComplaints.length === 1 ? "" : "s"}</p>
          </div>
        </div>

        <div className="w-[180px]">
          <Select
            value={wardFilter}
            onValueChange={(value) => {
              setWardFilter(value);
              loadComplaints(value);
            }}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="All Wards" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Wards</SelectItem>
              {wardOptions.map((wardId) => (
                <SelectItem key={wardId} value={String(wardId)}>
                  Ward {wardId}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {error && (
        <div className="mb-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <div className="space-y-3 max-h-[360px] overflow-y-auto scrollbar-thin">
        {loading ? (
          <div className="rounded-lg border bg-muted/20 p-4 text-sm text-muted-foreground">Loading complaints...</div>
        ) : visibleComplaints.length ? (
          visibleComplaints.map((complaint, index) => (
            <motion.div
              key={complaint._id || index}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.04 }}
              className="rounded-xl border bg-muted/20 p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2 min-w-0">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                  <div className="min-w-0">
                    <div className="font-medium text-sm text-foreground line-clamp-2">{complaint.message}</div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        Ward {complaint.wardId}
                      </span>
                      <span>{formatDateTime(complaint.createdAt)}</span>
                    </div>
                  </div>
                </div>
                <Badge variant="secondary">Complaint</Badge>
              </div>

              <div className="mt-3">
                {complaint.imageUrl ? (
                  <img
                    src={complaint.imageUrl}
                    alt={`Complaint ${complaint._id}`}
                    className="h-36 w-full rounded-lg object-cover border"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-36 items-center justify-center rounded-lg border bg-background text-xs text-muted-foreground gap-2">
                    <ImageIcon className="h-4 w-4" />
                    No image provided
                  </div>
                )}
              </div>
            </motion.div>
          ))
        ) : (
          <div className="rounded-lg border bg-muted/20 p-4 text-sm text-muted-foreground">
            No complaints found for the selected ward.
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ComplaintPanel;
