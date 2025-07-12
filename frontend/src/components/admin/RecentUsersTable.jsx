import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Edit, Trash2 } from "lucide-react";

const RecentUsersTable = ({ users, handleEditUser, getStatusColor }) => {
  return (
    <>
      {/* Mobil Görünüm */}
      <div className="sm:hidden">
        <div className="space-y-3 p-3">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-gray-700 rounded-sm p-3 space-y-2"
            >
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gray-600 text-white text-xs">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <Badge
                    variant="outline"
                    className="text-xs border-gray-600 text-gray-400"
                  >
                    {user.role}
                  </Badge>
                  <Badge className={`text-xs ${getStatusColor(user.status)}`}>
                    {user.status}
                  </Badge>
                </div>
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-gray-600 text-gray-400 hover:bg-gray-700 text-xs px-2"
                    onClick={() => handleEditUser(user)}
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="bg-red-600 hover:bg-red-700 text-xs px-2"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
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
              <TableHead className="text-gray-400">Kullanıcı</TableHead>
              <TableHead className="text-gray-400">Email</TableHead>
              <TableHead className="text-gray-400">Rol</TableHead>
              <TableHead className="text-gray-400">Durum</TableHead>
              <TableHead className="text-gray-400">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.id}
                className="border-gray-700 hover:bg-gray-700 text-gray-100"
              >
                <TableCell className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback className="bg-gray-600 text-white">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-white">{user.name}</span>
                </TableCell>
                <TableCell className="text-gray-400">{user.email}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className="border-gray-600 text-gray-400"
                  >
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(user.status)}>
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gray-600 text-gray-400 hover:bg-gray-700"
                      onClick={() => handleEditUser(user)}
                    >
                      Düzenle
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Sil
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default RecentUsersTable;
