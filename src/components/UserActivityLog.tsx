
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Clock, User, Filter } from "lucide-react";
import { userActivities } from "@/data/mockData";
import { Button } from "./ui/button";

export const UserActivityLog = () => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2 border-b flex-row flex items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <User className="h-5 w-5 text-security-blue" />
          User Activity
        </CardTitle>
        <Button variant="ghost" size="sm" className="h-7">
          <Filter className="h-3.5 w-3.5" />
        </Button>
      </CardHeader>
      <CardContent className="p-3">
        <div className="space-y-2 overflow-y-auto max-h-[calc(100%-60px)] pr-1">
          {userActivities.map((activity) => (
            <div 
              key={activity.id}
              className="bg-slate-800/50 border border-border/50 p-2 rounded-md hover:bg-slate-800/80 transition-all"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-security-blue/20 flex items-center justify-center text-security-blue text-xs">
                    {activity.user.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span className="font-medium text-xs">{activity.user}</span>
                    <p className="text-xs text-muted-foreground">{activity.action}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{activity.timestamp.split(' ')[1]}</span>
                </div>
              </div>
              {activity.alertId && (
                <div className="mt-1 text-xs text-security-blue ml-9">
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
