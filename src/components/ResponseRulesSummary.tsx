
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ShieldCheck } from "lucide-react";
import { Badge } from "./ui/badge";
import { responseRules } from "@/data/mockData";

export const ResponseRulesSummary = () => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-security-blue" />
          Active Response Rules
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 overflow-y-auto max-h-[calc(100%-60px)]">
          {responseRules.map((rule) => (
            <div 
              key={rule.id}
              className="bg-card/70 p-2 rounded-md flex justify-between items-center"
            >
              <div>
                <h4 className="text-sm font-medium">{rule.name}</h4>
                <p className="text-xs text-muted-foreground">{rule.description.length > 50 ? rule.description.substring(0, 50) + '...' : rule.description}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Badge variant="outline" className="bg-security-blue/10 text-security-blue">
                  {rule.triggerCount} Triggers
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {rule.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
