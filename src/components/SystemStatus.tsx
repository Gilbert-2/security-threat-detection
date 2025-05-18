
import { Camera, Monitor, Video, ShieldAlert } from "lucide-react";
import { StatusCard } from "./StatusCard";
import { useEffect, useState } from "react";
import { cameraService, alertService, responseRuleService } from "@/services";

export const SystemStatus = () => {
  const [statusData, setStatusData] = useState([
    {
      title: "Active Cameras",
      value: "Loading...",
      status: "normal" as const,
      icon: <Camera className="h-5 w-5 text-yellow-500" />,
    },
    {
      title: "Video Processing",
      value: "Loading...",
      status: "normal" as const,
      icon: <Video className="h-5 w-5 text-green-500" />,
    },
    {
      title: "Threats Detected Today",
      value: "Loading...",
      status: "normal" as const,
      icon: <ShieldAlert className="h-5 w-5 text-security-red" />,
    },
    {
      title: "System Uptime",
      value: "Loading...",
      status: "normal" as const,
      icon: <Monitor className="h-5 w-5 text-green-500" />,
    },
  ]);

  useEffect(() => {
    const fetchStatusData = async () => {
      try {
        // Get camera summary data
        const cameraSummary = await cameraService.getCameraSummary();
        const cameraStatus = cameraSummary.offline > 0 ? "warning" as const : "normal" as const;
        
        // Get alerts summary data
        const alertSummaryData = await alertService.getAlertSummary();
        const alertStatus = alertSummaryData.critical > 0 ? "critical" as const : 
                           alertSummaryData.high > 0 ? "warning" as const : "normal" as const;
        
        // Get response rules stats
        const responseStats = await responseRuleService.getResponseStats();
        
        setStatusData([
          {
            title: "Active Cameras",
            value: `${cameraSummary.online}/${cameraSummary.total}`,
            status: cameraStatus,
            icon: <Camera className="h-5 w-5 text-yellow-500" />,
          },
          {
            title: "Video Processing",
            value: "Normal",
            status: "normal" as const,
            icon: <Video className="h-5 w-5 text-green-500" />,
          },
          {
            title: "Threats Detected Today",
            value: `${alertSummaryData.total}`,
            status: alertStatus,
            icon: <ShieldAlert className="h-5 w-5 text-security-red" />,
          },
          {
            title: "System Uptime",
            value: "99.8%",
            status: "normal" as const,
            icon: <Monitor className="h-5 w-5 text-green-500" />,
          },
        ]);
      } catch (error) {
        console.error("Error fetching status data:", error);
      }
    };

    fetchStatusData();
  }, []);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statusData.map((item, index) => (
        <StatusCard
          key={index}
          title={item.title}
          value={item.value}
          status={item.status}
          icon={item.icon}
        />
      ))}
    </div>
  );
};
