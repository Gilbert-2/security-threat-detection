
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
import { recentAlerts } from "@/data/mockData";

const Index = () => {
  const [selectedAlert, setSelectedAlert] = useState<AlertItemProps | null>(null);

  const handleAlertSelect = (alert: AlertItemProps) => {
    setSelectedAlert(alert);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-security-navy/30">
      <Header />
      <main className="flex-grow dashboard-grid">
        {/* Column 1 (Left - Narrower) */}
        <div className="lg:col-span-3 space-y-4">
          <AlertsSummary />
          <SystemStatus />
        </div>
        
        {/* Column 2 (Center - Widest) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="h-[300px] security-glass rounded-lg overflow-hidden">
            <VideoFeed selectedCameraId={selectedAlert?.camera || "Main Entrance Camera"} />
          </div>
          <div className="h-[calc(100vh-500px)] min-h-[400px]">
            <EventFeed onAlertSelect={handleAlertSelect} selectedAlertId={selectedAlert?.id} />
          </div>
        </div>
        
        {/* Column 3 (Right - Medium) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="h-[400px]">
            <AlertDetails selectedAlert={selectedAlert} />
          </div>
          <div className="h-[200px]">
            <ResponseRulesSummary />
          </div>
          <div className="h-[200px]">
            <UserActivityLog />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
