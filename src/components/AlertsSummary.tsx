import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { AlertCircle, Package, ShieldAlert, UserX, CheckCircle } from "lucide-react";
import { Badge } from "./ui/badge";
import { alertSummary, responseStats } from "@/data/mockData";
import { useEffect, useRef } from "react";

export const AlertsSummary = ({ fightResult }: { fightResult?: any }) => {
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

  // --- AUDIO ALERT LOGIC ---
  // Place a short alert sound (e.g., alert.mp3) in your public/ folder for this to work.
  const prevPrediction = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (
      fightResult &&
      fightResult.prediction === 'fight' &&
      prevPrediction.current !== 'fight'
    ) {
      const audio = new Audio('/alert.mp3');
      audio.play();
    }
    prevPrediction.current = fightResult?.prediction;
  }, [fightResult?.prediction]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          Alert Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        {fightResult ? (
          <div className="mb-4">
            <Card className="shadow-none border border-alert-high/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  Fight Detection Result
                  <Badge variant={fightResult.prediction === 'fight' ? 'destructive' : 'outline'}>
                    {fightResult.prediction === 'fight' ? 'Fight Detected' : 'No Fight'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-4">
                  {fightResult.prediction === 'fight' ? (
                    <ShieldAlert className="h-6 w-6 text-alert-critical" />
                  ) : (
                    <CheckCircle className="h-6 w-6 text-security-blue" />
                  )}
                  <span className="text-sm text-muted-foreground">
                    Confidence: <span className="font-bold">{(fightResult.confidence_score * 100).toFixed(1)}%</span>
                  </span>
                  <span className="ml-auto text-xs text-muted-foreground">Threshold: {fightResult.threshold_used}</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  <div className="text-center px-2 py-1 bg-alert-high/10 rounded-md w-28">
                    <div className="text-xs text-muted-foreground">Probability</div>
                    <div className="text-lg font-bold text-alert-high">{(fightResult.probability * 100).toFixed(1)}%</div>
                  </div>
                  <div className="text-center px-2 py-1 bg-alert-low/10 rounded-md w-28">
                    <div className="text-xs text-muted-foreground">Frames</div>
                    <div className="text-lg font-bold text-alert-low">{fightResult.frames_processed}</div>
                  </div>
                  <div className="text-center px-2 py-1 bg-security-blue/10 rounded-md w-32">
                    <div className="text-xs text-muted-foreground">Video Duration</div>
                    <div className="text-lg font-bold text-security-blue">{Number(fightResult.video_duration_estimate).toPrecision(4)} sec</div>
                  </div>
                  <div className="text-center px-2 py-1 bg-muted/50 rounded-md w-32">
                    <div className="text-xs text-muted-foreground">Model Status</div>
                    <div className="text-lg font-bold text-muted-foreground">{fightResult.model_status}</div>
                  </div>
                  <div className="text-center px-2 py-1 bg-muted/50 rounded-md w-32">
                    <div className="text-xs text-muted-foreground">Confidence Level</div>
                    <div className="text-lg font-bold text-muted-foreground">{fightResult.confidence_level}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-muted-foreground text-center py-8">No fight detection result yet.</div>
        )}
      </CardContent>
    </Card>
  );
};
