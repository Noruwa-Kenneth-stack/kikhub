export function getAppSettings() {
  if (typeof window === "undefined") return null;

  try {
    const saved = localStorage.getItem("appSettings");
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}
