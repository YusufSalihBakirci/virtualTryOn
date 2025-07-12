import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const UserEditDialog = ({
  isOpen,
  onClose,
  editingUser,
  onSave,
  onCancel,
  onInputChange,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>
            {editingUser ? "Kullanıcıyı Düzenle" : "Kullanıcı Ekle"}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {editingUser
              ? "Kullanıcı bilgilerini güncelleyin."
              : "Yeni bir kullanıcı oluşturun."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label htmlFor="name" className="text-gray-300">
              İsim
            </Label>
            <Input
              id="name"
              value={editingUser?.name || ""}
              onChange={(e) => onInputChange("name", e.target.value)}
              className="bg-gray-800 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Kullanıcı adı"
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-gray-300">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={editingUser?.email || ""}
              onChange={(e) => onInputChange("email", e.target.value)}
              className="bg-gray-800 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Kullanıcı emaili"
            />
          </div>
          <div>
            <Label htmlFor="role" className="text-gray-300">
              Rol
            </Label>
            <Select
              value={editingUser?.role || "Basic"}
              onValueChange={(value) => onInputChange("role", value)}
            >
              <SelectTrigger className="bg-gray-800 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <SelectValue placeholder="Rol seçin" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="Basic" className="text-gray-300">
                  Temel
                </SelectItem>
                <SelectItem value="Premium" className="text-gray-300">
                  Premium
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="status" className="text-gray-300">
              Durum
            </Label>
            <Select
              value={editingUser?.status || "Aktif"}
              onValueChange={(value) => onInputChange("status", value)}
            >
              <SelectTrigger className="bg-gray-800 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <SelectValue placeholder="Durum seçin" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="Aktif" className="text-gray-300">
                  Aktif
                </SelectItem>
                <SelectItem value="Pasif" className="text-gray-300">
                  Pasif
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
            onClick={onCancel}
          >
            İptal
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={onSave}
          >
            {editingUser ? "Kaydet" : "Oluştur"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserEditDialog;
