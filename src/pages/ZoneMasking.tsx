import { Camera } from '@/lib/dummyData';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Video } from 'lucide-react';
import { toast } from 'sonner';

interface ZoneMaskingProps {
  cameras: Camera[];
  onToggleMask: (cameraId: string, maskZones: string[]) => void;
}

const maskOptions = ['tree', 'sky', 'corner', 'entrance'];

export default function ZoneMasking({ cameras, onToggleMask }: ZoneMaskingProps) {
  const handleToggle = (camera: Camera, zone: string, enabled: boolean) => {
    const newMasks = enabled
      ? [...camera.maskedZones, zone]
      : camera.maskedZones.filter(z => z !== zone);
    
    onToggleMask(camera.id, newMasks);
    toast.success(`Zone mask ${enabled ? 'enabled' : 'disabled'}`);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Zone Masking</h1>
        <p className="text-muted-foreground">Configure detection-ignored areas for each camera</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cameras.map(camera => (
          <Card key={camera.id} className="p-6">
            {/* Camera Preview */}
            <div className="aspect-video bg-secondary rounded-lg mb-4 relative flex items-center justify-center">
              <Video className="w-12 h-12 text-muted-foreground opacity-50" />
              {camera.maskedZones.length > 0 && (
                <div className="absolute top-2 right-2">
                  <Badge variant="outline" className="bg-warning/20 text-warning border-warning">
                    {camera.maskedZones.length} Masked
                  </Badge>
                </div>
              )}
            </div>

            {/* Camera Info */}
            <div className="mb-4">
              <h3 className="font-bold text-lg text-mono">{camera.name}</h3>
              <p className="text-sm text-muted-foreground">{camera.zone}</p>
            </div>

            {/* Mask Options */}
            <div className="space-y-3">
              <p className="text-sm font-semibold">Mask Regions:</p>
              {maskOptions.map(zone => (
                <div key={zone} className="flex items-center justify-between p-2 bg-secondary rounded-lg">
                  <Label htmlFor={`${camera.id}-${zone}`} className="capitalize cursor-pointer">
                    {zone}
                  </Label>
                  <Switch
                    id={`${camera.id}-${zone}`}
                    checked={camera.maskedZones.includes(zone)}
                    onCheckedChange={(checked) => handleToggle(camera, zone, checked)}
                  />
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground">
                Objects detected in masked zones will be auto-ignored
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
