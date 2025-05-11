
import { CheckCircle, AlertCircle, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusCardProps {
  title: string;
  value: string | number;
  status: "normal" | "warning" | "critical";
  icon?: React.ReactNode;
}

export const StatusCard = ({ title, value, status, icon }: StatusCardProps) => {
  const statusStyles = {
    normal: "text-green-500",
    warning: "text-yellow-500",
    critical: "text-security-red",
  };

  const StatusIcon = () => {
    if (icon) return icon;
    
    switch (status) {
      case "normal":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case "critical":
        return <ShieldAlert className="h-5 w-5 text-security-red" />;
    }
  };

  return (
    <div className="security-glass rounded-lg p-4 h-full">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">{title}</p>
        <StatusIcon />
      </div>
      <h3 className={cn("text-2xl font-bold mt-2", statusStyles[status])}>{value}</h3>
    </div>
  );
};
