"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { ResizableColumn } from "@/components/ui/resizable-column";
import type { FlyerProduct, EditableFlyerProduct } from "@/types/flyerproducts";
import { Save, X, Pencil, Trash2 } from "lucide-react";
import { eventBus } from "@/utils/eventBus";

interface FlyerProductsTableProps {
  itemsPerPage?: number;
}

const defaultWidths: Record<string, number> = {
  id: 60,
  store_id: 90,
  name: 220,
  price: 100,
  discounted_price: 120,
  product_status: 100,
  item_id: 90,
  image: 180,
  sku: 140,
  brands: 160,
  weight: 130,
  image_thumbnails: 180,
  compare_key: 140,
  category: 150,
  subcategory: 150,
  maincategory: 150,
  short_description: 400,
  long_description: 480,
  offer_start_date: 170,
  offer_end_date: 170,
  actions: 150,
};

export default function FlyerProductsTable({
  itemsPerPage = 10,
}: FlyerProductsTableProps) {
  const [products, setProducts] = useState<FlyerProduct[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<EditableFlyerProduct>({});
  const [colWidths, setColWidths] = useState(defaultWidths);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [enableAutoRefresh, setEnableAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState<number | undefined>();

  const setWidth = (key: string, value: number) =>
    setColWidths((prev) => ({ ...prev, [key]: value }));

  // Load all products
  const loadProducts = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/flyer_products_edit?page=${page}&limit=${itemsPerPage}&search=${search}`
      );
      if (!res.ok) throw new Error("Failed to load products");

      const data = await res.json();

      // After API change, data has { items, total }
      setProducts(data.items); // <- must be data.items
      setTotalCount(data.total);
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Could not load products" });
    }
  }, [page, search, itemsPerPage]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]); // ✅ safe

  // =============================
  // LOAD AUTO-REFRESH SETTINGS
  // =============================
  useEffect(() => {
    try {
      const settings = JSON.parse(localStorage.getItem("appSettings") || "{}");
      setEnableAutoRefresh(settings.enableAutoRefresh ?? false);
      setRefreshInterval(settings.refreshInterval);
    } catch (e) {
      console.error("Failed to load auto-refresh settings", e);
    }
  }, []);

  // =============================
  // LIVE SETTINGS UPDATES (eventBus)
  // =============================
  useEffect(() => {
    const handler = (settings: {
      enableAutoRefresh?: boolean;
      refreshInterval?: number;
    }) => {
      if (typeof settings.enableAutoRefresh === "boolean") {
        setEnableAutoRefresh(settings.enableAutoRefresh);
      }
      if (typeof settings.refreshInterval === "number") {
        setRefreshInterval(settings.refreshInterval);
      }
    };

    eventBus.on("settingsUpdated", handler);
    return () => eventBus.off("settingsUpdated", handler);
  }, []);

  // =============================
  // AUTO REFRESH (PAUSE WHILE EDITING)
  // =============================
  useEffect(() => {
    if (editingId !== null) return;
    if (!enableAutoRefresh || !refreshInterval) return;

    const interval = setInterval(() => {
      loadProducts();
    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [editingId, enableAutoRefresh, refreshInterval, loadProducts]);

  // Save product update
  const saveProduct = async (id: number) => {
    try {
      const res = await fetch(`/api/flyer_products_edit/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to update product");

      toast({
        title: "Success",
        description: "Product updated",
        variant: "success",
      });

      setEditingId(null);
      setForm({});
      loadProducts();
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      });
    }
  };

  // Delete product
  const deleteProduct = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/flyer_products_edit/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      toast({
        title: "Deleted",
        description: "Product removed",
        variant: "success",
      });

      loadProducts();
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  const headers = [
    { key: "id", label: "ID" },
    { key: "store_id", label: "Store ID" },
    { key: "name", label: "Name" },
    { key: "price", label: "Price" },
    { key: "discounted_price", label: "Discounted Price" },
    { key: "product_status", label: "Status" },
    { key: "item_id", label: "Item ID" },
    { key: "image", label: "Image" },
    { key: "sku", label: "SKU" },
    { key: "brands", label: "Brands" },
    { key: "weight", label: "Weight" },
    { key: "image_thumbnails", label: "Thumbnails" },
    { key: "compare_key", label: "Compare Key" },
    { key: "category", label: "Category" },
    { key: "subcategory", label: "Subcategory" },
    { key: "maincategory", label: "Main Category" },
    { key: "short_description", label: "Short Desc" },
    { key: "long_description", label: "Long Desc" },
    { key: "offer_start_date", label: "Offer Start" },
    { key: "offer_end_date", label: "Offer End" },
    { key: "actions", label: "Actions" },
  ];

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <div>
      {/* SEARCH BAR */}
      <div className="flex items-center gap-2 mb-3">
        <Input
          placeholder="Search products..."
          className="w-60 h-8 text-xs"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />
      </div>
      <div className="w-full overflow-x-auto max-w-full">
        <table
          className="w-max border-collapse border text-xs table-auto 
  bg-white dark:bg-card
  text-black"
        >
          <thead
            className=" bg-gray-50
  dark:bg-muted
  text-xs"
          >
            <tr>
              {headers.map((h) => (
                <th
                  key={h.key}
                  className="border px-3 py-3   border
    font-semibold
    whitespace-nowrap
    text-foreground
    dark:border-border"
                >
                  <ResizableColumn
                    width={colWidths[h.key]}
                    onResize={(w) => setWidth(h.key, w)}
                  >
                    {h.label}
                  </ResizableColumn>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr
                key={p.id}
                className=" odd:bg-gray-50
    dark:odd:bg-muted
    hover:bg-muted
    dark:hover:bg-accent/10"
              >
{headers.map((h) => (
  <td
    key={h.key}
    className="border align-top px-1 py-[2px] text-foreground dark:border-border"
    style={{ width: colWidths[h.key] }}
  >
    {h.key === "actions" ? (
      editingId === p.id ? (
        <>
          <Button
            className="h-6 px-2 text-xs"
            onClick={() => saveProduct(p.id)}
          >
            <Save className="h-3 w-3 mr-1" />
          </Button>
          <Button
            className="h-6 px-2 text-xs ml-1"
            variant="destructive"
            onClick={() => {
              setEditingId(null);
              setForm({});
            }}
          >
            <X className="h-3 w-3 mr-1" />
          </Button>
        </>
      ) : (
        <>
          <Button
            className="h-6 px-2 text-xs"
            onClick={() => {
              setEditingId(p.id);
              setForm(p);
            }}
          >
            <Pencil className="h-3 w-3" />
          </Button>
          <Button
            className="h-6 px-2 text-xs ml-1"
            variant="destructive"
            onClick={() => deleteProduct(p.id)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </>
      )
    ) : editingId === p.id ? (
      <div
        className="cursor-text"
        onClick={(e) => e.stopPropagation()} // prevent row click when editing
      >
        <Input
          autoFocus
          value={
            h.key === "brands" ||
            h.key === "weight" ||
            h.key === "image_thumbnails"
              ? Array.isArray(form[h.key as keyof EditableFlyerProduct])
                ? (form[h.key as keyof EditableFlyerProduct] as string[]).join(", ")
                : Array.isArray(p[h.key as keyof FlyerProduct])
                ? (p[h.key as keyof FlyerProduct] as string[]).join(", ")
                : ""
              : h.key === "offer_start_date" || h.key === "offer_end_date"
              ? (form[h.key as keyof EditableFlyerProduct] as string | undefined) ??
                (p[h.key as keyof FlyerProduct]
                  ? String(p[h.key as keyof FlyerProduct]).slice(0, 16)
                  : "")
              : form[h.key as keyof EditableFlyerProduct] ??
                p[h.key as keyof FlyerProduct] ??
                ""
          }
          type={
            ["price", "discounted_price", "store_id", "item_id"].includes(h.key)
              ? "number"
              : h.key.includes("date")
              ? "datetime-local"
              : "text"
          }
          onChange={(e) => {
            const val = e.target.value;
            if (
              h.key === "brands" ||
              h.key === "weight" ||
              h.key === "image_thumbnails"
            ) {
              setForm({
                ...form,
                [h.key]: val
                  .split(",")
                  .map((v) => v.trim())
                  .filter(Boolean),
              });
            } else if (
              ["price", "discounted_price", "store_id", "item_id"].includes(h.key)
            ) {
              setForm({
                ...form,
                [h.key]: val ? Number(val) : undefined,
              });
            } else {
              setForm({ ...form, [h.key]: val || undefined });
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              saveProduct(p.id);
            } else if (e.key === "Escape") {
              setEditingId(null);
              setForm({});
            }
          }}
          className="h-7 text-xs"
        />
      </div>
    ) : (
   <div
    className="cursor-pointer min-h-7 flex items-center w-full h-full"
    onClick={(e) => {
      e.stopPropagation();
      setEditingId(p.id);
      setForm(p);
      // Focus this specific cell after state update
      setTimeout(() => {
        const input = e.currentTarget.closest('td')?.querySelector('input');
        input?.focus();
        input?.select();
      }, 0);
    }}
  >
    {h.key === "brands" ||
    h.key === "weight" ||
    h.key === "image_thumbnails"
      ? (p[h.key as keyof FlyerProduct] as string[])?.join(", ") ?? ""
      : String(p[h.key as keyof FlyerProduct] ?? "")}
  </div>
    )}
  </td>
))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between items-center mt-4 text-sm">
        <div>
          Page {page} of {totalPages}
        </div>
        <div className="flex gap-2">
          <Button
            className="h-7 px-3 text-xs"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </Button>
          <Button
            className="h-7 px-3 text-xs"
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
