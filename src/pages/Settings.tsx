import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import { Badge } from '../components/ui/badge';
import { Settings, MapPinned, BellRing, Save, MonitorSmartphone, Palette } from 'lucide-react';

const STORAGE_KEY = 'hackathon-waste-settings';

const SettingsPage = () => {
  const [followLocation, setFollowLocation] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [compactMode, setCompactMode] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setFollowLocation(Boolean(parsed.followLocation ?? true));
        setNotificationsEnabled(Boolean(parsed.notificationsEnabled ?? true));
        setCompactMode(Boolean(parsed.compactMode ?? false));
      }
    } catch {
      // Ignore malformed saved settings.
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        followLocation,
        notificationsEnabled,
        compactMode,
      })
    );
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="p-4 md:p-6 pt-16 md:pt-6">
        <Card className="mb-6 overflow-hidden border-0 bg-gradient-to-r from-slate-950 via-violet-950 to-slate-900 text-white shadow-xl">
          <CardContent className="p-6 md:p-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white/90">
                <Settings className="h-3.5 w-3.5" />
                Preferences
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Settings</h1>
                <p className="mt-2 max-w-2xl text-sm text-white/75">
                  Tune the app to match the way your team works. These preferences are stored locally in the browser.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="border-border/60 shadow-sm lg:col-span-2">
            <CardHeader>
              <CardTitle>Experience</CardTitle>
              <CardDescription>Control how the dashboard behaves for the current user.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between gap-4 rounded-xl border bg-muted/20 p-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-medium">
                    <MapPinned className="h-4 w-4 text-primary" />
                    Follow my location on the map
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Centers the map on your browser location when available.
                  </p>
                </div>
                <Switch checked={followLocation} onCheckedChange={setFollowLocation} />
              </div>

              <div className="flex items-center justify-between gap-4 rounded-xl border bg-muted/20 p-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-medium">
                    <BellRing className="h-4 w-4 text-primary" />
                    Enable notifications
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Show operational alerts and routing updates.
                  </p>
                </div>
                <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
              </div>

              <div className="flex items-center justify-between gap-4 rounded-xl border bg-muted/20 p-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-medium">
                    <MonitorSmartphone className="h-4 w-4 text-primary" />
                    Compact layout
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Reduce spacing to fit more data on smaller screens.
                  </p>
                </div>
                <Switch checked={compactMode} onCheckedChange={setCompactMode} />
              </div>

              <Button onClick={handleSave} className="gap-2">
                <Save className="h-4 w-4" />
                Save settings
              </Button>

              {saved && (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                  Settings saved locally in this browser.
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Current status
              </CardTitle>
              <CardDescription>Quick summary of the active preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Badge variant="secondary" className="w-full justify-start px-3 py-2">
                Location follow: {followLocation ? 'On' : 'Off'}
              </Badge>
              <Badge variant="secondary" className="w-full justify-start px-3 py-2">
                Notifications: {notificationsEnabled ? 'Enabled' : 'Disabled'}
              </Badge>
              <Badge variant="secondary" className="w-full justify-start px-3 py-2">
                Compact mode: {compactMode ? 'Enabled' : 'Disabled'}
              </Badge>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
