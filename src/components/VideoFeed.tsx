
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Camera, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { cameraService } from "@/services";

interface VideoFeedProps {
  selectedCameraId?: string;
}

export const VideoFeed = ({ selectedCameraId }: VideoFeedProps) => {
  const [cameras, setCameras] = useState<{id: string, name: string}[]>([]);
  const [selectedCamera, setSelectedCamera] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch cameras from service
  useEffect(() => {
    const fetchCameras = async () => {
      try {
        setLoading(true);
        const cameraData = await cameraService.getCameras();
        setCameras(cameraData.map(cam => ({ id: cam.id, name: cam.name })));
        
        // Set default camera
        if (cameraData.length > 0 && !selectedCamera) {
          setSelectedCamera(cameraData[0].id);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cameras:", error);
        setLoading(false);
      }
    };

    fetchCameras();
  }, []);

  // Update selected camera if selectedCameraId prop changes
  useEffect(() => {
    const updateSelectedCamera = async () => {
      if (selectedCameraId && cameras.length > 0) {
        const camera = cameras.find(cam => cam.name === selectedCameraId);
        if (camera) {
          setSelectedCamera(camera.id);
        }
      }
    };

    updateSelectedCamera();
  }, [selectedCameraId, cameras]);

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Live Video Feed</CardTitle>
      </CardHeader>
      <CardContent className="p-3 flex flex-col flex-1">
        <div className="bg-slate-950 rounded-md relative flex-1 min-h-[250px]">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-muted-foreground text-sm">Loading video feeds...</span>
            </div>
          ) : (
            <>
              <div className="absolute top-0 left-0 bg-black/50 text-white px-2 py-1 text-xs flex items-center gap-1 rounded-br-md">
                <Video className="h-3 w-3" />
                <span>{cameras.find(cam => cam.id === selectedCamera)?.name}</span>
                <span className="ml-2 h-2 w-2 bg-green-500 rounded-full"></span>
              </div>
              <div className="absolute bottom-2 right-2 bg-security-red px-2 py-1 text-white text-xs font-bold rounded animate-alert-blink">
                ALERT AREA
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-muted-foreground text-sm">
                  Video feed streaming from {cameras.find(cam => cam.id === selectedCamera)?.name}...
                </span>
              </div>
              
              {/* Alert outline box - this would be drawn around detected threats */}
              <div className="absolute right-10 bottom-10 w-24 h-24 border-2 border-security-red rounded-md"></div>
            </>
          )}
        </div>
        <div className="grid grid-cols-3 gap-1 mt-2">
          {cameras.slice(0, 3).map((camera) => (
            <Button
              key={camera.id}
              size="sm"
              variant="outline"
              className={cn(
                "flex flex-col h-auto items-center justify-center gap-1 p-1",
                selectedCamera === camera.id && "border-security-blue bg-security-blue/10"
              )}
              onClick={() => setSelectedCamera(camera.id)}
            >
              <Camera className="h-3 w-3" />
              <span className="text-xs truncate w-full text-center">{camera.name.split(' ')[0]}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
