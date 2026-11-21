import { createContext, useContext } from "react";

// One server-verified session check is shared by every nested admin route.
// Lives outside App.jsx so admin pages can read it without a circular import.
export const HotelSessionContext = createContext(null);

export function useHotelSession() {
  const session = useContext(HotelSessionContext);
  if (!session) throw new Error("Hotel session provider is missing.");
  return session;
}
