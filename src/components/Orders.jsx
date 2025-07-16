import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Eye, FileText, Edit, Save, X } from "lucide-react";
import { useState } from "react";

const Orders = () => {
  const [orders, setOrders] = useState([
    {
      id: "#001",
      customer: "Elif Veli",
      amount: "₺29,99",
      status: "Tamamlandı",
      date: "2024-01-15",
      products: [
        { name: "iPhone 13 Pro", quantity: 1, price: "₺29,99" },
        { name: "Kılıf", quantity: 2, price: "₺15,99" }
      ],
      address: "İstanbul, Türkiye",
      phone: "+90 555 123 4567",
      email: "elif.veli@email.com"
    },
    {
      id: "#002",
      customer: "Fatma Şen",
      amount: "₺19,99",
      status: "İşleniyor",
      date: "2024-01-14",
      products: [
        { name: "Samsung Galaxy S21", quantity: 1, price: "₺19,99" }
      ],
      address: "Ankara, Türkiye",
      phone: "+90 555 987 6543",
      email: "fatma.sen@email.com"
    },
    {
      id: "#003",
      customer: "Hande Çelik",
      amount: "₺49,99",
      status: "İptal",
      date: "2024-01-13",
      products: [
        { name: "MacBook Air", quantity: 1, price: "₺49,99" }
      ],
      address: "İzmir, Türkiye",
      phone: "+90 555 456 7890",
      email: "hande.celik@email.com"
    },
    {
      id: "#004",
      customer: "Elif Yıldız",
      amount: "₺29,99",
      status: "Tamamlandı",
      date: "2024-01-12",
      products: [
        { name: "iPad Pro", quantity: 1, price: "₺29,99" }
      ],
      address: "Bursa, Türkiye",
      phone: "+90 555 321 6547",
      email: "elif.yildiz@email.com"
    },
    {
      id: "#005",
      customer: "Seda Kaya",
      amount: "₺39,99",
      status: "İşleniyor",
      date: "2024-01-11",
      products: [
        { name: "AirPods Pro", quantity: 1, price: "₺39,99" }
      ],
      address: "Antalya, Türkiye",
      phone: "+90 555 789 1234",
      email: "seda.kaya@email.com"
    },
    {
      id: "#006",
      customer: "Merve Demir",
      amount: "₺25,99",
      status: "Tamamlandı",
      date: "2024-01-10",
      products: [
        { name: "Apple Watch", quantity: 1, price: "₺25,99" }
      ],
      address: "Adana, Türkiye",
      phone: "+90 555 147 2589",
      email: "merve.demir@email.com"
    },
  ]);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editForm, setEditForm] = useState({});

  const getStatusColor = (status) => {
    switch (status) {
      case "Tamamlandı":
        return "bg-green-100 text-green-800";
      case "İşleniyor":
        return "bg-yellow-100 text-yellow-800";
      case "İptal":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsEditMode(false);
    setEditForm({});
  };

  const handleEditOrder = (order) => {
    setSelectedOrder(order);
    setIsEditMode(true);
    setEditForm({
      customer: order.customer,
      status: order.status,
      address: order.address,
      phone: order.phone,
      email: order.email
    });
  };

  const handleSaveOrder = () => {
    if (selectedOrder && editForm) {
      const updatedOrders = orders.map(order => 
        order.id === selectedOrder.id 
          ? { ...order, ...editForm }
          : order
      );
      setOrders(updatedOrders);
      setSelectedOrder({ ...selectedOrder, ...editForm });
      setIsEditMode(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditForm({});
  };

  const handleCloseDialog = () => {
    setSelectedOrder(null);
    setIsEditMode(false);
    setEditForm({});
  };

  return (
    <>
      <Card className="bg-gray-950 border-gray-800">
        <CardHeader className="p-3 sm:p-6">
          <CardTitle className="text-white text-sm sm:text-base">
            Sipariş Yönetimi
          </CardTitle>
          <CardDescription className="text-gray-400 text-xs sm:text-sm">
            Tüm siparişleri görüntüle ve yönet
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 sm:p-6 sm:pt-0">
          {/* Mobil Görünüm */}
          <div className="sm:hidden">
            <div className="space-y-3 p-3">
              {orders.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-sm mb-2">📦</div>
                  <p className="text-gray-400 text-sm">Henüz sipariş bulunmuyor</p>
                  <p className="text-gray-500 text-xs mt-1">Yeni siparişler geldiğinde burada görünecek</p>
                </div>
              ) : (
                orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-gray-800 rounded-sm p-3 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-white">{order.id}</p>
                        <p className="text-xs text-gray-400">{order.customer}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-white">
                          {order.amount}
                        </p>
                        <p className="text-xs text-gray-400">{order.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge className={`text-xs ${getStatusColor(order.status)}`}>
                        {order.status}
                      </Badge>
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-600 text-gray-300 hover:bg-gray-700 text-xs px-2"
                          onClick={() => handleViewOrder(order)}
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-xs px-2"
                          onClick={() => handleEditOrder(order)}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Masaüstü Tablo Görünümü */}
          <div className="hidden sm:block">
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-2xl mb-4">📦</div>
                <h3 className="text-gray-300 text-lg font-medium mb-2">Henüz sipariş bulunmuyor</h3>
                <p className="text-gray-500 text-sm">Yeni siparişler geldiğinde burada görünecek</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-800">
                    <TableHead className="text-gray-300">Sipariş ID</TableHead>
                    <TableHead className="text-gray-300">Müşteri</TableHead>
                    <TableHead className="text-gray-300">Tutar</TableHead>
                    <TableHead className="text-gray-300">Durum</TableHead>
                    <TableHead className="text-gray-300">Tarih</TableHead>
                    <TableHead className="text-gray-300">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow
                      key={order.id}
                      className="border-gray-800 hover:bg-gray-800"
                    >
                      <TableCell className="font-medium text-white">
                        {order.id}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {order.customer}
                      </TableCell>
                      <TableCell className="font-medium text-white">
                        {order.amount}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-300">{order.date}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-gray-600 text-gray-300 hover:bg-gray-700"
                            onClick={() => handleViewOrder(order)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Görüntüle
                          </Button>
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700"
                            onClick={() => handleEditOrder(order)}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Güncelle
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Sipariş Detay Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={handleCloseDialog}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">
              {isEditMode ? "Sipariş Düzenle" : "Sipariş Detayları"}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {isEditMode ? "Sipariş bilgilerini güncelleyin" : "Sipariş detaylarını görüntüleyin"}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              {/* Temel Bilgiler */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300 text-sm">Sipariş ID</Label>
                  <div className="text-white font-medium">{selectedOrder.id}</div>
                </div>
                <div>
                  <Label className="text-gray-300 text-sm">Tarih</Label>
                  <div className="text-white">{selectedOrder.date}</div>
                </div>
                <div>
                  <Label className="text-gray-300 text-sm">Müşteri Adı</Label>
                  {isEditMode ? (
                    <Input
                      value={editForm.customer || ""}
                      onChange={(e) => setEditForm({...editForm, customer: e.target.value})}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  ) : (
                    <div className="text-white">{selectedOrder.customer}</div>
                  )}
                </div>
                <div>
                  <Label className="text-gray-300 text-sm">Durum</Label>
                  {isEditMode ? (
                    <Select value={editForm.status || ""} onValueChange={(value) => setEditForm({...editForm, status: value})}>
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="Tamamlandı">Tamamlandı</SelectItem>
                        <SelectItem value="İşleniyor">İşleniyor</SelectItem>
                        <SelectItem value="İptal">İptal</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge className={getStatusColor(selectedOrder.status)}>
                      {selectedOrder.status}
                    </Badge>
                  )}
                </div>
              </div>

              {/* İletişim Bilgileri */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">İletişim Bilgileri</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300 text-sm">E-posta</Label>
                    {isEditMode ? (
                      <Input
                        value={editForm.email || ""}
                        onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                    ) : (
                      <div className="text-white">{selectedOrder.email}</div>
                    )}
                  </div>
                  <div>
                    <Label className="text-gray-300 text-sm">Telefon</Label>
                    {isEditMode ? (
                      <Input
                        value={editForm.phone || ""}
                        onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                    ) : (
                      <div className="text-white">{selectedOrder.phone}</div>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-gray-300 text-sm">Adres</Label>
                    {isEditMode ? (
                      <Input
                        value={editForm.address || ""}
                        onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                    ) : (
                      <div className="text-white">{selectedOrder.address}</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Ürün Listesi */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Ürünler</h3>
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="space-y-3">
                    {selectedOrder.products.map((product, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-700 rounded">
                        <div className="flex-1">
                          <div className="text-white font-medium">{product.name}</div>
                          <div className="text-gray-400 text-sm">Adet: {product.quantity}</div>
                        </div>
                        <div className="text-white font-medium">{product.price}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-600">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 font-medium">Toplam Tutar:</span>
                      <span className="text-white font-bold text-lg">{selectedOrder.amount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-2">
            {isEditMode ? (
              <>
                <Button
                  variant="outline"
                  onClick={handleCancelEdit}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <X className="w-4 h-4 mr-2" />
                  İptal
                </Button>
                <Button
                  onClick={handleSaveOrder}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Kaydet
                </Button>
              </>
            ) : (
              <Button
                onClick={() => handleEditOrder(selectedOrder)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Edit className="w-4 h-4 mr-2" />
                Düzenle
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Orders;
