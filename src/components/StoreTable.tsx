"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { eventBus } from "@/utils/eventBus";

interface Store {
  id: number;
  store_name: string;
  image_url?: string | null;
  status: string;
  featured: boolean;
  logo?: string | null;
  city: string;
  address: string;
  categories: string[];
  location: { lat: number | null; lng: number | null } | null;
  opening_hours: string;
}

type EditableStore = Partial<Omit<Store, "location">> & {
  location?: { lat: number | null; lng: number | null } | null;
};

interface StoreTableProps {
  itemsPerPage?: number;
}

export default function StoreTable({ itemsPerPage = 10 }: StoreTableProps) {
  const [stores, setStores] = useState<Store[]>([]);
  const [editingStoreId, setEditingStoreId] = useState<number | null>(null);
  const [form, setForm] = useState<EditableStore>({});
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [enableAutoRefresh, setEnableAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState<number | undefined>();

  const loadStores = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/stores-edit?page=${page}&limit=${itemsPerPage}&search=${search}`
      );
      if (!res.ok) throw new Error("Failed to load stores");
      const data = await res.json();
      setStores(data.items);
      setTotalCount(data.total);
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to load stores", variant: "destructive" });
    }
  }, [page, search, itemsPerPage]);

  useEffect(() => {
    loadStores();
  }, [loadStores]);


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
  // AUTO REFRESH EFFECT
  // =============================
  useEffect(() => {
    if (!enableAutoRefresh || !refreshInterval) return;

    const interval = setInterval(() => {
      loadStores();
    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [enableAutoRefresh, refreshInterval, loadStores]);

  // Save store
  const saveStore = async (id: number) => {
    try {
      const res = await fetch(`/api/stores-edit/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to update");

      toast({ title: "Success", description: "Store updated", variant: "success" });
      setEditingStoreId(null);
      setForm({});
      loadStores();
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to update store", variant: "destructive" });
    }
  };

  // Delete store
  const deleteStore = async (id: number) => {
    if (!confirm("Are you sure you want to delete this store?")) return;
    try {
      const res = await fetch(`/api/stores-edit/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete store");

      toast({ title: "Deleted", description: "Store removed", variant: "success" });
      loadStores();
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to delete store", variant: "destructive" });
    }
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <div>
      {/* SEARCH */}
      <div className="flex items-center gap-2 mb-3">
        <Input
          placeholder="Search stores..."
          className="w-60 h-8 text-xs"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />
      </div>

      

      {/* TABLE */}
      <div className="overflow-x-auto w-full">
        <table className="table-auto w-full border text-xs">
          <thead className="bg-gray-50 text-xs">
            <tr>
              {[
                "ID",
                "Name",
                "Image URL",
                "Status",
                "Featured",
                "Logo",
                "City",
                "Address",
                "Categories",
                "Location",
                "Opening Hours",
                "Actions",
              ].map((col) => (
                <th key={col} className="border px-1 py-1 font-semibold whitespace-nowrap">
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {stores.map((store) => (
              <tr key={store.id} className="odd:bg-gray-50">
                <td className="border px-1 py-[2px]">{store.id}</td>

                {/* NAME */}
                <td className="border px-1 py-[2px] break-words max-w-[120px]">
                  {editingStoreId === store.id ? (
                    <Input
                      value={form.store_name ?? store.store_name}
                      onChange={(e) => setForm({ ...form, store_name: e.target.value })}
                    />
                  ) : (
                    store.store_name
                  )}
                </td>

                {/* IMAGE URL */}
                <td className="border px-1 py-[2px] break-words max-w-[120px]">
                  {editingStoreId === store.id ? (
                    <Input
                      value={form.image_url ?? store.image_url ?? ""}
                      onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                    />
                  ) : (
                    store.image_url
                  )}
                </td>

                {/* STATUS */}
                <td className="border px-2 py-1">
                  {editingStoreId === store.id ? (
                    <Input
                      value={form.status ?? store.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                    />
                  ) : (
                    store.status
                  )}
                </td>

                {/* FEATURED */}
                <td className="border px-2 py-1 text-center">
                  {editingStoreId === store.id ? (
                    <Switch
                      checked={form.featured ?? store.featured}
                      onCheckedChange={(val) => setForm({ ...form, featured: val })}
                    />
                  ) : store.featured ? (
                    "Yes"
                  ) : (
                    "No"
                  )}
                </td>

                {/* LOGO */}
                <td className="border px-1 py-[2px] break-words max-w-[100px]">
                  {editingStoreId === store.id ? (
                    <Input value={form.logo ?? store.logo ?? ""} onChange={(e) => setForm({ ...form, logo: e.target.value })} />
                  ) : (
                    store.logo
                  )}
                </td>

                {/* CITY */}
                <td className="border px-2 py-1">
                  {editingStoreId === store.id ? (
                    <Input value={form.city ?? store.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                  ) : (
                    store.city
                  )}
                </td>

                {/* ADDRESS */}
                <td className="border px-1 py-[2px] break-words max-w-[100px]">
                  {editingStoreId === store.id ? (
                    <Input value={form.address ?? store.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                  ) : (
                    store.address
                  )}
                </td>

                {/* CATEGORIES */}
                <td className="border px-2 py-1">
                  {editingStoreId === store.id ? (
                    <Input
                      value={form.categories?.join(", ") ?? store.categories.join(", ")}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          categories: e.target.value.split(",").map((c) => c.trim()),
                        })
                      }
                    />
                  ) : (
                    store.categories.join(", ")
                  )}
                </td>

                {/* LOCATION */}
                <td className="border px-1 py-[2px] break-words max-w-[100px]">
                  {editingStoreId === store.id ? (
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Lat"
                        value={form.location?.lat ?? store.location?.lat ?? ""}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            location: {
                              ...(form.location ?? store.location ?? { lat: null, lng: null }),
                              lat: e.target.value === "" ? null : parseFloat(e.target.value),
                            },
                          })
                        }
                      />
                      <Input
                        type="number"
                        placeholder="Lng"
                        value={form.location?.lng ?? store.location?.lng ?? ""}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            location: {
                              ...(form.location ?? store.location ?? { lat: null, lng: null }),
                              lng: e.target.value === "" ? null : parseFloat(e.target.value),
                            },
                          })
                        }
                      />
                    </div>
                  ) : store.location ? (
                    `(${store.location.lat}, ${store.location.lng})`
                  ) : (
                    "-"
                  )}
                </td>

                {/* OPENING HOURS */}
                <td className="border px-1 py-[2px] break-words max-w-[100px]">
                  {editingStoreId === store.id ? (
                    <Input value={form.opening_hours ?? store.opening_hours} onChange={(e) => setForm({ ...form, opening_hours: e.target.value })} />
                  ) : (
                    store.opening_hours
                  )}
                </td>

                {/* ACTIONS */}
                <td className="border px-2 py-1 flex gap-2">
                  {editingStoreId === store.id ? (
                    <>
                      <Button className="h-6 px-2 text-xs" onClick={() => saveStore(store.id)}>
                        Save
                      </Button>
                      <Button
                        className="h-6 px-2 text-xs"
                        variant="destructive"
                        onClick={() => {
                          setEditingStoreId(null);
                          setForm({});
                        }}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button className="h-6 px-2 text-xs" onClick={() => { setEditingStoreId(store.id); setForm(store); }}>
                        Edit
                      </Button>
                      <Button className="h-6 px-2 text-xs" variant="destructive" onClick={() => deleteStore(store.id)}>
                        Delete
                      </Button>
                    </>
                  )}
                </td>
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
          <Button className="h-7 px-3 text-xs" disabled={page === 1} onClick={() => setPage(page - 1)}>
            Prev
          </Button>
          <Button className="h-7 px-3 text-xs" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
