import { useEffect, useRef } from "react";
import { getAppSettings } from "@/utils/appSettings";

export function useAutoSave(
  data: unknown,
  onSave: () => void
) {
  const settings = getAppSettings();
  const interval = settings?.autosaveInterval;   
  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!interval) return;

    timer.current = setInterval(() => {
      onSave();
    }, interval * 1000);

    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [interval, data, onSave]);
}
