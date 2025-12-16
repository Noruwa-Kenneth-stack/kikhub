"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { ResizableColumn } from "@/components/ui/resizable-column";
import { Save, X, Pencil, Trash2 } from "lucide-react";
import { eventBus } from "@/utils/eventBus";

export interface ProductBanner {
  id: number;
  product_id: number | null;
  title: string;
  subtitle?: string;
  headlines?: string;
  image?: string;
  city?: string;
  created_at: string;
  updated_at: string;
}

type EditableProductBanner = Partial<ProductBanner>;

interface ProductBannerTableProps {
  itemsPerPage?: number;
}

const defaultWidths: Record<string, number> = {
  id: 60,
  product_id: 90,
  title: 220,
  subtitle: 200,
  headlines: 200,
  image: 180,
  city: 120,
  created_at: 150,
  updated_at: 150,
  actions: 150,
};

export default function ProductBannerTable({
  itemsPerPage = 10,
}: ProductBannerTableProps) {
  const [banners, setBanners] = useState<ProductBanner[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<EditableProductBanner>({});
  const [colWidths, setColWidths] = useState(defaultWidths);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [enableAutoRefresh, setEnableAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState<number | undefined>();

  const setWidth = (key: string, value: number) =>
    setColWidths((prev) => ({ ...prev, [key]: value }));

  const loadBanners = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/product-banner-edit?page=${page}&limit=${itemsPerPage}&search=${search}`
      );
      if (!res.ok) throw new Error("Failed to load banners");
      const data = await res.json();
      setBanners(data.items);
      setTotalCount(data.total);
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Could not load banners" });
    }
  }, [page, search, itemsPerPage]);

  useEffect(() => {
    loadBanners();
  }, [loadBanners]);

  // 🔥 AUTO REFRESH INTERVAL
  useEffect(() => {
    if (!enableAutoRefresh || !refreshInterval) return;

    const interval = setInterval(() => {
      loadBanners();
    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [enableAutoRefresh, refreshInterval, loadBanners]);

  // ⚡ INSTANT UPDATES FROM SETTINGS
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

      // instant reload when settings change
      loadBanners();
    };

    eventBus.on("settings:update", handler);
    return () => eventBus.off("settings:update", handler);
  }, [loadBanners]);

  const saveBanner = async (id: number) => {
    try {
      const res = await fetch(`/api/product-banner-edit/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to update banner");

      toast({
        title: "Success",
        description: "Banner updated",
        variant: "success",
      });
      setEditingId(null);
      setForm({});
      loadBanners();
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to update banner",
        variant: "destructive",
      });
    }
  };

  const deleteBanner = async (id: number) => {
    try {
      const res = await fetch(`/api/product-banner-edit/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");

      toast({
        title: "Deleted",
        description: "Banner removed",
        variant: "success",
      });
      loadBanners();
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to delete banner",
        variant: "destructive",
      });
    }
  };

  const headers = [
    { key: "id", label: "ID" },
    { key: "product_id", label: "Product ID" },
    { key: "title", label: "Title" },
    { key: "subtitle", label: "Subtitle" },
    { key: "headline", label: "Headline" },
    { key: "image", label: "Image" },
    { key: "city", label: "City" },
    { key: "created_at", label: "Created At" },
    { key: "updated_at", label: "Updated At" },
    { key: "actions", label: "Actions" },
  ];

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <div>
      {/* SEARCH */}
      <div className="flex items-center gap-2 mb-3">
        <Input
          placeholder="Search banners..."
          className="w-60 h-8 text-xs"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />
      </div>

      {/* TABLE */}
      <div className="w-full overflow-x-auto max-w-full">
        <table className="w-max border-collapse border text-xs table-auto">
          <thead className="bg-gray-50">
            <tr>
              {headers.map((h) => (
                <th key={h.key} className="border px-3 py-3 whitespace-nowrap">
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
            {banners.map((b) => (
              <tr key={b.id} className="odd:bg-gray-50">
                {headers.map((h) => (
                  <td
                    key={h.key}
                    className="border px-1 py-1 align-top"
                    style={{ width: colWidths[h.key] }}
                  >
                    {h.key === "actions" ? (
                      editingId === b.id ? (
                        <>
                          <Button
                            className="h-6 px-2 text-xs"
                            onClick={() => saveBanner(b.id)}
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
                              setEditingId(b.id);
                              setForm(b);
                            }}
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button
                            className="h-6 px-2 text-xs ml-1"
                            variant="destructive"
                            onClick={() => deleteBanner(b.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </>
                      )
                    ) : editingId === b.id ? (
                      <Input
                        value={
                          form[h.key as keyof EditableProductBanner] ??
                          b[h.key as keyof ProductBanner] ??
                          ""
                        }
                        onChange={(e) =>
                          setForm({ ...form, [h.key]: e.target.value })
                        }
                        type={h.key === "product_id" ? "number" : "text"}
                      />
                    ) : (
                      String(b[h.key as keyof ProductBanner] ?? "")
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
