import { useState } from "react";
import StatCard from "./admin/StatCard";
import RecentUsersTable from "./admin/RecentUsersTable";
import RecentOrdersTable from "./admin/RecentOrdersTable";
import DashboardChart from "./admin/DashboardChart";
import UserEditDialog from "./admin/UserEditDialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Smartphone, Mail, Globe } from "lucide-react";

const AdminPanel = () => {
  const [editingUser, setEditingUser] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [users, setUsers] = useState([
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
  ]);

  const stats = [
    { title: "Toplam Kullanıcı", value: "1,234", change: "+12%" },
    { title: "Aylık Gelir", value: "₺45,678", change: "+8%" },
    { title: "Aktif Denemeler", value: "89", change: "+23%" },
    { title: "Tamamlanan Analizler", value: "456", change: "+15%" },
  ];

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

  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsEditDialogOpen(true);
  };

  const handleSaveUser = () => {
    if (editingUser) {
      setUsers(
        users.map((user) => (user.id === editingUser.id ? editingUser : user))
      );
      setIsEditDialogOpen(false);
      setEditingUser(null);
    }
  };

  const handleCancelEdit = () => {
    setIsEditDialogOpen(false);
    setEditingUser(null);
  };

  const handleInputChange = (field, value) => {
    if (editingUser) {
      setEditingUser({
        ...editingUser,
        [field]: value,
      });
    }
  };

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
        return "bg-gray-400 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 overflow-x-hidden">
      <main className="w-full max-w-full px-2 sm:px-4 py-4 sm:py-6">
        {/* Dashboard */}
        <section className="mb-8">
          <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-4">
            {stats.map((stat, idx) => (
              <StatCard
                key={idx}
                title={stat.title}
                value={stat.value}
                change={stat.change}
              />
            ))}
          </div>
        </section>

        {/* Users */}
        <section className="mb-8">
          <Card className="bg-gray-800 border border-gray-700 shadow-lg">
            <CardHeader className="p-3 sm:p-6">
              <CardTitle className="text-white text-sm sm:text-base">
                Kullanıcı Yönetimi
              </CardTitle>
              <CardDescription className="text-gray-400 text-xs sm:text-sm">
                Tüm kullanıcıları görüntüle ve yönet
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 sm:p-6 sm:pt-0">
              <RecentUsersTable
                users={users}
                handleEditUser={handleEditUser}
                getStatusColor={getStatusColor}
              />
            </CardContent>
          </Card>
        </section>

        {/* Sipariş Yönetimi */}
        <section className="mb-8">
          <Card className="bg-gray-800 border border-gray-700 shadow-lg">
            <CardHeader className="p-3 sm:p-6">
              <CardTitle className="text-white text-sm sm:text-base">
                Sipariş Yönetimi
              </CardTitle>
              <CardDescription className="text-gray-400 text-xs sm:text-sm">
                Tüm siparişleri görüntüle ve yönet
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 sm:p-6 sm:pt-0">
              <RecentOrdersTable
                orders={recentOrders}
                getStatusColor={getStatusColor}
              />
            </CardContent>
          </Card>
        </section>

        {/* Analizler */}
        <section className="mb-8">
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 mt-4 sm:mt-6">
            <DashboardChart
              title="Gelir Analizi"
              description="Aylık gelir trendi vs hedef"
              data={revenueData}
              chartType="line"
              config={{
                xAxisKey: "month",
                yAxisTickFormat: (value) => `₺${value.toLocaleString()}`,
                tooltipFormat: (value, name) => [
                  `₺${value.toLocaleString()}`,
                  name === "revenue" ? "Gelir" : "Hedef",
                ],
                series: [
                  {
                    type: "monotone",
                    dataKey: "revenue",
                    stroke: "#3b82f6",
                    strokeWidth: 2,
                    dot: { fill: "#3b82f6", r: 4 },
                    name: "revenue",
                  },
                  {
                    type: "monotone",
                    dataKey: "target",
                    stroke: "#10b981",
                    strokeWidth: 2,
                    strokeDasharray: "5 5",
                    dot: { fill: "#10b981", r: 4 },
                    name: "target",
                  },
                ],
              }}
            />
            <DashboardChart
              title="Kullanıcı Aktivitesi"
              description="Haftalık kullanıcı ve makyaj deneme sayıları"
              data={userActivityData}
              chartType="bar"
              config={{
                xAxisKey: "day",
                tooltipFormat: (value, name) => [
                  value,
                  name === "users" ? "Kullanıcılar" : "Makyaj Denemeleri",
                ],
                series: [
                  {
                    dataKey: "users",
                    fill: "#8b5cf6",
                    radius: [2, 2, 0, 0],
                    name: "users",
                  },
                  {
                    dataKey: "tryons",
                    fill: "#f59e0b",
                    radius: [2, 2, 0, 0],
                    name: "tryons",
                  },
                ],
              }}
            />
          </div>
        </section>
      </main>

      <UserEditDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        editingUser={editingUser}
        onSave={handleSaveUser}
        onCancel={handleCancelEdit}
        onInputChange={handleInputChange}
      />

      <footer className="bg-gray-900 border-t border-gray-700 mt-8">
        <div className="px-3 sm:px-6 py-6 sm:py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8">
            {/* Şirket Bilgileri */}
            <div className="md:col-span-1">
              <h3 className="text-white font-semibold text-sm sm:text-base mb-3">
                Namık AI Studio
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm mb-4">
                Yapay zeka teknolojisi ile makyaj deneyiminizi bir sonraki
                seviyeye taşıyın.
              </p>
              <div className="flex space-x-3">
                <div className="bg-gray-800 rounded-lg shadow overflow-x-auto w-8 h-8 flex items-center justify-center hover:bg-gray-600 cursor-pointer transition-colors">
                  <Smartphone className="w-4 h-4 text-gray-400" />
                </div>
                <div className="bg-gray-800 rounded-lg shadow overflow-x-auto w-8 h-8 flex items-center justify-center hover:bg-gray-600 cursor-pointer transition-colors">
                  <Mail className="w-4 h-4 text-gray-400" />
                </div>
                <div className="bg-gray-800 rounded-lg shadow overflow-x-auto w-8 h-8 flex items-center justify-center hover:bg-gray-600 cursor-pointer transition-colors">
                  <Globe className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Hizmetler */}
            <div>
              <h3 className="text-white font-semibold text-sm sm:text-base mb-3">
                Hizmetler
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    AI Makyaj Analizi
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Sanal Makyaj Denemesi
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Renk Eşleştirme
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Cilt Tonu Analizi
                  </a>
                </li>
              </ul>
            </div>

            {/* Destek */}
            <div>
              <h3 className="text-white font-semibold text-sm sm:text-base mb-3">
                Destek
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Yardım Merkezi
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    API Dokümantasyonu
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Kullanım Kılavuzu
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    İletişim
                  </a>
                </li>
              </ul>
            </div>

            {/* Yasal */}
            <div>
              <h3 className="text-white font-semibold text-sm sm:text-base mb-3">
                Yasal
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Gizlilik Politikası
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Kullanım Şartları
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Çerez Politikası
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    KVKK
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Alt Çubuk */}
          <div className="border-t border-gray-700 mt-6 sm:mt-8 pt-6 sm:pt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
              <p className="text-gray-400 text-xs sm:text-sm">
                2025 Namık AI Studio. Tüm hakları saklıdır.
              </p>
              <div className="flex items-center space-x-4 text-xs sm:text-sm">
                <span className="text-gray-400">Powered by</span>
                <span className="text-white font-semibold">
                  Namık Technology
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdminPanel;
