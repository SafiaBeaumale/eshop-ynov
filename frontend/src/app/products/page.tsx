"use client";

import { ProductGrid } from "@/components/product-grid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { catalogApi } from "@/lib/api";
import type { Product } from "@/types";
import { motion } from "framer-motion";
import { Filter, Search, SlidersHorizontal, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";

const sortOptions = [
  { value: "default", label: "Par défaut" },
  { value: "price-asc", label: "Prix croissant" },
  { value: "price-desc", label: "Prix décroissant" },
  { value: "name-asc", label: "Nom A-Z" },
  { value: "name-desc", label: "Nom Z-A" },
];

const brandNames = [
  "Apple",
  "Samsung",
  "Sony",
  "Dell",
  "Canon",
  "Nintendo",
  "Bose",
  "Microsoft",
  "Google",
  "LG",
];

function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const searchParam = searchParams.get("search");

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(["Tous"]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(
    categoryParam || "Tous",
  );
  const [sortBy, setSortBy] = useState("default");
  const [searchQuery, setSearchQuery] = useState(searchParam || "");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await catalogApi.getProducts(1, 100);
      setAllProducts(data);

      // Extract unique categories from products (excluding brand names)
      const allCategories = data.flatMap(
        (product: Product) => product.categories || [],
      );
      const uniqueCategories = [...new Set(allCategories)].filter(
        (cat) => cat && !brandNames.includes(cat),
      );
      setCategories(["Tous", ...uniqueCategories]);
    } catch (error) {
      console.error("Error fetching products:", error);
      setAllProducts([]);
      setCategories(["Tous"]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  useEffect(() => {
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [searchParam]);

  // Filter products by category and search
  useEffect(() => {
    let filtered = allProducts;

    // Filter by category
    if (selectedCategory && selectedCategory !== "Tous") {
      filtered = filtered.filter((p) =>
        p.categories?.includes(selectedCategory),
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query),
      );
    }

    setProducts(filtered);
  }, [allProducts, selectedCategory, searchQuery]);

  // Sort products
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-3">Catégories</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <motion.div
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Badge
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer px-3 py-1.5 text-sm"
                onClick={() => {
                  setSelectedCategory(category);
                  setIsFilterOpen(false);
                }}
              >
                {category}
              </Badge>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-linear-to-br from-muted/50 to-muted/20 border-b"
      >
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {selectedCategory === "Tous"
              ? "Tous nos produits"
              : selectedCategory}
          </h1>
          <p className="text-muted-foreground">
            {sortedProducts.length} produit
            {sortedProducts.length > 1 ? "s" : ""} disponible
            {sortedProducts.length > 1 ? "s" : ""}
          </p>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Rechercher par nom ou description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </motion.div>

        {/* Filters Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8"
        >
          {/* Category Pills (Desktop) */}
          <div className="hidden md:flex flex-wrap gap-2">
            {categories.map((category) => (
              <motion.div
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Badge
                  variant={
                    selectedCategory === category ? "default" : "secondary"
                  }
                  className="cursor-pointer px-4 py-2 text-sm transition-all"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              </motion.div>
            ))}
          </div>

          {/* Mobile Filter Button */}
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="md:hidden gap-2">
                <Filter className="h-4 w-4" />
                Filtres
                {selectedCategory !== "Tous" && (
                  <Badge variant="secondary" className="ml-1">
                    1
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Filtres</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <FilterContent />
              </div>
            </SheetContent>
          </Sheet>

          {/* Sort & Active Filters */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            {selectedCategory !== "Tous" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <Badge
                  variant="secondary"
                  className="gap-1 cursor-pointer"
                  onClick={() => setSelectedCategory("Tous")}
                >
                  {selectedCategory}
                  <X className="h-3 w-3" />
                </Badge>
              </motion.div>
            )}

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-45">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Products Grid */}
        <ProductGrid
          products={sortedProducts}
          isLoading={isLoading}
          columns={4}
        />
      </div>
    </div>
  );
}

function ProductsLoading() {
  return (
    <div className="min-h-screen">
      <div className="bg-linear-to-br from-muted/50 to-muted/20 border-b">
        <div className="container mx-auto px-4 py-12">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-32" />
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-2 mb-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-10 w-24" />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-square w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsLoading />}>
      <ProductsContent />
    </Suspense>
  );
}
