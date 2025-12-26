"use client";

import { useEffect, useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { eventBus } from "@/utils/eventBus";

// TYPES -----------------------------------------------------

export type StoreAd = {
  id: number;
  title: string;
  city: string | null;
  src: string;
  alt: string;
  description: string | null;
};

const COLUMNS = ["id", "title", "city", "src", "alt", "description"] as const;
type StoreAdKey = (typeof COLUMNS)[number];

// COMPONENT -------------------------------------------------

export default function StoreAdsTable({
  itemsPerPage = 20,
}: {
  itemsPerPage?: number;
}) {
  const { toast } = useToast();

  const [ads, setAds] = useState<StoreAd[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<Partial<StoreAd>>({});
  const [enableAutoRefresh, setEnableAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState<number | undefined>();

  // Load ads ------------------------------------------------
  const loadAds = useCallback(async () => {
    const res = await fetch(
      `/api/storeads-edit?page=${page}&limit=${itemsPerPage}&search=${search}`
    );

    const data = await res.json();
    setAds(data.data);
    setTotalPages(data.totalPages);
  }, [page, search, itemsPerPage]);

  useEffect(() => {
    loadAds();
  }, [loadAds]);

  // 🔥 AUTO REFRESH INTERVAL
  useEffect(() => {
    if (!enableAutoRefresh || !refreshInterval) return;

    const interval = setInterval(() => {
      loadAds();
    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [enableAutoRefresh, refreshInterval, loadAds]);

  // ⚡ INSTANT SETTINGS UPDATES
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

      // instant refresh
      loadAds();
    };

    eventBus.on("settings:update", handler);
    return () => eventBus.off("settings:update", handler);
  }, [loadAds]);

  // Save update --------------------------------------------
  const saveAd = async (id: number) => {
    try {
      const res = await fetch(`/api/storeads-edit/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error();

      toast({
        title: "Success",
        description: "Ad updated",
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

  // Delete --------------------------------------------------
  const deleteAd = async (id: number) => {
    if (!confirm("Are you sure you want to delete this ad?")) return;
    try {
      const res = await fetch(`/api/storeads-edit/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

      toast({
        title: "Deleted",
        description: "Store ad removed",
        style: {
          background: "green",
          color: "white",
        },
      });
      loadAds();
    } catch {
      toast({
        title: "Error",
        description: "Delete failed",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      {/* Search */}
      <div className="mb-3">
        <Input
          placeholder="Search ads..."
          className="w-60"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />
      </div>

      <div className="w-full overflow-x-auto">
        <table className="min-w-max border text-sm table-auto bg-white dark:bg-card
  text-black">
          <thead className="bg-gray-50">
            <tr>
              {COLUMNS.map((col) => (
                <th key={col} className="border px-3 py-2">
                  {col.toUpperCase()}
                </th>
              ))}
              <th className="border px-3 py-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {ads.map((ad) => (
              <tr key={ad.id} className="odd:bg-gray-50">
                {COLUMNS.map((key: StoreAdKey) => (
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

                <td className="border px-2 py-1 whitespace-nowrap">
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
