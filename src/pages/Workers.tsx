import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { workers, notifications } from '../data/mockData';
import { Users, MapPin, TrendingUp, RefreshCw, Bell, ShieldCheck } from 'lucide-react';

const Workers = () => {
  const stats = useMemo(() => {
    const active = workers.filter((worker) => worker.status !== 'offline').length;
    const totalTasks = workers.reduce((sum, worker) => sum + worker.tasksCompleted, 0);
    const averageEfficiency = Math.round(
      workers.reduce((sum, worker) => sum + worker.efficiency, 0) / workers.length
    );

    return { active, totalTasks, averageEfficiency };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <main className="p-4 md:p-6 pt-16 md:pt-6">
        <Card className="mb-6 overflow-hidden border-0 bg-gradient-to-r from-slate-950 via-blue-950 to-cyan-950 text-white shadow-xl">
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white/90">
                  <Users className="h-3.5 w-3.5" />
                  Team operations
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Workers</h1>
                  <p className="mt-2 max-w-2xl text-sm text-white/75">
                    See who is on duty, how much they’ve completed, and which routes need attention.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                  <div className="text-xs uppercase tracking-wide text-white/60">Active</div>
                  <div className="mt-1 text-2xl font-semibold">{stats.active}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                  <div className="text-xs uppercase tracking-wide text-white/60">Tasks completed</div>
                  <div className="mt-1 text-2xl font-semibold">{stats.totalTasks}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                  <div className="text-xs uppercase tracking-wide text-white/60">Avg efficiency</div>
                  <div className="mt-1 text-2xl font-semibold">{stats.averageEfficiency}%</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
          <div className="grid gap-4 md:grid-cols-2">
            {workers.map((worker, index) => (
              <motion.div
                key={worker.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="h-full border-border/60 shadow-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                            {worker.avatar}
                          </div>
                          {worker.name}
                        </CardTitle>
                        <CardDescription>{worker.id}</CardDescription>
                      </div>
                      <Badge variant={worker.status === 'offline' ? 'secondary' : 'default'}>
                        {worker.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl border bg-muted/30 p-3">
                        <div className="text-xs text-muted-foreground">Tasks completed</div>
                        <div className="mt-1 text-xl font-bold">{worker.tasksCompleted}</div>
                      </div>
                      <div className="rounded-xl border bg-muted/30 p-3">
                        <div className="text-xs text-muted-foreground">Efficiency</div>
                        <div className="mt-1 text-xl font-bold text-emerald-600">{worker.efficiency}%</div>
                      </div>
                    </div>

                    {worker.currentRoute ? (
                      <div className="flex items-center gap-2 rounded-xl border bg-muted/20 px-3 py-2 text-sm">
                        <MapPin className="h-4 w-4 text-primary" />
                        Current route: {worker.currentRoute}
                      </div>
                    ) : (
                      <div className="rounded-xl border bg-muted/20 px-3 py-2 text-sm text-muted-foreground">
                        No active route assigned
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      <span className="text-sm text-muted-foreground">
                        {worker.status === 'on-duty' ? 'Live duty tracking enabled' : 'Ready for deployment'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="space-y-4">
            <Card className="border-border/60 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Alerts
                </CardTitle>
                <CardDescription>Recent operational notices for the team.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {notifications.slice(0, 4).map((item) => (
                  <div key={item.id} className="rounded-xl border bg-muted/20 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-medium">{item.title}</div>
                      <Badge variant={item.priority === 'high' ? 'destructive' : 'secondary'}>
                        {item.priority}
                      </Badge>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{item.message}</p>
                    <div className="mt-2 text-xs text-muted-foreground">{item.timestamp}</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-border/60 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5" />
                  Team sync
                </CardTitle>
                <CardDescription>Keep the fleet coordinated and safe.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Sync worker statuses
                </Button>
                <Button variant="outline" className="w-full gap-2">
                  <Users className="h-4 w-4" />
                  Review assignments
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Workers;
