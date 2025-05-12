
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useState } from "react";

const data = [
  { time: "9 AM", motionAlerts: 3, unauthorizedAccess: 0, suspiciousActivity: 1 },
  { time: "10 AM", motionAlerts: 5, unauthorizedAccess: 1, suspiciousActivity: 2 },
  { time: "11 AM", motionAlerts: 7, unauthorizedAccess: 0, suspiciousActivity: 3 },
  { time: "12 PM", motionAlerts: 8, unauthorizedAccess: 2, suspiciousActivity: 1 },
  { time: "1 PM", motionAlerts: 12, unauthorizedAccess: 1, suspiciousActivity: 4 },
  { time: "2 PM", motionAlerts: 14, unauthorizedAccess: 3, suspiciousActivity: 2 },
  { time: "3 PM", motionAlerts: 9, unauthorizedAccess: 2, suspiciousActivity: 5 },
  { time: "4 PM", motionAlerts: 11, unauthorizedAccess: 0, suspiciousActivity: 3 },
];

const weeklyData = [
  { day: "Mon", motionAlerts: 42, unauthorizedAccess: 5, suspiciousActivity: 12 },
  { day: "Tue", motionAlerts: 38, unauthorizedAccess: 3, suspiciousActivity: 8 },
  { day: "Wed", motionAlerts: 45, unauthorizedAccess: 7, suspiciousActivity: 10 },
  { day: "Thu", motionAlerts: 39, unauthorizedAccess: 2, suspiciousActivity: 15 },
  { day: "Fri", motionAlerts: 53, unauthorizedAccess: 9, suspiciousActivity: 18 },
  { day: "Sat", motionAlerts: 25, unauthorizedAccess: 1, suspiciousActivity: 5 },
  { day: "Sun", motionAlerts: 18, unauthorizedAccess: 0, suspiciousActivity: 2 },
];

export const AnalyticsChart = () => {
  const [chartType, setChartType] = useState<"line" | "area" | "bar">("area");
  const [timeRange, setTimeRange] = useState<"today" | "week">("today");
  
  const displayData = timeRange === "today" ? data : weeklyData;
  const xAxisKey = timeRange === "today" ? "time" : "day";

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-lg">Alert Activity Analytics</CardTitle>
        <div className="flex space-x-2">
          <Tabs defaultValue="area" value={chartType} onValueChange={(v) => setChartType(v as "line" | "area" | "bar")}>
            <TabsList className="h-8">
              <TabsTrigger value="line" className="text-xs">Line</TabsTrigger>
              <TabsTrigger value="area" className="text-xs">Area</TabsTrigger>
              <TabsTrigger value="bar" className="text-xs">Bar</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Tabs defaultValue="today" value={timeRange} onValueChange={(v) => setTimeRange(v as "today" | "week")}>
            <TabsList className="h-8">
              <TabsTrigger value="today" className="text-xs">Today</TabsTrigger>
              <TabsTrigger value="week" className="text-xs">This Week</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <ResponsiveContainer width="100%" height={350}>
          {chartType === "line" ? (
            <LineChart
              data={displayData}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey={xAxisKey} stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "0.25rem",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="motionAlerts"
                stroke="#1EAEDB"
                strokeWidth={2}
                activeDot={{ r: 8 }}
                name="Motion Alerts"
              />
              <Line 
                type="monotone" 
                dataKey="unauthorizedAccess" 
                stroke="#EA384C" 
                strokeWidth={2}
                name="Unauthorized Access"
              />
              <Line 
                type="monotone" 
                dataKey="suspiciousActivity" 
                stroke="#8B5CF6" 
                strokeWidth={2}
                name="Suspicious Activity"
              />
            </LineChart>
          ) : chartType === "area" ? (
            <AreaChart
              data={displayData}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey={xAxisKey} stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "0.25rem",
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="motionAlerts"
                stackId="1"
                stroke="#1EAEDB"
                fill="#1EAEDB50"
                name="Motion Alerts"
              />
              <Area 
                type="monotone" 
                dataKey="unauthorizedAccess" 
                stackId="1"
                stroke="#EA384C" 
                fill="#EA384C50"
                name="Unauthorized Access"
              />
              <Area 
                type="monotone" 
                dataKey="suspiciousActivity" 
                stackId="1"
                stroke="#8B5CF6" 
                fill="#8B5CF650"
                name="Suspicious Activity"
              />
            </AreaChart>
          ) : (
            <BarChart
              data={displayData}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey={xAxisKey} stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "0.25rem",
                }}
              />
              <Legend />
              <Bar dataKey="motionAlerts" fill="#1EAEDB" name="Motion Alerts" />
              <Bar dataKey="unauthorizedAccess" fill="#EA384C" name="Unauthorized Access" />
              <Bar dataKey="suspiciousActivity" fill="#8B5CF6" name="Suspicious Activity" />
            </BarChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
