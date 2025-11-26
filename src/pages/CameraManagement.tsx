import { useState } from 'react';
import { Camera, Zone } from '@/lib/dummyData';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';

interface CameraManagementProps {
  cameras: Camera[];
  onUpdateCamera: (camera: Camera) => void;
  onDeleteCamera: (id: string) => void;
  onAddCamera: (camera: Omit<Camera, 'id' | 'online' | 'accuracy'>) => void;
}

const zones: Zone[] = ['Gate', 'Warehouse', 'Office', 'Yard', 'Parking', 'Entrance'];

export default function CameraManagement({ cameras, onUpdateCamera, onDeleteCamera, onAddCamera }: CameraManagementProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingCamera, setEditingCamera] = useState<Camera | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    zone: 'Gate' as Zone,
    alertThreshold: 80,
  });

  const handleSubmit = () => {
    if (!formData.name) {
      toast.error('Camera name is required');
      return;
    }

    if (editingCamera) {
      onUpdateCamera({
        ...editingCamera,
        ...formData,
      });
      toast.success('Camera updated successfully');
      setEditingCamera(null);
    } else {
      onAddCamera({
        name: formData.name,
        zone: formData.zone,
        alertThreshold: formData.alertThreshold,
        maskedZones: [],
      });
      toast.success('Camera added successfully');
      setIsAddOpen(false);
    }

    setFormData({ name: '', zone: 'Gate', alertThreshold: 80 });
  };

  const handleEdit = (camera: Camera) => {
    setEditingCamera(camera);
    setFormData({
      name: camera.name,
      zone: camera.zone,
      alertThreshold: camera.alertThreshold,
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Camera Management</h1>
          <p className="text-muted-foreground">Configure and manage camera settings</p>
        </div>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Camera
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Camera</DialogTitle>
            </DialogHeader>
            <CameraForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cameras.map(camera => (
          <Card key={camera.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-lg text-mono">{camera.name}</h3>
                <p className="text-sm text-muted-foreground">{camera.zone}</p>
              </div>
              <div className={`w-3 h-3 rounded-full ${camera.online ? 'bg-success' : 'bg-destructive'}`} />
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Alert Threshold</p>
                <p className="text-lg font-bold text-primary text-mono">{camera.alertThreshold}%</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Accuracy Score</p>
                <p className="text-lg font-bold text-mono">{camera.accuracy.toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Masked Zones</p>
                <p className="text-sm">{camera.maskedZones.length > 0 ? camera.maskedZones.join(', ') : 'None'}</p>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => handleEdit(camera)}
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  onDeleteCamera(camera.id);
                  toast.success('Camera removed');
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingCamera} onOpenChange={(open) => !open && setEditingCamera(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Camera - {editingCamera?.name}</DialogTitle>
          </DialogHeader>
          <CameraForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CameraForm({ formData, setFormData, onSubmit }: any) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Camera Name</Label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="CAM-01"
          className="text-mono"
        />
      </div>

      <div className="space-y-2">
        <Label>Zone</Label>
        <Select value={formData.zone} onValueChange={(val) => setFormData({ ...formData, zone: val })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {zones.map(zone => (
              <SelectItem key={zone} value={zone}>{zone}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Alert Threshold (%)</Label>
        <Input
          type="number"
          min="0"
          max="100"
          value={formData.alertThreshold}
          onChange={(e) => setFormData({ ...formData, alertThreshold: parseInt(e.target.value) })}
        />
      </div>

      <Button onClick={onSubmit} className="w-full">
        Save Camera
      </Button>
    </div>
  );
}
