import { useSyncExternalStore } from "react";

const API_URL = "https://coreops.pk/Hotel/api/public_hotels.php";
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200";

const EVENT = "northernstays:hotels-updated";

let hotelsCache = [];
let loadingPromise = null;
let loaded = false;
let loadError = null;

function normalizeRoom(room) {
  return {
    id: room.id,
    name: room.room_name || room.name || "Standard Room",
    number: room.room_number || "",
    type: room.room_type || "Standard",
    price: Number(room.price_per_night ?? room.price ?? 0),
    capacity: Number(room.capacity ?? 2),
    available: Number(room.total_rooms ?? room.available ?? 0),
    description: room.description || "",
    image: room.image_url || room.image || FALLBACK_IMAGE,
    gallery: room.image_url ? [room.image_url] : [],
    status: room.status || "YES",
  };
}

function normalizeHotel(hotel) {
  const rooms = Array.isArray(hotel.rooms)
    ? hotel.rooms
        .filter((room) => room.status === "YES" || !room.status)
        .map(normalizeRoom)
    : [];

  const prices = rooms.map((room) => room.price).filter((price) => price > 0);

  const image =
    hotel.image_url || hotel.image || rooms[0]?.image || FALLBACK_IMAGE;

  return {
    id: hotel.id,
    name: hotel.hotel_name || hotel.name || "Unnamed Hotel",
    destination: hotel.city_name || hotel.destination || "Northern Pakistan",
    location: hotel.address || hotel.location || "",
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
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to load hotels.");
      }

      if (!Array.isArray(data.hotels)) {
        throw new Error("Invalid hotel API response.");
      }

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

  return () => {
    window.removeEventListener(EVENT, callback);
  };
}

export function useHotels() {
  const hotels = useSyncExternalStore(subscribe, getHotels, getHotels);

  // Initial API request; subsequent updates notify subscribers.
  // React renders with an empty list until data arrives.
  // Triggering this outside render avoids side effects during render.
  return hotels;
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

// Start loading when this module is imported in the browser.
if (typeof window !== "undefined") {
  fetchHotels().catch(() => {});
}
