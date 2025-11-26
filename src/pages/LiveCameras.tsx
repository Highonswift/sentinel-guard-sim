import { useState, useMemo } from 'react';
import { Camera, Detection } from '@/lib/dummyData';
import { CameraTile } from '@/components/CameraTile';
import { SnapshotModal } from '@/components/SnapshotModal';

interface LiveCamerasProps {
  cameras: Camera[];
  detections: Detection[];
  onMarkAction: (id: string, action: 'Real' | 'False', comment?: string) => void;
}

export default function LiveCameras({ cameras, detections, onMarkAction }: LiveCamerasProps) {
  const [selectedDetection, setSelectedDetection] = useState<Detection | null>(null);

  // Memoize detection mapping to prevent unnecessary re-renders
  const detectionMap = useMemo(() => {
    const map = new Map<string, Detection>();
    cameras.forEach(camera => {
      const cameraDetections = detections
        .filter(d => d.cameraId === camera.id)
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      if (cameraDetections[0]) {
        map.set(camera.id, cameraDetections[0]);
      }
    });
    return map;
  }, [cameras, detections]);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Live Camera Feed</h1>
        <p className="text-muted-foreground">Real-time monitoring - 12 cameras active</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {cameras.map(camera => (
          <CameraTile
            key={camera.id}
            camera={camera}
            detection={detectionMap.get(camera.id) || null}
            onClick={() => {
              const det = detectionMap.get(camera.id);
              if (det) setSelectedDetection(det);
            }}
          />
        ))}
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
