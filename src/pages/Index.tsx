
import { Header } from "@/components/Header";
import { AlertsSummary } from "@/components/AlertsSummary";
import { VideoFeed } from "@/components/VideoFeed";
import { SystemStatus } from "@/components/SystemStatus";
import { ResponseRulesSummary } from "@/components/ResponseRulesSummary";
import { UserActivityLog } from "@/components/UserActivityLog";
import { AnalyticsChart } from "@/components/AnalyticsChart";

const Index = () => {
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
          {/* Status Section - Top row */}
          <div className="lg:col-span-12">
            <SystemStatus />
          </div>
          
          {/* Video Feed and Alert Summary Section - equal height */}
          <div className="lg:col-span-6 flex flex-col h-[350px]">
            <VideoFeed selectedCameraId="Main Entrance Camera" />
          </div>
          
          <div className="lg:col-span-6 flex flex-col h-[350px]">
            <AlertsSummary />
          </div>
          
          {/* Rules and Activity Logs - Third row side by side */}
          <div className="lg:col-span-6">
            <ResponseRulesSummary />
          </div>
          <div className="lg:col-span-6">
            <UserActivityLog />
          </div>
          
          {/* Analytics Chart - Bottom row */}
          <div className="lg:col-span-12 mt-4">
            <AnalyticsChart />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
