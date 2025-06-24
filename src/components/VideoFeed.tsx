import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Camera, Video, Trash2, UploadCloud, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { cameraService } from "@/services";
import { detectFight } from "../services/fightDetectionService";
import { useToast } from "./ui/use-toast";
import { Badge } from "./ui/badge";
import { ShieldAlert, CheckCircle } from "lucide-react";

interface VideoFeedProps {
  selectedCameraId?: string;
  fightResult: any;
  setFightResult: (result: any) => void;
}

const ACCEPTED_TYPES = ["video/mp4", "video/avi", "video/quicktime"];

export const VideoFeed = ({ selectedCameraId, fightResult, setFightResult }: VideoFeedProps) => {
  const [cameras, setCameras] = useState<{id: string, name: string}[]>([]);
  const [selectedCamera, setSelectedCamera] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploadedVideo, setUploadedVideo] = useState<string | null>(null);
  const [showLiveFeed, setShowLiveFeed] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  // Fetch cameras from service
  useEffect(() => {
    const fetchCameras = async () => {
      try {
        setLoading(true);
        const cameraData = await cameraService.getCameras();
        setCameras(cameraData.map(cam => ({ id: cam.id, name: cam.name })));
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

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast({
        title: 'Unsupported file type',
        description: `File ${file.name} is not a supported video format.`,
        variant: 'destructive',
      });
      return;
    }
    const videoURL = URL.createObjectURL(file);
    setUploadedVideo(videoURL);
    setShowLiveFeed(false);
    setFightResult(null);
    setSelectedFileName(file.name);
    setAnalyzing(true);
    // Call fight detection API
    const formData = new FormData();
    formData.append('file', file);
    try {
      const result = await detectFight(formData, 0.5);
      setFightResult(result);
      toast({
        title: result.prediction === 'fight' ? '⚠️ Fight Detected!' : '✅ No Fight Detected',
        description: `Confidence: ${result.confidence_score} (${result.confidence_level})`,
        variant: result.prediction === 'fight' ? 'destructive' : 'success',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to analyze the video.',
        variant: 'destructive',
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleShowLiveFeed = () => {
    setShowLiveFeed(true);
    setUploadedVideo(null);
    setFightResult(null);
    setSelectedFileName(null);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const handleDeleteUploadedVideo = () => {
    setUploadedVideo(null);
    setFightResult(null);
    setSelectedFileName(null);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Live Video Feed</CardTitle>
      </CardHeader>
      <CardContent className="p-3 flex flex-col flex-1">
        <div className="bg-slate-950 rounded-md relative flex-1 min-h-[250px]">
          {showLiveFeed ? (
            loading ? (
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
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-muted-foreground text-sm">
                    Video feed streaming from {cameras.find(cam => cam.id === selectedCamera)?.name}...
                  </span>
                </div>
              </>
            )
          ) : (
            <>
              <video
                ref={videoRef}
                src={uploadedVideo || undefined}
                controls
                autoPlay
                className="w-full h-full object-contain rounded-md"
                style={{ background: '#000', maxHeight: 350 }}
              />
              {analyzing && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-10 rounded-md">
                  <Loader2 className="h-10 w-10 text-security-blue animate-spin mb-2" />
                  <span className="text-security-blue font-medium">Analyzing video...</span>
                </div>
              )}
              <div className={`absolute bottom-2 right-2 px-2 py-1 text-xs font-bold rounded ${fightResult ? (fightResult.prediction === 'fight' ? 'bg-red-600 text-white animate-alert-blink' : 'bg-green-600 text-white') : 'bg-gray-400 text-white'}`}>
                {fightResult
                  ? (fightResult.prediction === 'fight' ? '⚠️ Fight Detected!' : '✅ No Fight Detected')
                  : analyzing ? '' : 'Analyzing...'}
              </div>
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
              disabled={!showLiveFeed}
            >
              <Camera className="h-3 w-3" />
              <span className="text-xs truncate w-full text-center">{camera.name.split(' ')[0]}</span>
            </Button>
          ))}
        </div>
        <div className="flex gap-2 mt-2 items-center">
          <label htmlFor="video-upload" className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-security-blue/10 text-security-blue font-medium cursor-pointer hover:bg-security-blue/20 transition border border-security-blue/30">
            <UploadCloud className="h-4 w-4" />
            {uploadedVideo ? 'Choose Another Video' : 'Choose Video'}
            <input
              id="video-upload"
              type="file"
              accept=".mp4,.avi,.mov"
              onChange={handleVideoUpload}
              disabled={!showLiveFeed && !!uploadedVideo}
              className="hidden"
            />
          </label>
          {selectedFileName && (
            <span className="text-xs text-muted-foreground truncate max-w-[120px]">{selectedFileName}</span>
          )}
          {!showLiveFeed && uploadedVideo && (
            <>
              <Button size="sm" variant="secondary" onClick={handleShowLiveFeed}>
                Back to Live Feed
              </Button>
              <Button size="icon" variant="ghost" onClick={handleDeleteUploadedVideo} className="text-red-500 hover:bg-red-500/10 ml-1" aria-label="Delete Video">
                <Trash2 className="h-5 w-5" />
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
