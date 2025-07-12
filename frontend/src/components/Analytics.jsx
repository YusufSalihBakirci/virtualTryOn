import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Analytics = () => {
  const revenueData = [
    { month: "Ocak", revenue: 25000, target: 30000 },
    { month: "Şubat", revenue: 28000, target: 32000 },
    { month: "Mart", revenue: 35000, target: 38000 },
    { month: "Nisan", revenue: 42000, target: 40000 },
    { month: "Mayıs", revenue: 38000, target: 42000 },
    { month: "Haziran", revenue: 45000, target: 48000 },
  ];

  const userActivityData = [
    { day: "Pzt", users: 120, tryons: 85 },
    { day: "Sal", users: 145, tryons: 102 },
    { day: "Çar", users: 165, tryons: 118 },
    { day: "Per", users: 180, tryons: 135 },
    { day: "Cum", users: 195, tryons: 145 },
    { day: "Cmt", users: 210, tryons: 168 },
    { day: "Paz", users: 155, tryons: 125 },
  ];

  return (
    <div className="grid grid-cols-1 gap-6">
      <Card className="bg-gray-950 border-gray-800">
        <CardHeader className="p-3 sm:p-6">
          <CardTitle className="text-white text-sm sm:text-base">
            Gelir Analizi
          </CardTitle>
          <CardDescription className="text-gray-400 text-xs sm:text-sm">
            Aylık gelir trendi vs hedef
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3 sm:p-6 pt-0">
          <div className="h-48 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#9CA3AF", fontSize: 12 }}
                />
                <YAxis
                  tick={{ fill: "#9CA3AF", fontSize: 12 }}
                  tickFormatter={(value) => `₺${value.toLocaleString()}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "4px",
                    fontSize: "12px",
                    color: "#fff",
                  }}
                  formatter={(value, name) => [
                    `₺${value.toLocaleString()}`,
                    name === "revenue" ? "Gelir" : "Hedef",
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6", r: 4 }}
                  name="revenue"
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="#10b981"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: "#10b981", r: 4 }}
                  name="target"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-950 border-gray-800">
        <CardHeader className="p-3 sm:p-6">
          <CardTitle className="text-white text-sm sm:text-base">
            Kullanıcı Aktivitesi
          </CardTitle>
          <CardDescription className="text-gray-400 text-xs sm:text-sm">
            Haftalık kullanıcı ve makyaj deneme sayıları
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3 sm:p-6 pt-0">
          <div className="h-48 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userActivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="day" tick={{ fill: "#9CA3AF", fontSize: 12 }} />
                <YAxis tick={{ fill: "#9CA3AF", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "4px",
                    fontSize: "12px",
                    color: "#fff",
                  }}
                  formatter={(value, name) => [
                    value,
                    name === "users" ? "Kullanıcılar" : "Makyaj Denemeleri",
                  ]}
                />
                <Bar
                  dataKey="users"
                  fill="#8b5cf6"
                  radius={[2, 2, 0, 0]}
                  name="users"
                />
                <Bar
                  dataKey="tryons"
                  fill="#f59e0b"
                  radius={[2, 2, 0, 0]}
                  name="tryons"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
