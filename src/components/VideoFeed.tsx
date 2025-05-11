
import { useState } from "react";
import { Button } from "./ui/button";
import { Camera, Video } from "lucide-react";
import { cn } from "@/lib/utils";

const cameras = [
  { id: "cam-1", name: "Main Entrance" },
  { id: "cam-2", name: "Lobby" },
  { id: "cam-3", name: "Emergency Exit B" },
  { id: "cam-4", name: "Hallway" },
  { id: "cam-5", name: "Parking Level 2" },
  { id: "cam-6", name: "Office Area" },
];

export const VideoFeed = () => {
  const [selectedCamera, setSelectedCamera] = useState(cameras[0].id);

  return (
    <div className="h-full flex flex-col security-glass rounded-lg p-4">
      <h2 className="text-lg font-medium mb-3">Live Video Feed</h2>
      <div className="flex-1 bg-slate-950 rounded-md relative mb-3">
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
      </div>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {cameras.map((camera) => (
          <Button
            key={camera.id}
            size="sm"
            variant="outline"
            className={cn(
              "flex flex-col h-auto items-center justify-center gap-1 p-2",
              selectedCamera === camera.id && "border-security-blue bg-security-blue/10"
            )}
            onClick={() => setSelectedCamera(camera.id)}
          >
            <Camera className="h-4 w-4" />
            <span className="text-xs">{camera.name}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};
