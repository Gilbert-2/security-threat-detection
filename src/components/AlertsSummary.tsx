
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { AlertCircle, Package, ShieldAlert, UserX } from "lucide-react";
import { Badge } from "./ui/badge";
import { alertSummary, responseStats } from "@/data/mockData";

export const AlertsSummary = () => {
  const alertTypes = [
    {
      name: "Unauthorized Access",
      count: alertSummary.byType["Unauthorized Access"],
      icon: <UserX className="h-4 w-4 text-security-red" />,
    },
    {
      name: "Suspicious Object",
      count: alertSummary.byType["Suspicious Object"],
      icon: <Package className="h-4 w-4 text-alert-medium" />,
    },
    {
      name: "Intrusion Attempt",
      count: alertSummary.byType["Intrusion Attempt"],
      icon: <ShieldAlert className="h-4 w-4 text-alert-high" />,
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          Alert Summary
          <Badge variant="destructive" className="ml-2">
            {alertSummary.total} Total
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between">
            <div className="text-center px-2 py-1 bg-alert-critical/10 rounded-md w-1/4">
              <div className="text-xs text-muted-foreground">Critical</div>
              <div className="text-xl font-bold text-alert-critical">{alertSummary.critical}</div>
            </div>
            <div className="text-center px-2 py-1 bg-alert-high/10 rounded-md w-1/4">
              <div className="text-xs text-muted-foreground">High</div>
              <div className="text-xl font-bold text-alert-high">{alertSummary.high}</div>
            </div>
            <div className="text-center px-2 py-1 bg-alert-medium/10 rounded-md w-1/4">
              <div className="text-xs text-muted-foreground">Medium</div>
              <div className="text-xl font-bold text-alert-medium">{alertSummary.medium}</div>
            </div>
            <div className="text-center px-2 py-1 bg-alert-low/10 rounded-md w-1/4">
              <div className="text-xs text-muted-foreground">Low</div>
              <div className="text-xl font-bold text-alert-low">{alertSummary.low}</div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Top Alert Types</h3>
            <ul className="space-y-2">
              {alertTypes.map((type) => (
                <li 
                  key={type.name}
                  className="flex items-center justify-between bg-card/70 p-2 rounded-md"
                >
                  <div className="flex items-center gap-2">
                    {type.icon}
                    <span className="text-xs">{type.name}</span>
                  </div>
                  <Badge variant="outline">{type.count}</Badge>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Response Actions</h3>
            <div className="text-center p-2 bg-security-blue/10 rounded-md">
              <div className="text-xs text-muted-foreground">Total Triggered</div>
              <div className="text-xl font-bold text-security-blue">{responseStats.totalTriggered}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
