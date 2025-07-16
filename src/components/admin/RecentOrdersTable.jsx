import { Badge } from "../ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

const RecentOrdersTable = ({ orders, getStatusColor }) => {
  return (
    <>
      {/* Mobil Görünüm */}
      <div className="sm:hidden">
        <div className="space-y-3 p-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-gray-700 rounded-sm p-3 space-y-2"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-white">
                    {order.customer}
                  </p>
                  <p className="text-xs text-gray-400">{order.id}</p>
                </div>
                <p className="text-sm font-semibold text-white">{order.amount}</p>
              </div>
              <div className="flex justify-between items-center">
                <Badge className={`text-xs ${getStatusColor(order.status)}`}>
                  {order.status}
                </Badge>
                <p className="text-xs text-gray-400">{order.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Masaüstü Tablo Görünümü */}
      <div className="hidden sm:block">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-700">
              <TableHead className="text-gray-400">Sipariş ID</TableHead>
              <TableHead className="text-gray-400">Müşteri</TableHead>
              <TableHead className="text-gray-400">Tutar</TableHead>
              <TableHead className="text-gray-400">Durum</TableHead>
              <TableHead className="text-gray-400">Tarih</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow
                key={order.id}
                className="border-gray-700 hover:bg-gray-700 text-gray-100"
              >
                <TableCell className="font-medium text-white">
                  {order.id}
                </TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.amount}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-400">{order.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default RecentOrdersTable;
