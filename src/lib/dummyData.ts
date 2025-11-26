export type DetectionObject = 'Person' | 'Vehicle' | 'Leaf' | 'Shadow' | 'Insect' | 'Light' | 'None';
export type Zone = 'Gate' | 'Warehouse' | 'Office' | 'Yard' | 'Parking' | 'Entrance';
export type AlertAction = 'Real' | 'False' | 'Pending';

export interface Camera {
  id: string;
  name: string;
  zone: Zone;
  alertThreshold: number;
  online: boolean;
  accuracy: number;
  maskedZones: string[];
}

export interface Detection {
  id: string;
  timestamp: Date;
  cameraId: string;
  camera: string;
  object: DetectionObject;
  confidence: number;
  zone: Zone;
  isAlert: boolean;
  action: AlertAction;
  comment?: string;
  snapshot: string;
  duration: number;
  zoneMasked: boolean;
}

const zones: Zone[] = ['Gate', 'Warehouse', 'Office', 'Yard', 'Parking', 'Entrance'];
const objects: DetectionObject[] = ['Person', 'Vehicle', 'Leaf', 'Shadow', 'Insect', 'Light', 'None'];

export const generateCameras = (): Camera[] => {
  return Array.from({ length: 12 }, (_, i) => {
    const id = `CAM-${String(i + 1).padStart(2, '0')}`;
    return {
      id,
      name: id,
      zone: zones[i % zones.length],
      alertThreshold: 80,
      online: Math.random() > 0.05,
      accuracy: Math.random() * 40 + 60, // 60-100%
      maskedZones: Math.random() > 0.7 ? ['tree', 'sky'] : [],
    };
  });
};

export const generateDetection = (cameras: Camera[]): Detection => {
  const camera = cameras[Math.floor(Math.random() * cameras.length)];
  const object = objects[Math.floor(Math.random() * objects.length)];
  const confidence = Math.random() * 100;
  const duration = Math.random() * 5;
  const zoneMasked = camera.maskedZones.length > 0 && Math.random() > 0.6;
  
  // Alert logic
  const shouldAlert = 
    (object === 'Person' || object === 'Vehicle') &&
    confidence >= camera.alertThreshold &&
    duration >= 1 &&
    !zoneMasked;

  return {
    id: Math.random().toString(36).substr(2, 9),
    timestamp: new Date(),
    cameraId: camera.id,
    camera: camera.name,
    object,
    confidence: Math.round(confidence),
    zone: camera.zone,
    isAlert: shouldAlert,
    action: 'Pending',
    snapshot: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}?w=400&h=300&fit=crop`,
    duration,
    zoneMasked,
  };
};

export const shouldIgnore = (detection: Detection): boolean => {
  return (
    ['Leaf', 'Insect', 'Light', 'Shadow'].includes(detection.object) ||
    detection.confidence < 30 ||
    detection.duration < 1 ||
    detection.zoneMasked
  );
};
