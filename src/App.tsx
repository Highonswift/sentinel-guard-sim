import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Navigation } from '@/components/Navigation';
import Dashboard from "./pages/Dashboard";
import LiveCameras from "./pages/LiveCameras";
import DetectionLogs from "./pages/DetectionLogs";
import Analytics from "./pages/Analytics";
import CameraManagement from "./pages/CameraManagement";
import ZoneMasking from "./pages/ZoneMasking";
import AlertReview from "./pages/AlertReview";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import { generateCameras, generateDetection, Camera, Detection } from '@/lib/dummyData';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('sentinel_auth') === 'true';
  });
  const [userRole, setUserRole] = useState<'admin' | 'operator'>(() => {
    return (localStorage.getItem('sentinel_role') as 'admin' | 'operator') || 'operator';
  });
  const [cameras, setCameras] = useState<Camera[]>(generateCameras());
  const [detections, setDetections] = useState<Detection[]>([]);

  // Simulate live detections
  useEffect(() => {
    const interval = setInterval(() => {
      const newDetection = generateDetection(cameras);
      setDetections(prev => [newDetection, ...prev].slice(0, 100)); // Keep last 100
    }, 3000); // New detection every 3 seconds

    return () => clearInterval(interval);
  }, [cameras]);

  const handleMarkAction = (id: string, action: 'Real' | 'False', comment?: string) => {
    setDetections(prev =>
      prev.map(d => d.id === id ? { ...d, action, comment } : d)
    );
  };

  const handleUpdateCamera = (camera: Camera) => {
    setCameras(prev => prev.map(c => c.id === camera.id ? camera : c));
  };

  const handleDeleteCamera = (id: string) => {
    setCameras(prev => prev.filter(c => c.id !== id));
  };

  const handleAddCamera = (cameraData: Omit<Camera, 'id' | 'online' | 'accuracy'>) => {
    const newId = `CAM-${String(cameras.length + 1).padStart(2, '0')}`;
    setCameras(prev => [...prev, {
      ...cameraData,
      id: newId,
      online: true,
      accuracy: Math.random() * 40 + 60,
    }]);
  };

  const handleToggleMask = (cameraId: string, maskZones: string[]) => {
    setCameras(prev =>
      prev.map(c => c.id === cameraId ? { ...c, maskedZones: maskZones } : c)
    );
  };

  const handleLogin = (role: 'admin' | 'operator') => {
    setIsAuthenticated(true);
    setUserRole(role);
    localStorage.setItem('sentinel_auth', 'true');
    localStorage.setItem('sentinel_role', role);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole('operator');
    localStorage.removeItem('sentinel_auth');
    localStorage.removeItem('sentinel_role');
  };

  // Protected Route wrapper
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
  };

  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          {isAuthenticated && <Navigation userRole={userRole} onLogout={handleLogout} />}
          <Routes>
            <Route path="/login" element={
              isAuthenticated ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />
            } />
            <Route path="/" element={
              <ProtectedRoute>
                <Dashboard cameras={cameras} detections={detections} />
              </ProtectedRoute>
            } />
            <Route path="/live" element={
              <ProtectedRoute>
                <LiveCameras cameras={cameras} detections={detections} onMarkAction={handleMarkAction} />
              </ProtectedRoute>
            } />
            <Route path="/logs" element={
              <ProtectedRoute>
                <DetectionLogs detections={detections} onMarkAction={handleMarkAction} />
              </ProtectedRoute>
            } />
            <Route path="/analytics" element={
              <ProtectedRoute>
                <Analytics cameras={cameras} detections={detections} />
              </ProtectedRoute>
            } />
            <Route path="/cameras" element={
              <ProtectedRoute>
                <CameraManagement cameras={cameras} onUpdateCamera={handleUpdateCamera} onDeleteCamera={handleDeleteCamera} onAddCamera={handleAddCamera} />
              </ProtectedRoute>
            } />
            <Route path="/zones" element={
              <ProtectedRoute>
                <ZoneMasking cameras={cameras} onToggleMask={handleToggleMask} />
              </ProtectedRoute>
            } />
            <Route path="/alerts" element={
              <ProtectedRoute>
                <AlertReview detections={detections} onMarkAction={handleMarkAction} />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  );
};

export default App;
