import { useState } from 'react';
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

  const getLatestDetection = (cameraId: string) => {
    const cameraDetections = detections
      .filter(d => d.cameraId === cameraId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    return cameraDetections[0] || null;
  };

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
            detection={getLatestDetection(camera.id)}
            onClick={() => {
              const det = getLatestDetection(camera.id);
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
