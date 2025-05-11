
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const data = [
  { time: "9 AM", motionAlerts: 3, unauthorizedAccess: 0, suspiciousActivity: 1 },
  { time: "10 AM", motionAlerts: 5, unauthorizedAccess: 1, suspiciousActivity: 2 },
  { time: "11 AM", motionAlerts: 7, unauthorizedAccess: 0, suspiciousActivity: 3 },
  { time: "12 PM", motionAlerts: 8, unauthorizedAccess: 2, suspiciousActivity: 1 },
  { time: "1 PM", motionAlerts: 12, unauthorizedAccess: 1, suspiciousActivity: 4 },
  { time: "2 PM", motionAlerts: 14, unauthorizedAccess: 3, suspiciousActivity: 2 },
];

export const AnalyticsChart = () => {
  return (
    <div className="security-glass rounded-lg p-4 h-full">
      <h2 className="text-lg font-medium mb-4">Alert Activity (Today)</h2>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 20,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="time" stroke="#6B7280" />
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
      </ResponsiveContainer>
    </div>
  );
};
