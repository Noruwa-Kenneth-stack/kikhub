"use client";

import { useEffect, useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { eventBus } from "@/utils/eventBus";

interface ProductAd {
  id: number;
  image: string | null;
  title: string;
  subtitle: string | null;
  price: string | null;
  offer: string | null;
  hotkey: string | null;
  city: string | null;
}

export default function ProductAdsTable({ itemsPerPage = 20 }) {
  const { toast } = useToast();

  const [ads, setAds] = useState<ProductAd[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<Partial<ProductAd>>({});
const [enableAutoRefresh, setEnableAutoRefresh] = useState(false);
const [refreshInterval, setRefreshInterval] = useState<number | undefined>();

  // Fetch ads
  const loadAds = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/product-ads-edit?page=${page}&limit=${itemsPerPage}&search=${search}`
      );
      if (!res.ok) throw new Error("Failed to load ads");

      const data = await res.json();
      setAds(data.data);
      setTotalPages(data.totalPages);
    } catch {
      toast({
        title: "Error",
        description: "Failed to load ads",
        variant: "destructive",
      });
    }
  }, [page, search, itemsPerPage, toast]);

  useEffect(() => {
    loadAds();
  }, [loadAds]);



    // =============================
  // LOAD SETTINGS ON MOUNT
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
  // LIVE SETTINGS (eventBus)
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
    if (!enableAutoRefresh || !refreshInterval) return;
    if (editingId !== null) return; // 🚫 pause while editing

    const interval = setInterval(() => {
      loadAds();
    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [enableAutoRefresh, refreshInterval, editingId, loadAds]);

  // Save update
  const saveAd = async (id: number) => {
    try {
      const res = await fetch(`/api/product-ads-edit/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Update failed");

      toast({
        title: "Success",
        description: "Product ad updated",
        style: {
          background: "green",
          color: "white",
        },
      });

      setEditingId(null);
      setForm({});
      loadAds();
    } catch {
      toast({
        title: "Error",
        description: "Update failed",
        variant: "destructive",
      });
    }
  };

  // Delete product ad
  const deleteAd = async (id: number) => {
    if (!confirm("Are you sure you want to delete this ad?")) return;

    try {
      const res = await fetch(`/api/product-ads-edit/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");

      toast({ title: "Deleted", description: "Ad removed",  style: {
          background: "red",
          color: "white",
        }, });
      loadAds();
    } catch {
      toast({
        title: "Error",
        description: "Delete failed",
        variant: "destructive",
      });
    }
  };

  const editableKeys: (keyof ProductAd)[] = [
    "title",
    "subtitle",
    "image",
    "price",
    "offer",
    "hotkey",
    "city",
  ];

  return (
    <div>
      {/* Search */}
      <div className="mb-3">
        <Input
          placeholder="Search product ads..."
          className="w-60"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />
      </div>

      <div className="w-full overflow-x-auto">
        <table className="min-w-max border table-auto text-xs
  bg-white dark:bg-card
  text-black">
          <thead className="bg-gray-50">
            <tr>
              <th className="border px-3 py-2">ID</th>
              {editableKeys.map((key) => (
                <th key={key} className="border px-3 py-2">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </th>
              ))}
              <th className="border px-3 py-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {ads.map((ad) => (
              <tr key={ad.id} className="odd:bg-gray-50">
                <td className="border px-2 py-1">{ad.id}</td>

                {editableKeys.map((key) => (
                  <td key={key} className="border px-2 py-1">
                    {editingId === ad.id ? (
                      <Input
                        className="h-7 text-xs"
                        value={form[key] ?? ad[key] ?? ""}
                        onChange={(e) =>
                          setForm({ ...form, [key]: e.target.value })
                        }
                      />
                    ) : (
                      ad[key]
                    )}
                  </td>
                ))}

                <td className="border px-2 py-1">
                  {editingId === ad.id ? (
                    <>
                      <Button
                        className="h-6 px-2 text-xs"
                        onClick={() => saveAd(ad.id)}
                      >
                        <Save className="h-3 w-3" />
                      </Button>
                      <Button
                        className="h-6 px-2 text-xs ml-1"
                        variant="destructive"
                        onClick={() => {
                          setEditingId(null);
                          setForm({});
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        className="h-6 px-2 text-xs"
                        onClick={() => {
                          setEditingId(ad.id);
                          setForm(ad);
                        }}
                      >
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button
                        className="h-6 px-2 text-xs ml-1"
                        variant="destructive"
                        onClick={() => deleteAd(ad.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between mt-4 text-sm">
        <span>
          Page {page} of {totalPages}
        </span>
        <div className="flex gap-2">
          <Button disabled={page === 1} onClick={() => setPage(page - 1)}>
            Prev
          </Button>
          <Button
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
