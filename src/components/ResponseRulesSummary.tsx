
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ShieldCheck, AlertTriangle, Clock } from "lucide-react";
import { Badge } from "./ui/badge";
import { responseRules } from "@/data/mockData";
import { Button } from "./ui/button";

export const ResponseRulesSummary = () => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2 border-b">
        <CardTitle className="text-lg flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-security-blue" />
          Active Response Rules
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <div className="space-y-3 overflow-y-auto max-h-[calc(100%-60px)] pr-1">
          {responseRules.map((rule) => (
            <div 
              key={rule.id}
              className="bg-slate-800/50 border border-border/50 p-3 rounded-md flex flex-col gap-2 hover:bg-slate-800/80 transition-all"
            >
              <div className="flex justify-between items-start">
                <h4 className="text-sm font-medium flex items-center gap-1.5">
                  {rule.status === "Active" ? (
                    <span className="h-1.5 w-1.5 bg-green-500 rounded-full"></span>
                  ) : (
                    <span className="h-1.5 w-1.5 bg-gray-500 rounded-full"></span>
                  )}
                  {rule.name}
                </h4>
                <Badge variant="outline" className="bg-security-blue/10 text-security-blue">
                  {rule.triggerCount} Triggers
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{rule.description.length > 50 ? rule.description.substring(0, 50) + '...' : rule.description}</p>
              <div className="flex justify-between items-center mt-1">
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  Last triggered 24m ago
                </div>
                <Button variant="ghost" size="sm" className="h-7 text-xs">
                  Configure
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
