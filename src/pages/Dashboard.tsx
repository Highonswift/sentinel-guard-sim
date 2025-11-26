import { Camera, Detection } from '@/lib/dummyData';
import { Card } from '@/components/ui/card';
import { AlertTriangle, Video, CheckCircle, XCircle, TrendingUp } from 'lucide-react';

interface DashboardProps {
  cameras: Camera[];
  detections: Detection[];
}

export default function Dashboard({ cameras, detections }: DashboardProps) {
  const activeAlerts = detections.filter(d => d.isAlert && d.action === 'Pending').length;
  const onlineCameras = cameras.filter(c => c.online).length;
  const falseAlertsToday = detections.filter(d => d.action === 'False').length;
  const topCameras = [...cameras].sort((a, b) => b.accuracy - a.accuracy).slice(0, 3);
  const lowAccuracyCameras = cameras.filter(c => c.accuracy < 40);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Security Dashboard</h1>
        <p className="text-muted-foreground">Real-time monitoring overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 border-destructive/50 bg-gradient-to-br from-card to-destructive/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Alerts</p>
              <p className="text-4xl font-bold text-destructive mt-2">{activeAlerts}</p>
            </div>
            <AlertTriangle className="w-12 h-12 text-destructive animate-pulse" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Cameras Online</p>
              <p className="text-4xl font-bold text-success mt-2">{onlineCameras}/12</p>
            </div>
            <Video className="w-12 h-12 text-success" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">False Alerts Today</p>
              <p className="text-4xl font-bold text-warning mt-2">{falseAlertsToday}</p>
            </div>
            <XCircle className="w-12 h-12 text-warning" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">System Status</p>
              <p className="text-lg font-bold text-primary mt-2">OPERATIONAL</p>
            </div>
            <CheckCircle className="w-12 h-12 text-primary" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold">Top Accurate Cameras</h2>
          </div>
          <div className="space-y-3">
            {topCameras.map((cam, idx) => (
              <div key={cam.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-primary text-mono">#{idx + 1}</span>
                  <div>
                    <p className="font-semibold text-mono">{cam.name}</p>
                    <p className="text-xs text-muted-foreground">{cam.zone}</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-primary text-mono">{cam.accuracy.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Maintenance Required */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-warning" />
            <h2 className="text-xl font-bold">Cameras Needing Maintenance</h2>
          </div>
          {lowAccuracyCameras.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="w-12 h-12 mx-auto mb-2 text-success" />
              <p>All cameras performing well</p>
            </div>
          ) : (
            <div className="space-y-3">
              {lowAccuracyCameras.map(cam => (
                <div key={cam.id} className="flex items-center justify-between p-3 bg-warning/10 border border-warning/50 rounded-lg">
                  <div>
                    <p className="font-semibold text-mono">{cam.name}</p>
                    <p className="text-xs text-muted-foreground">{cam.zone}</p>
                  </div>
                  <span className="text-lg font-bold text-warning text-mono">{cam.accuracy.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
