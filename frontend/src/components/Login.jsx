import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Eye, EyeOff } from "lucide-react";

// SQL injection kontrolü
const hasSQLInjection = (input) => {
  const sqlPattern = /('|--|;|\/\*|\*\/|xp_)/i;
  return sqlPattern.test(input);
};

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    // TODO: sonradan axios eklenecek
    //   try {
    //     const response = await axios.post('/', { email, password });
    //     console.log(response.data);
    //   } catch (error) {
    //     console.error('Login failed:', error);
    //   }
    // };
    e.preventDefault();
    setError("");

    const formData = new FormData(e.target);
    const email = formData.get("email") || "";
    const password = formData.get("password") || "";

    if (hasSQLInjection(email) || hasSQLInjection(password)) {
      setError("Geçersiz karakterler içeren bir giriş yaptınız.");
      return;
    }

    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <img src="/logo.png" alt="Logo" className="mx-auto w-40 h-40" />
          <CardTitle className="text-2xl font-bold text-center">
            Giriş Yap
          </CardTitle>
          <CardDescription className="text-center">
            Hesabınıza giriş yapmak için bilgilerinizi girin
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="E-posta adresinizi girin"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Şifre</Label>
                <Link
                  to="#"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Şifremi Unuttum
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember" className="text-sm">
                  Beni Hatırla
                </Label>
              </div>
            </div>
            {error && (
              <div className="text-red-500 text-sm text-center p-2 bg-red-50 rounded-md">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full mt-2">
              Giriş Yap
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4"></CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
