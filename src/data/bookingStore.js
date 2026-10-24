import { useSyncExternalStore } from "react";
import { getHotels } from "./hotelStore";

const API_URL = "https://coreops.pk/Hotel/api/public_booking.php";
const EVENT = "northernstays:bookings-updated";

let bookingsCache = [];

function notify() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(EVENT));
  }
}

function subscribe(callback) {
  window.addEventListener(EVENT, callback);

  return () => {
    window.removeEventListener(EVENT, callback);
  };
}

export function getBookings() {
  return bookingsCache;
}

export function useBookings() {
  return useSyncExternalStore(subscribe, getBookings, getBookings);
}

function parseDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) {
    return null;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
    ? date
    : null;
}

export function nightsBetween(checkIn, checkOut) {
  const start = parseDate(checkIn);
  const end = parseDate(checkOut);

  return start && end ? Math.round((end - start) / 86400000) : 0;
}

// This returns room inventory, NOT live date-wise availability.
// Final availability must always be validated by the PHP API.
export function remainingRooms(hotelId, roomId, checkIn, checkOut) {
  const hotel = getHotels().find((h) => String(h.id) === String(hotelId));

  const room = hotel?.rooms?.find((r) => String(r.id) === String(roomId));

  if (
    !hotel ||
    hotel.status !== "Active" ||
    !room ||
    nightsBetween(checkIn, checkOut) <= 0
  ) {
    return 0;
  }

  return Math.max(0, Number(room.available || 0));
}

export async function createBooking(details) {
  const {
    hotelId,
    roomId,
    checkIn,
    checkOut,
    guests,
    guestName,
    email,
    phone,
  } = details;

  const roomCount = Number(details.roomCount ?? 1);
  const guestCount = Number(guests);

  const hotel = getHotels().find((h) => String(h.id) === String(hotelId));

  const room = hotel?.rooms?.find((r) => String(r.id) === String(roomId));

  if (
    !hotel ||
    hotel.status !== "Active" ||
    !room ||
    nightsBetween(checkIn, checkOut) < 1 ||
    !Number.isInteger(roomCount) ||
    roomCount < 1 ||
    !Number.isInteger(guestCount) ||
    guestCount < 1 ||
    guestCount > Number(room.capacity) * roomCount ||
    !String(guestName || "").trim() ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "")) ||
    !String(phone || "").trim()
  ) {
    throw new Error("Please enter valid guest and booking details.");
  }

  const payload = {
    room_id: Number(roomId),
    guest_name: String(guestName).trim(),
    guest_email: String(email).trim(),
    guest_phone: String(phone).trim(),
    check_in: checkIn,
    check_out: checkOut,
    guests: guestCount,
    room_count: roomCount,
  };

  let response;
  let data;

  try {
    response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    data = await response.json();
  } catch {
    throw new Error(
      "Unable to connect to the booking server. Please try again.",
    );
  }

  if (!response.ok || !data.success) {
    throw new Error(
      data.message || data.error || "Unable to complete your reservation.",
    );
  }

  const result = data.booking || data;

  const booking = {
    id: String(result.booking_reference || result.reference || result.id || ""),
    hotelId: hotel.id,
    roomId: room.id,
    hotelName: hotel.name,
    roomName: room.name,
    checkIn,
    checkOut,
    nights: nightsBetween(checkIn, checkOut),
    guests: guestCount,
    roomCount,
    guestName: String(guestName).trim(),
    email: String(email).trim(),
    phone: String(phone).trim(),
    nightlyPrice: Number(room.price),
    subtotal: Number(
      result.total_amount ??
        result.total ??
        Number(room.price) * nightsBetween(checkIn, checkOut) * roomCount,
    ),
    status: result.status || "Pending",
    createdAt: result.created_at || new Date().toISOString(),
  };

  if (!booking.id) {
    throw new Error("Booking response did not include a booking reference.");
  }

  bookingsCache = [booking, ...bookingsCache];
  notify();

  return booking;
}

// Booking statuses are managed through the authenticated Admin API.
export function updateBookingStatus() {
  throw new Error(
    "Booking status can only be updated through the Admin Panel.",
  );
}
