import { useMemo } from 'react';
import { useWasteManagement } from '../context/WasteManagementContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Building2, RefreshCw, Trash2, AlertTriangle, CheckCircle2, Circle } from 'lucide-react';

const Wards = () => {
  const { wards, bins, loading, error, fetchData } = useWasteManagement();

  const wardSummaries = useMemo(() => {
    return wards.map((ward) => {
      const wardBins = bins.filter((bin) => bin.wardId === ward.id);
      return {
        ...ward,
        total: wardBins.length,
        empty: wardBins.filter((bin) => bin.status === 'Empty').length,
        filling: wardBins.filter((bin) => bin.status === 'Filling').length,
        full: wardBins.filter((bin) => bin.status === 'Full').length,
      };
    });
  }, [wards, bins]);

  const totalBins = bins.length;
  const highPriorityWards = wardSummaries.filter((ward) => ward.full > 0).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <main className="p-4 md:p-6 pt-16 md:pt-6">
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-muted rounded-2xl" />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-44 bg-muted rounded-2xl" />
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
          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-center">
            <div className="text-destructive font-semibold mb-2">Error Loading Wards</div>
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
        <Card className="mb-6 overflow-hidden border-0 bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-900 text-white shadow-xl">
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white/90">
                  <Building2 className="h-3.5 w-3.5" />
                  Ward management
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Ward Management</h1>
                  <p className="mt-2 max-w-2xl text-sm text-white/75">
                    Review coverage by ward, identify overloaded areas, and move collection resources where they are needed most.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                  <div className="text-xs uppercase tracking-wide text-white/60">Total wards</div>
                  <div className="mt-1 text-2xl font-semibold">{wards.length}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                  <div className="text-xs uppercase tracking-wide text-white/60">Tracked bins</div>
                  <div className="mt-1 text-2xl font-semibold">{totalBins}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                  <div className="text-xs uppercase tracking-wide text-white/60">Priority wards</div>
                  <div className="mt-1 text-2xl font-semibold">{highPriorityWards}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {wardSummaries.map((ward) => {
            const fillRate = ward.total ? Math.round((ward.full / ward.total) * 100) : 0;

            return (
              <Card key={ward.id} className="border-border/60 shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-primary" />
                        Ward {ward.id}
                      </CardTitle>
                      <CardDescription>{ward.name}</CardDescription>
                    </div>
                    <Badge variant={ward.full ? 'destructive' : 'secondary'}>
                      {ward.full ? 'Needs attention' : 'Stable'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-xl border bg-muted/30 p-3">
                      <div className="text-lg font-bold">{ward.total}</div>
                      <div className="text-xs text-muted-foreground">Total</div>
                    </div>
                    <div className="rounded-xl border bg-muted/30 p-3">
                      <div className="text-lg font-bold text-green-600">{ward.empty}</div>
                      <div className="text-xs text-muted-foreground">Empty</div>
                    </div>
                    <div className="rounded-xl border bg-muted/30 p-3">
                      <div className="text-lg font-bold text-red-600">{ward.full}</div>
                      <div className="text-xs text-muted-foreground">Full</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Full bin rate</span>
                      <span className="font-medium">{fillRate}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500"
                        style={{ width: `${Math.min(fillRate, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs">
                    <Badge variant="outline" className="gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {ward.empty} ready
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      <Circle className="h-3.5 w-3.5" />
                      {ward.filling} filling
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      {ward.full} full
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="mt-6 border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              Ward overview
            </CardTitle>
            <CardDescription>Quick list of every ward and its collection state.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {wardSummaries.map((ward) => (
              <Badge key={ward.id} variant="secondary" className="px-3 py-1.5 text-sm">
                Ward {ward.id}: {ward.total} bins
              </Badge>
            ))}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Wards;
