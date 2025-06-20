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
import { useState, useEffect } from "react";
import { analyticsService, AnalyticsData } from "@/services/analyticsService";

export const AnalyticsChart = () => {
  const [chartType, setChartType] = useState<"line" | "area" | "bar">("area");
  const [timeRange, setTimeRange] = useState<"today" | "week">("today");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [todayData, setTodayData] = useState<AnalyticsData[]>([]);
  const [weekData, setWeekData] = useState<AnalyticsData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch today's data (assume today is a single day range)
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        const todayResult = await analyticsService.getAnalytics(todayStr, todayStr);
        setTodayData(todayResult);
        // Fetch week data (last 7 days)
        const weekAgo = new Date();
        weekAgo.setDate(today.getDate() - 6);
        const weekAgoStr = weekAgo.toISOString().split('T')[0];
        const weekResult = await analyticsService.getAnalytics(weekAgoStr, todayStr);
        setWeekData(weekResult);
      } catch (err: any) {
        setError(err.message || 'Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const displayData = Array.isArray(timeRange === "today" ? todayData : weekData) ? (timeRange === "today" ? todayData : weekData) : [];
  const xAxisKey = "date";

  const isDataEmpty = !displayData || displayData.length === 0;

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
        {loading ? (
          <div className="text-center py-10">Loading analytics...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-10">{error}</div>
        ) : isDataEmpty ? (
          <div className="text-center py-10 text-muted-foreground">No analytics data available for this period.</div>
        ) : (
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
                  dataKey="alertsCount"
                  stroke="#1EAEDB"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                  name="Alerts"
                />
                <Line 
                  type="monotone" 
                  dataKey="responsesTriggered" 
                  stroke="#EA384C" 
                  strokeWidth={2}
                  name="Responses"
                />
                <Line 
                  type="monotone" 
                  dataKey="averageResponseTime" 
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                  name="Avg Response Time"
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
                  dataKey="alertsCount"
                  stackId="1"
                  stroke="#1EAEDB"
                  fill="#1EAEDB50"
                  name="Alerts"
                />
                <Area 
                  type="monotone" 
                  dataKey="responsesTriggered" 
                  stackId="1"
                  stroke="#EA384C" 
                  fill="#EA384C50"
                  name="Responses"
                />
                <Area 
                  type="monotone" 
                  dataKey="averageResponseTime" 
                  stackId="1"
                  stroke="#8B5CF6" 
                  fill="#8B5CF650"
                  name="Avg Response Time"
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
                <Bar dataKey="alertsCount" fill="#1EAEDB" name="Alerts" />
                <Bar dataKey="responsesTriggered" fill="#EA384C" name="Responses" />
                <Bar dataKey="averageResponseTime" fill="#8B5CF6" name="Avg Response Time" />
              </BarChart>
            )}
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};
