
import { Header } from "@/components/Header";
import { AlertsSummary } from "@/components/AlertsSummary";
import { VideoFeed } from "@/components/VideoFeed";
import { SystemStatus } from "@/components/SystemStatus";
import { EventFeed } from "@/components/EventFeed";
import { AlertDetails } from "@/components/AlertDetails";
import { ResponseRulesSummary } from "@/components/ResponseRulesSummary";
import { UserActivityLog } from "@/components/UserActivityLog";
import { useState } from "react";
import { AlertItemProps } from "@/components/AlertItem";

const Index = () => {
  const [selectedAlert, setSelectedAlert] = useState<AlertItemProps | null>(null);

  const handleAlertSelect = (alert: AlertItemProps) => {
    setSelectedAlert(alert);
  };

  return (
    <div className="flex flex-col h-full">
      <Header />
      <main className="p-4 flex-1 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Dashboard Overview</h2>
            <p className="text-muted-foreground">Security status and recent events</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Column 1 (Left - Status and Summary) */}
          <div className="lg:col-span-3 space-y-4">
            <AlertsSummary />
            <SystemStatus />
          </div>
          
          {/* Column 2 (Center - Video and Events) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="h-[300px] security-glass rounded-lg overflow-hidden">
              <VideoFeed selectedCameraId={selectedAlert?.camera || "Main Entrance Camera"} />
            </div>
            <div className="h-[calc(100vh-500px)] min-h-[400px]">
              <EventFeed onAlertSelect={handleAlertSelect} selectedAlertId={selectedAlert?.id} />
            </div>
          </div>
          
          {/* Column 3 (Right - Details and Activity) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="h-[400px]">
              <AlertDetails selectedAlert={selectedAlert} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
              <div className="h-[200px]">
                <ResponseRulesSummary />
              </div>
              <div className="h-[200px]">
                <UserActivityLog />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
