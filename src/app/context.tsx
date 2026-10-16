import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { Service } from "./catalog";

type AppState = {
  basket: Service[];
  add: (service: Service) => void;
  remove: (slug: string) => void;
  has: (slug: string) => boolean;
  clear: () => void;
};
const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [basket, setBasket] = useState<Service[]>(() => {
    try { return JSON.parse(localStorage.getItem("ep-basket") || "[]") as Service[]; }
    catch { return []; }
  });
  const store = (next: Service[]) => {
    setBasket(next);
    localStorage.setItem("ep-basket", JSON.stringify(next));
  };
  const value = useMemo<AppState>(() => ({
    basket,
    add: (service) => { if (!basket.some((item) => item.slug === service.slug)) store([...basket, service]); },
    remove: (slug) => store(basket.filter((item) => item.slug !== slug)),
    has: (slug) => basket.some((item) => item.slug === slug),
    clear: () => store([]),
  }), [basket]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
export function useApp() {
  const value = useContext(AppContext);
  if (!value) throw new Error("useApp must be used inside AppProvider");
  return value;
}
