
import { Camera, Monitor, Video, ShieldAlert } from "lucide-react";
import { StatusCard } from "./StatusCard";

const statusData = [
  {
    title: "Active Cameras",
    value: "12/15",
    status: "warning" as const,
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
    value: "27",
    status: "critical" as const,
    icon: <ShieldAlert className="h-5 w-5 text-security-red" />,
  },
  {
    title: "System Uptime",
    value: "99.8%",
    status: "normal" as const,
    icon: <Monitor className="h-5 w-5 text-green-500" />,
  },
];

export const SystemStatus = () => {
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
