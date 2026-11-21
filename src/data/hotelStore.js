import { API_BASE } from "../api/client";
import { useSyncExternalStore } from "react";

const API_URL = `${API_BASE}/public_hotels.php`;
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200";
const EVENT = "northernstays:hotels-updated";
let hotelsCache = [];
let loadingPromise = null;
let loaded = false;
let loadError = null;

function normalizeRoom(room) {
  const originalPrice = Number(room.price_per_night ?? room.price ?? 0);
  const discounted =
    room.discounted_price_per_night == null ||
    room.discounted_price_per_night === ""
      ? null
      : Number(room.discounted_price_per_night);
  const hasDiscount =
    discounted !== null &&
    Number.isFinite(discounted) &&
    discounted >= 0 &&
    discounted < originalPrice;
  const gallery =
    Array.isArray(room.gallery) && room.gallery.length
      ? room.gallery
      : room.image_url
        ? [room.image_url]
        : [];
  return {
    id: room.id,
    name: room.room_name || room.name || "Standard Room",
    number: room.room_number || "",
    type: room.room_type || "Standard",
    price: hasDiscount ? discounted : originalPrice,
    originalPrice,
    discountedPrice: hasDiscount ? discounted : null,
    capacity: Number(room.capacity ?? 2),
    available: Number(room.online_rooms ?? 0),
    description: room.description || "",
    image: gallery[0] || room.image_url || room.image || FALLBACK_IMAGE,
    gallery,
    status: room.status || "YES",
    online_rooms: Number(room.online_rooms ?? 0),
    offline_rooms: Number(room.offline_rooms ?? 0),
  };
}

function normalizeHotel(hotel) {
  const rooms = Array.isArray(hotel.rooms)
    ? hotel.rooms
        .filter(
          (room) =>
            (room.status === "YES" || !room.status) &&
            Number(room.online_rooms ?? 0) > 0 &&
            Number(room.offline_rooms ?? 0) === 0,
        )
        .map(normalizeRoom)
    : [];
  const prices = rooms.map((room) => room.price).filter((price) => price > 0);
  const image =
    hotel.image_url || hotel.image || rooms[0]?.image || FALLBACK_IMAGE;
  return {
    id: hotel.id,
    name: hotel.hotel_name || hotel.name || "Unnamed Hotel",
    destination: hotel.city_name || hotel.destination || "Northern Pakistan",
    location:
      [hotel.area_name, hotel.city_name].filter(Boolean).join(", ") ||
      hotel.address ||
      hotel.location ||
      "",
    price: prices.length ? Math.min(...prices) : 0,
    status: hotel.status === "YES" ? "Active" : "Inactive",
    rating: Number(hotel.rating || 0),
    reviews: Number(hotel.reviews || 0),
    type: hotel.type || "Hotel",
    image,
    gallery:
      Array.isArray(hotel.gallery) && hotel.gallery.length
        ? hotel.gallery
        : [image],
    amenities: Array.isArray(hotel.amenities) ? hotel.amenities : [],
    description:
      hotel.description || "Comfortable accommodation in Northern Pakistan.",
    rooms,
  };
}

function notify() {
  window.dispatchEvent(new Event(EVENT));
}
export function getHotels() {
  return hotelsCache;
}
export async function fetchHotels(force = false) {
  if (loadingPromise) return loadingPromise;
  if (loaded && !force) return hotelsCache;
  loadingPromise = (async () => {
    try {
      const response = await fetch(API_URL, {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      const data = await response.json();
      if (!response.ok || !data.success || !Array.isArray(data.hotels))
        throw new Error(data.message || "Unable to load hotels.");
      hotelsCache = data.hotels
        .filter((hotel) => hotel.status === "YES")
        .map(normalizeHotel);
      loaded = true;
      loadError = null;
      notify();
      return hotelsCache;
    } catch (error) {
      loadError = error.message || "Failed to load hotels.";
      console.error("NorthernStays hotel API:", error);
      notify();
      throw error;
    } finally {
      loadingPromise = null;
    }
  })();
  return loadingPromise;
}
function subscribe(callback) {
  window.addEventListener(EVENT, callback);
  return () => window.removeEventListener(EVENT, callback);
}
export function useHotels() {
  return useSyncExternalStore(subscribe, getHotels, getHotels);
}
export function useActiveHotels() {
  return useHotels().filter((hotel) => hotel.status === "Active");
}
export function getHotelsError() {
  return loadError;
}
export function saveHotels() {
  throw new Error("Hotel data is now managed through MySQL Admin Panel.");
}
if (typeof window !== "undefined") fetchHotels().catch(() => {});
