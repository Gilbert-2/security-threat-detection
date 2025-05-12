
import { Header } from "@/components/Header";
import { VideoFeed as VideoComponent } from "@/components/VideoFeed"; 
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, RefreshCw } from "lucide-react";

const cameras = [
  { id: "cam-1", name: "Main Entrance Camera" },
  { id: "cam-2", name: "Lobby Camera 2" },
  { id: "cam-3", name: "Emergency Exit B" },
  { id: "cam-4", name: "Hallway Camera 4" },
  { id: "cam-5", name: "Parking Level 2 Camera" },
  { id: "cam-6", name: "Office Area Camera 3" },
];

const VideoFeed = () => {
  const [selectedCamera, setSelectedCamera] = useState("Main Entrance Camera");
  
  return (
    <div className="flex flex-col h-full">
      <Header />
      <div className="p-4 flex-1 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Live Video Surveillance</h2>
            <p className="text-muted-foreground">Monitoring all facility cameras</p>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh Feeds
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <Card className="h-[500px]">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Primary Monitor</CardTitle>
                <CardDescription>
                  {selectedCamera}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 h-[calc(100%-76px)]">
                <VideoComponent selectedCameraId={selectedCamera} />
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Camera Selection</CardTitle>
                <CardDescription>Choose a camera to view</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {cameras.map((camera) => (
                  <Button 
                    key={camera.id} 
                    variant={selectedCamera === camera.name ? "secondary" : "outline"}
                    className="w-full justify-start mb-1 gap-2"
                    onClick={() => setSelectedCamera(camera.name)}
                  >
                    <Camera className="h-4 w-4" />
                    {camera.name}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoFeed;
