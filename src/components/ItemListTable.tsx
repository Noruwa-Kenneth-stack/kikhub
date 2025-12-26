"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { ResizableColumn } from "@/components/ui/resizable-column";
import { Save, X, Pencil, Trash2 } from "lucide-react";
import { eventBus } from "@/utils/eventBus";

export interface ItemList {
  id: number;
  name: string;
  language: string;
  icon: string;
}

type EditableItem = Partial<ItemList>;

interface ItemListTableProps {
  itemsPerPage?: number;
}

const defaultWidths: Record<string, number> = {
  id: 60,
  name: 200,
  language: 100,
  icon: 150,
  actions: 150,
};

export default function ItemListTable({ itemsPerPage = 10 }: ItemListTableProps) {
  const [items, setItems] = useState<ItemList[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<EditableItem>({});
  const [colWidths, setColWidths] = useState(defaultWidths);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
const [enableAutoRefresh, setEnableAutoRefresh] = useState(false);
const [refreshInterval, setRefreshInterval] = useState<number | undefined>();

  const setWidth = (key: string, value: number) =>
    setColWidths((prev) => ({ ...prev, [key]: value }));

  const loadItems = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/itemlist-edit?page=${page}&limit=${itemsPerPage}&search=${search}`
      );
      if (!res.ok) throw new Error("Failed to load items");
      const data = await res.json();
      setItems(data.items);
      setTotalCount(data.total);
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Could not load items" });
    }
  }, [page, search, itemsPerPage]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);


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
    if (editingId !== null) return;

    const interval = setInterval(() => {
      loadItems();
    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [enableAutoRefresh, refreshInterval, editingId, loadItems]);


  const saveItem = async (id: number) => {
    try {
      const res = await fetch(`/api/itemlist-edit/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to update item");

      toast({ title: "Success", description: "Item updated", variant: "success" });
      setEditingId(null);
      setForm({});
      loadItems();
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to update item", variant: "destructive" });
    }
  };

  const deleteItem = async (id: number) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      const res = await fetch(`/api/itemlist-edit/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");

      toast({ title: "Deleted", description: "Item removed", variant: "success" });
      loadItems();
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to delete item", variant: "destructive" });
    }
  };

  const headers = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "language", label: "Language" },
    { key: "icon", label: "Icon" },
    { key: "actions", label: "Actions" },
  ];

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <div>
      {/* SEARCH */}
      <div className="flex items-center gap-2 mb-3">
        <Input
          placeholder="Search items..."
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
        <table className="w-max border-collapse border text-xs table-auto 
  bg-white dark:bg-card
  text-black">
          <thead className="bg-gray-50">
            <tr>
              {headers.map((h) => (
                <th key={h.key} className="border px-3 py-3 whitespace-nowrap">
                  <ResizableColumn width={colWidths[h.key]} onResize={(w) => setWidth(h.key, w)}>
                    {h.label}
                  </ResizableColumn>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="odd:bg-gray-50">
                {headers.map((h) => (
                  <td
                    key={h.key}
                    className="border px-1 py-1 align-top"
                    style={{ width: colWidths[h.key] }}
                  >
                    {h.key === "actions" ? (
                      editingId === item.id ? (
                        <>
                          <Button className="h-6 px-2 text-xs" onClick={() => saveItem(item.id)}>
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
                              setEditingId(item.id);
                              setForm(item);
                            }}
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button
                            className="h-6 px-2 text-xs ml-1"
                            variant="destructive"
                            onClick={() => deleteItem(item.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </>
                      )
                    ) : editingId === item.id ? (
                      <Input
                        value={form[h.key as keyof EditableItem] ?? item[h.key as keyof ItemList] ?? ""}
                        onChange={(e) => setForm({ ...form, [h.key]: e.target.value })}
                        type="text"
                      />
                    ) : (
                      String(item[h.key as keyof ItemList] ?? "")
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
          <Button className="h-7 px-3 text-xs" disabled={page === 1} onClick={() => setPage(page - 1)}>
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
