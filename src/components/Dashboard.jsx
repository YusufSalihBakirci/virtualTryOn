import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";

const Dashboard = () => {
  const stats = [
    { title: "Toplam Kullanıcı", value: "1,234", change: "+12%" },
    { title: "Aylık Gelir", value: "₺45,678", change: "+8%" },
    { title: "Aktif Denemeler", value: "89", change: "+23%" },
    { title: "Tamamlanan Analizler", value: "456", change: "+15%" },
  ];

  const recentUsers = [
    {
      id: 1,
      name: "Ayşe Demir",
      email: "ayse@beautyai.com",
      role: "Premium",
      status: "Aktif",
    },
    {
      id: 2,
      name: "Zeynep Kaya",
      email: "zeynep@beautyai.com",
      role: "Basic",
      status: "Aktif",
    },
    {
      id: 3,
      name: "Melisa Yılmaz",
      email: "melisa@beautyai.com",
      role: "Basic",
      status: "Pasif",
    },
    {
      id: 4,
      name: "Selin Özkan",
      email: "selin@beautyai.com",
      role: "Premium",
      status: "Aktif",
    },
  ];

  const recentOrders = [
    {
      id: "#001",
      customer: "Elif Veli",
      amount: "₺29,99",
      status: "Tamamlandı",
      date: "2024-01-15",
    },
    {
      id: "#002",
      customer: "Fatma Şen",
      amount: "₺19,99",
      status: "İşleniyor",
      date: "2024-01-14",
    },
    {
      id: "#003",
      customer: "Hande Çelik",
      amount: "₺49,99",
      status: "İptal",
      date: "2024-01-13",
    },
    {
      id: "#004",
      customer: "Elif Yıldız",
      amount: "₺29,99",
      status: "Tamamlandı",
      date: "2024-01-12",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Aktif":
      case "Tamamlandı":
        return "bg-green-100 text-green-800";
      case "İşleniyor":
        return "bg-yellow-100 text-yellow-800";
      case "Pasif":
      case "İptal":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* İstatistik Kartları */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-gray-950 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-200">
                {stat.title}
              </CardTitle>
              <Badge
                variant="secondary"
                className="text-xs bg-gray-800 text-gray-300 hidden sm:inline-flex"
              >
                {stat.change}
              </Badge>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0">
              <div className="text-lg sm:text-2xl font-bold text-white">
                {stat.value}
              </div>
              <div className="text-xs text-green-400 mt-1 sm:hidden">
                {stat.change}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Son Aktiviteler */}
      <div className="grid grid-cols-1 gap-6">
        {/* Son Kullanıcılar */}
        <Card className="bg-gray-950 border-gray-800">
          <CardHeader className="p-3 sm:p-6">
            <CardTitle className="text-white text-sm sm:text-base">
              Son Kullanıcılar
            </CardTitle>
            <CardDescription className="text-gray-400 text-xs sm:text-sm">
              Sisteme yeni kayıt olan kullanıcılar
            </CardDescription>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <div className="space-y-3 sm:space-y-4">
              {recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-2 sm:p-3 rounded-sm bg-gray-800 hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
                    <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
                      <AvatarFallback className="bg-gray-700 text-white text-xs sm:text-sm">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-medium text-white truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 flex-shrink-0">
                    <Badge
                      variant="outline"
                      className="text-xs border-gray-600 text-gray-300 hidden sm:inline-flex"
                    >
                      {user.role}
                    </Badge>
                    <Badge
                      className={`text-xs ${getStatusColor(user.status)}`}
                    >
                      {user.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Son Siparişler */}
        <Card className="bg-gray-950 border-gray-800">
          <CardHeader className="p-3 sm:p-6">
            <CardTitle className="text-white text-sm sm:text-base">
              Son Siparişler
            </CardTitle>
            <CardDescription className="text-gray-400 text-xs sm:text-sm">
              En son yapılan siparişler
            </CardDescription>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <div className="space-y-3 sm:space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-2 sm:p-3 rounded-sm bg-gray-800 hover:bg-gray-700 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-white">
                      {order.id}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {order.customer}
                    </p>
                  </div>
                  <div className="flex flex-col items-end space-y-1 flex-shrink-0">
                    <p className="text-xs sm:text-sm font-medium text-white">
                      {order.amount}
                    </p>
                    <Badge
                      className={`text-xs ${getStatusColor(order.status)}`}
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
