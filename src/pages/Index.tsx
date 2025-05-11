
import { Header } from "@/components/Header";
import { AlertsList } from "@/components/AlertsList";
import { VideoFeed } from "@/components/VideoFeed";
import { SystemStatus } from "@/components/SystemStatus";
import { AnalyticsChart } from "@/components/AnalyticsChart";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow p-4">
        <SystemStatus />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <div className="h-[400px]">
            <VideoFeed />
          </div>
          <div className="h-[400px]">
            <AlertsList />
          </div>
        </div>
        
        <div className="mt-4 h-[300px]">
          <AnalyticsChart />
        </div>
      </main>
    </div>
  );
};

export default Index;
