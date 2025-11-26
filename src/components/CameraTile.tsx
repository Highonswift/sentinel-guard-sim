import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Camera, Detection } from '@/lib/dummyData';
import { Video, AlertTriangle } from 'lucide-react';

interface CameraTileProps {
  camera: Camera;
  detection: Detection | null;
  onClick: () => void;
}

export const CameraTile = ({ camera, detection, onClick }: CameraTileProps) => {
  const [confidence, setConfidence] = useState(0);

  useEffect(() => {
    if (detection) {
      setConfidence(0);
      const timer = setTimeout(() => setConfidence(detection.confidence), 100);
      return () => clearTimeout(timer);
    }
  }, [detection]);

  const isAlert = detection?.isAlert;

  return (
    <div
      onClick={onClick}
      className={cn(
        'relative bg-card rounded-lg overflow-hidden cursor-pointer transition-all hover:scale-105 border-2',
        isAlert ? 'border-destructive animate-pulse-alert' : 'border-border'
      )}
    >
      {/* Video Feed */}
      <div className="aspect-video bg-secondary relative flex items-center justify-center">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
        </video>
        
        {!camera.online && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <span className="text-destructive font-semibold">OFFLINE</span>
          </div>
        )}

        {/* Detection Overlay */}
        {detection && camera.online && (
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
        )}
      </div>

      {/* Info Bar */}
      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-mono font-bold text-sm">{camera.name}</span>
          <span className="text-xs text-muted-foreground">{camera.zone}</span>
        </div>

        {detection && camera.online && (
          <>
            <div className="flex items-center justify-between">
              <span className={cn(
                'text-xs font-semibold px-2 py-1 rounded',
                isAlert ? 'bg-destructive text-destructive-foreground' : 'bg-secondary text-foreground'
              )}>
                {detection.object}
              </span>
              <div className="flex items-center gap-1">
                {isAlert && <AlertTriangle className="w-3 h-3 text-destructive animate-pulse" />}
                <span className={cn(
                  'text-mono font-bold text-sm',
                  isAlert ? 'text-destructive' : 'text-primary'
                )}>
                  {confidence}%
                </span>
              </div>
            </div>

            {/* Confidence Bar */}
            <div className="w-full h-1 bg-secondary rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full transition-all duration-500',
                  isAlert ? 'bg-destructive' : 'bg-primary'
                )}
                style={{ width: `${confidence}%` }}
              />
            </div>
          </>
        )}

        {!detection && camera.online && (
          <div className="text-xs text-muted-foreground text-center py-2">
            No Detection
          </div>
        )}
      </div>
    </div>
  );
};
