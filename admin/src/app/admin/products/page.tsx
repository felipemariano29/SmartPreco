"use client";

import {
    ChevronDown,
    Copy,
    Edit,
    Eye,
    Filter,
    Plus,
    Search,
    Trash
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

import {
    useCreateProduct,
    useDeleteProduct,
    useReadProducts,
    useUpdateProduct,
    type ProductCreateDto,
    type ProductDto,
    type ProductUpdateDto
} from "@/api";

import { ProductDetails } from "@/components/products/product-details";
import { ProductForm } from "@/components/products/product-form";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default function ProductsPage() {
  const t = useTranslations();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedProduct, setSelectedProduct] = useState<ProductDto | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { data, isLoading, refetch } = useReadProducts();
  const createProductMutation = useCreateProduct({
    mutation: {
      onSuccess: () => {
        toast.success(t("notifications.success.created", { entity: t("products.title") }), {
          description: t("notifications.success.created-description"),
        });
        void refetch();
        setIsCreating(false);
      },
      onError: () => {
        toast.error(t("notifications.error.generic"), {
          description: t("notifications.error.creation", { entity: t("products.title") }),
        });
      },
    },
  });

  const updateProductMutation = useUpdateProduct({
    mutation: {
      onSuccess: () => {
        toast.success(t("notifications.success.updated", { entity: t("products.title") }), {
          description: t("notifications.success.updated-description"),
        });
        void refetch();
        setIsEditing(false);
        setSelectedProduct(null);
      },
      onError: () => {
        toast.error(t("notifications.error.generic"), {
          description: t("notifications.error.update", { entity: t("products.title") }),
        });
      },
    },
  });

  const deleteProductMutation = useDeleteProduct({
    mutation: {
      onSuccess: () => {
        toast.success(t("notifications.success.deleted", { entity: t("products.title") }), {
          description: t("notifications.success.deleted-description"),
        });
        void refetch();
        setSelectedProduct(null);
      },
      onError: () => {
        toast.error(t("notifications.error.generic"), {
          description: t("notifications.error.delete", { entity: t("products.title") }),
        });
      },
    },
  });

  const products = data?.records ?? [];

  // Extract unique categories for the filter
  const categories = [...new Set(products.map(product => product.category))];

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (categoryFilter === "all") return matchesSearch;
    return matchesSearch && product.category === categoryFilter;
  });

  const handleCreateProduct = (productData: ProductCreateDto) => {
    createProductMutation.mutate({
      data: {
        ...productData,
      },
    });
  };

  const handleUpdateProduct = (productData: ProductUpdateDto) => {
    if (!selectedProduct) return;

    updateProductMutation.mutate({
      productId: selectedProduct.id,
      data: {
        ...productData,
      },
    });
  };

  const handleDeleteProduct = (product: ProductDto) => {
    if (window.confirm(t("products.confirmDelete", { name: product.name }))) {
      deleteProductMutation.mutate({
        productId: product.id,
      });
    }
  };

  const handleCopyToClipboard = (text: string) => {
    void navigator.clipboard.writeText(text);
    toast.success(t("common.clipboard.copied"));
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{t("products.title")}</h1>
            <p className="mt-1 text-muted-foreground">
              {t("products.description")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t("products.search")}
                className="w-[250px] pl-8 bg-card"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="ml-2 bg-card">
                  <Filter className="mr-2 h-4 w-4" />
                  {t("products.filter.category")}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setCategoryFilter("all")}>
                  {t("products.filter.all")}
                </DropdownMenuItem>
                {categories.map((category) => (
                  <DropdownMenuItem 
                    key={category} 
                    onClick={() => setCategoryFilter(category)}
                  >
                    {category}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm" onClick={() => setIsCreating(true)} variant="default">
              <Plus className="mr-2 h-4 w-4" />
              {t("products.actions.add")}
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>{t("products.title")}</CardTitle>
            <CardDescription>
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? 
                t("products.foundSingular") : 
                t("products.foundPlural")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("products.table.image")}</TableHead>
                    <TableHead>{t("products.table.name")}</TableHead>
                    <TableHead>{t("products.table.category")}</TableHead>
                    <TableHead>{t("products.table.price")}</TableHead>
                    <TableHead>{t("products.table.id")}</TableHead>
                    <TableHead className="text-right">{t("products.table.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="py-8 text-center text-muted-foreground"
                      >
                        {t("products.noProductsFound")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          {product.imageUrl && (
                            <img 
                              src={product.imageUrl} 
                              alt={product.name} 
                              className="h-10 w-10 rounded-md object-cover"
                            />
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>
                          {product.lowestPrice 
                            ? `$${product.lowestPrice.toFixed(2)}` 
                            : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>{product.id.substring(0, 8)}...</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleCopyToClipboard(product.id)}
                              title={t("common.buttons.copy")}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setSelectedProduct(product)}
                              title={t("common.buttons.view")}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedProduct(product);
                                setIsEditing(true);
                              }}
                              title={t("common.buttons.edit")}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteProduct(product)}
                              title={t("common.buttons.delete")}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {selectedProduct && !isEditing && (
        <ProductDetails
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onEdit={() => setIsEditing(true)}
          onDelete={() => handleDeleteProduct(selectedProduct)}
        />
      )}

      {isCreating && (
        <ProductForm
          onSubmit={(data) => handleCreateProduct(data as ProductCreateDto)}
          onCancel={() => setIsCreating(false)}
          isSubmitting={createProductMutation.isPending}
        />
      )}

      {isEditing && selectedProduct && (
        <ProductForm
          product={selectedProduct}
          onSubmit={(data) => handleUpdateProduct(data as ProductUpdateDto)}
          onCancel={() => {
            setIsEditing(false);
            setSelectedProduct(null);
          }}
          isSubmitting={updateProductMutation.isPending}
        />
      )}
    </>
  );
} 