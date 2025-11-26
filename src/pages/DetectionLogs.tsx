import { useState } from 'react';
import { Detection } from '@/lib/dummyData';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SnapshotModal } from '@/components/SnapshotModal';
import { Eye } from 'lucide-react';

interface DetectionLogsProps {
  detections: Detection[];
  onMarkAction: (id: string, action: 'Real' | 'False', comment?: string) => void;
}

export default function DetectionLogs({ detections, onMarkAction }: DetectionLogsProps) {
  const [selectedDetection, setSelectedDetection] = useState<Detection | null>(null);
  const [filterCamera, setFilterCamera] = useState('all');
  const [filterObject, setFilterObject] = useState('all');
  const [filterAction, setFilterAction] = useState('all');

  const filteredDetections = detections.filter(d => {
    if (filterCamera !== 'all' && d.cameraId !== filterCamera) return false;
    if (filterObject !== 'all' && d.object !== filterObject) return false;
    if (filterAction !== 'all' && d.action !== filterAction) return false;
    return true;
  }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  const cameras = Array.from(new Set(detections.map(d => d.cameraId)));
  const objects = Array.from(new Set(detections.map(d => d.object)));

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Detection Logs</h1>
        <p className="text-muted-foreground">Complete detection history with filters</p>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <Select value={filterCamera} onValueChange={setFilterCamera}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Cameras" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cameras</SelectItem>
            {cameras.map(cam => (
              <SelectItem key={cam} value={cam}>{cam}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterObject} onValueChange={setFilterObject}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Objects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Objects</SelectItem>
            {objects.map(obj => (
              <SelectItem key={obj} value={obj}>{obj}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterAction} onValueChange={setFilterAction}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Actions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Real">Real</SelectItem>
            <SelectItem value="False">False</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" onClick={() => {
          setFilterCamera('all');
          setFilterObject('all');
          setFilterAction('all');
        }}>
          Clear Filters
        </Button>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Camera</TableHead>
              <TableHead>Object</TableHead>
              <TableHead>Confidence</TableHead>
              <TableHead>Zone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDetections.map(detection => (
              <TableRow key={detection.id}>
                <TableCell className="text-mono text-xs">
                  {detection.timestamp.toLocaleTimeString()}
                </TableCell>
                <TableCell className="font-semibold text-mono">{detection.camera}</TableCell>
                <TableCell>
                  <Badge variant={detection.isAlert ? 'destructive' : 'secondary'}>
                    {detection.object}
                  </Badge>
                </TableCell>
                <TableCell className="text-mono font-bold text-primary">
                  {detection.confidence}%
                </TableCell>
                <TableCell>{detection.zone}</TableCell>
                <TableCell>
                  {detection.zoneMasked ? (
                    <Badge variant="outline">Zone Masked</Badge>
                  ) : detection.isAlert ? (
                    <Badge className="bg-destructive animate-pulse">ALERT</Badge>
                  ) : (
                    <Badge variant="secondary">Normal</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={
                    detection.action === 'Real' ? 'destructive' :
                    detection.action === 'False' ? 'outline' : 'secondary'
                  }>
                    {detection.action}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSelectedDetection(detection)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <SnapshotModal
        detection={selectedDetection}
        open={!!selectedDetection}
        onClose={() => setSelectedDetection(null)}
        onMarkAction={onMarkAction}
      />
    </div>
  );
}
