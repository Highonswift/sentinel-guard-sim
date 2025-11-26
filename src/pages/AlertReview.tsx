import { useState } from 'react';
import { Detection } from '@/lib/dummyData';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface AlertReviewProps {
  detections: Detection[];
  onMarkAction: (id: string, action: 'Real' | 'False', comment?: string) => void;
}

export default function AlertReview({ detections, onMarkAction }: AlertReviewProps) {
  const [comments, setComments] = useState<Record<string, string>>({});

  const pendingAlerts = detections.filter(d => d.isAlert && d.action === 'Pending');

  const handleAction = (detection: Detection, action: 'Real' | 'False') => {
    onMarkAction(detection.id, action, comments[detection.id]);
    setComments(prev => {
      const newComments = { ...prev };
      delete newComments[detection.id];
      return newComments;
    });
    toast.success(`Alert marked as ${action}`);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Alert Review Center</h1>
        <p className="text-muted-foreground">Review and classify pending security alerts</p>
      </div>

      {pendingAlerts.length === 0 ? (
        <Card className="p-12 text-center">
          <CheckCircle className="w-16 h-16 mx-auto mb-4 text-success" />
          <h2 className="text-2xl font-bold mb-2">All Clear!</h2>
          <p className="text-muted-foreground">No pending alerts to review</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {pendingAlerts.map(detection => (
            <Card key={detection.id} className="p-6">
              {/* Snapshot */}
              <div className="aspect-video bg-secondary rounded-lg mb-4 overflow-hidden">
                <img
                  src={detection.snapshot}
                  alt="Detection snapshot"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Alert Info */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-destructive animate-pulse" />
                    <span className="font-bold text-mono">{detection.camera}</span>
                  </div>
                  <Badge variant="destructive" className="animate-pulse-alert">
                    ALERT
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Object</p>
                    <p className="font-semibold">{detection.object}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Confidence</p>
                    <p className="font-bold text-primary text-mono">{detection.confidence}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Zone</p>
                    <p className="font-semibold">{detection.zone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Time</p>
                    <p className="text-mono text-sm">{detection.timestamp.toLocaleTimeString()}</p>
                  </div>
                </div>
              </div>

              {/* Comment */}
              <div className="mb-4">
                <Textarea
                  placeholder="Add operator notes (optional)..."
                  value={comments[detection.id] || ''}
                  onChange={(e) => setComments(prev => ({
                    ...prev,
                    [detection.id]: e.target.value
                  }))}
                  className="resize-none"
                  rows={2}
                />
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => handleAction(detection, 'Real')}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Real Threat
                </Button>
                <Button
                  onClick={() => handleAction(detection, 'False')}
                  variant="outline"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  False Alert
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
