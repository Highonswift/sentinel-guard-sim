import { Camera, Detection } from '@/lib/dummyData';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface AnalyticsProps {
  cameras: Camera[];
  detections: Detection[];
}

export default function Analytics({ cameras, detections }: AnalyticsProps) {
  // Accuracy per camera
  const accuracyData = cameras.map(cam => ({
    name: cam.name,
    accuracy: Math.round(cam.accuracy),
  }));

  // False vs Real alerts
  const alertData = [
    { name: 'Real Alerts', value: detections.filter(d => d.action === 'Real').length, color: '#EF4444' },
    { name: 'False Alerts', value: detections.filter(d => d.action === 'False').length, color: '#F59E0B' },
    { name: 'Pending', value: detections.filter(d => d.action === 'Pending').length, color: '#06B6D4' },
  ];

  // Alert density per zone
  const zoneData = Array.from(new Set(cameras.map(c => c.zone))).map(zone => ({
    zone,
    alerts: detections.filter(d => d.zone === zone && d.isAlert).length,
  }));

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Performance metrics and insights</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Accuracy Chart */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Camera Accuracy Scores</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={accuracyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94A3B8" className="text-mono" />
              <YAxis stroke="#94A3B8" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155' }}
                labelStyle={{ color: '#00E5FF' }}
              />
              <Bar dataKey="accuracy" fill="#00E5FF" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Alert Distribution */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Alert Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={alertData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {alertData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Zone Alert Density */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Alert Density by Zone</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={zoneData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="zone" stroke="#94A3B8" />
              <YAxis stroke="#94A3B8" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155' }}
                labelStyle={{ color: '#00E5FF' }}
              />
              <Bar dataKey="alerts" fill="#EF4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Low Reliability Cameras */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Low Reliability Cameras (&lt;40%)</h2>
          <div className="space-y-3">
            {cameras.filter(c => c.accuracy < 40).length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No cameras with low reliability</p>
            ) : (
              cameras.filter(c => c.accuracy < 40).map(cam => (
                <div key={cam.id} className="flex items-center justify-between p-3 bg-destructive/10 border border-destructive/50 rounded-lg">
                  <div>
                    <p className="font-semibold text-mono">{cam.name}</p>
                    <p className="text-xs text-muted-foreground">{cam.zone}</p>
                  </div>
                  <span className="text-lg font-bold text-destructive text-mono">
                    {cam.accuracy.toFixed(1)}%
                  </span>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
