
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Clock, User } from "lucide-react";
import { userActivities } from "@/data/mockData";

export const UserActivityLog = () => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <User className="h-5 w-5 text-security-blue" />
          User Activity Log
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 overflow-y-auto max-h-[calc(100%-60px)]">
          {userActivities.map((activity) => (
            <div 
              key={activity.id}
              className="bg-card/70 p-2 rounded-md"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-xs">{activity.user}</span>
                  <span className="text-xs text-muted-foreground">{activity.action}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{activity.timestamp.split(' ')[1]}</span>
                </div>
              </div>
              {activity.alertId && (
                <div className="mt-1 text-xs text-security-blue">
                  Alert ID: {activity.alertId}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
