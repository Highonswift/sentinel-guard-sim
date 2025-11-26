import { Detection } from '@/lib/dummyData';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

interface SnapshotModalProps {
  detection: Detection | null;
  open: boolean;
  onClose: () => void;
  onMarkAction: (id: string, action: 'Real' | 'False', comment?: string) => void;
}

export const SnapshotModal = ({ detection, open, onClose, onMarkAction }: SnapshotModalProps) => {
  const [comment, setComment] = useState('');

  if (!detection) return null;

  const handleAction = (action: 'Real' | 'False') => {
    onMarkAction(detection.id, action, comment);
    setComment('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-mono">
            <AlertTriangle className="w-5 h-5 text-primary" />
            Detection Evidence - {detection.camera}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Snapshot */}
          <div className="aspect-video bg-secondary rounded-lg overflow-hidden">
            <img
              src={detection.snapshot}
              alt="Detection snapshot"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Detection Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Object</p>
              <Badge variant={detection.isAlert ? 'destructive' : 'secondary'}>
                {detection.object}
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Confidence</p>
              <p className="text-mono font-bold text-lg text-primary">{detection.confidence}%</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Zone</p>
              <p className="font-semibold">{detection.zone}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Time</p>
              <p className="text-mono text-sm">{detection.timestamp.toLocaleTimeString()}</p>
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Operator Comment (Optional)</label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add notes about this detection..."
              className="resize-none"
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={() => handleAction('Real')}
              className="flex-1 bg-destructive hover:bg-destructive/90"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark as Real Alert
            </Button>
            <Button
              onClick={() => handleAction('False')}
              variant="outline"
              className="flex-1"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Mark as False Alert
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
