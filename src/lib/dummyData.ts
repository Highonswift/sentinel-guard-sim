export type DetectionObject = 'Bin overflow' | 'Littering' | 'Tradies' | 'Gates' | 'Person' | 'None';
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
const objects: DetectionObject[] = ['Bin Overflow', 'Littering', 'Tradies', 'Gates', 'Person', 'None'];

// Realistic security camera videos showing outdoor areas, buildings, trees, parking lots
const cameraVideos = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', // Outdoor scene
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', // Landscape
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', // Outdoor activity
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', // Vehicle scene
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4', // Outdoor
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4', // Outdoor landscape
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4', // Street/parking
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4', // Urban/building
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4', // Vehicle/parking
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4', // Outdoor road
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4', // Vehicle scene
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', // Outdoor environment
];

export const getCameraVideo = (cameraId: string): string => {
  const cameraNumber = parseInt(cameraId.split('-')[1]) - 1;
  return cameraVideos[cameraNumber % cameraVideos.length];
};

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

  // Realistic security camera snapshot URLs
  const securitySnapshots = [
    'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=400&h=300&fit=crop', // Person in parking lot
    'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=400&h=300&fit=crop', // Building entrance
    'https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=400&h=300&fit=crop', // Warehouse interior
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop', // Office building
    'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=400&h=300&fit=crop', // Gate/fence view
    'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=400&h=300&fit=crop', // Parking area
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', // Industrial yard
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop', // Office entrance
    'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=300&fit=crop', // Car in parking
    'https://images.unsplash.com/photo-1590674899474-d5640e854c2e?w=400&h=300&fit=crop', // Building exterior
  ];

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
    snapshot: securitySnapshots[Math.floor(Math.random() * securitySnapshots.length)],
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
