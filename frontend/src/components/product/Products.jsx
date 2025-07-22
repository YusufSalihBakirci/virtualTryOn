import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "../ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "../ui/navigation-menu";

const columns = [
  { accessorKey: "id", header: "Kod" },
  { accessorKey: "stockCode", header: "Stok Kodu" },
  { accessorKey: "name", header: "Ürün Adı" },
  { accessorKey: "category", header: "Kategori" },
  { accessorKey: "brand", header: "Marka" },
  { accessorKey: "inventory", header: "Stok" },
  { accessorKey: "price", header: "Fiyat" },
  { accessorKey: "url", header: "Ürün Linki" },
  { accessorKey: "image", header: "Görsel" },
  { accessorKey: "active", header: "Durum" },
];

const XML_URL = "/api/products";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [activeStates, setActiveStates] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(XML_URL);
      const parser = new DOMParser();
      const xml = parser.parseFromString(res.data, "text/xml");
      const productNodes = xml.getElementsByTagName("product");

      const parsedProducts = Array.from(productNodes).map((node) => ({
        id: node.getElementsByTagName("product_code")[0]?.textContent,
        stockCode:
          node.getElementsByTagName("product_stock_code")[0]?.textContent,
        name: node.getElementsByTagName("product_name")[0]?.textContent,
        category: node.getElementsByTagName("category_name")[0]?.textContent,
        brand: node.getElementsByTagName("brand")[0]?.textContent,
        inventory: node.getElementsByTagName("inventory")[0]?.textContent,
        price: node.getElementsByTagName("discounted_price")[0]?.textContent,
        url: node.getElementsByTagName("product_url")[0]?.textContent,
        image: node.getElementsByTagName("small_image")[0]?.textContent,
        isActive:
          node.getElementsByTagName("is_active")[0]?.textContent === "1",
      }));

      setProducts(parsedProducts);
      setActiveStates(parsedProducts.map((p) => p.isActive));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleToggleActive = (index) => {
    setActiveStates((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  return (
    <>
      <div className="bg-gray-950 min-h-screen">
        <div className="fixed left-1/2 -translate-x-1/2 top-4 w-4/5 flex justify-center p-5 rounded-2xl z-50 backdrop-blur-sm border-b transition-all duration-200">
          <div className="container mx-auto px-6 py-3 flex items-center justify-between">
            <span className="font-bold text-lg">Products List</span>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/"
                      className="text-primary font-medium bg-gray-800/50 hover:bg-gray-700/70 px-4 py-2 rounded-md transition-colors"
                    >
                      Admin Panel
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
        <div className="container mx-auto pt-16 max-w-[75%]">
          <div className="flex justify-center my-10">
            <Card className="w-full bg-gray-800">
              <CardHeader>
                <CardTitle className="text-center text-3xl">Products</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      {columns.map((col) => (
                        <TableHead key={col.accessorKey}>
                          {col.header}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product, index) => (
                      <TableRow 
                        key={product.id || `product-${index}`}
                        className="transition-colors hover:bg-gray-700/50"
                      >
                        {columns.map((col) => (
                          <TableCell
                            key={`${product.id || index}-${col.accessorKey}`}
                          >
                            {col.accessorKey === "image" &&
                            product[col.accessorKey] ? (
                              <img
                                src={product[col.accessorKey]}
                                alt={product.name}
                                style={{
                                  width: 50,
                                  height: 50,
                                  objectFit: "contain",
                                }}
                              />
                            ) : col.accessorKey === "url" &&
                              product[col.accessorKey] ? (
                              <a
                                href={product[col.accessorKey]}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Link
                              </a>
                            ) : col.accessorKey === "active" ? (
                              <Badge
                                variant={
                                  activeStates[index] ? "default" : "secondary"
                                }
                                className={
                                  activeStates[index]
                                    ? "cursor-pointer bg-green-500 hover:bg-green-600"
                                    : "cursor-pointer bg-red-500 hover:bg-red-600"
                                }
                                onClick={() => handleToggleActive(index)}
                              >
                                {activeStates[index] ? "Aktif" : "Pasif"}
                              </Badge>
                            ) : (
                              product[col.accessorKey]
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Products;
