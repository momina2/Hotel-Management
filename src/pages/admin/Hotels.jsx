import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  MapPin,
  Star,
  Search,
  SlidersHorizontal,
  BedDouble,
  Users,
  ArrowRight,
  CalendarDays,
} from "lucide-react";

import { useActiveHotels } from "../../data/hotelStore";
import {
  useBookings,
  remainingRooms,
  nightsBetween,
} from "../../data/bookingStore";
import { formatPKR } from "../../data/hotels";

import "../../styles/hotels.css";

const getToday = () => {
  const d = new Date();
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-");
};

export default function Hotels() {
  const hotels = useActiveHotels();

  // Re-render when demo bookings change.
  useBookings();

  const [params, setParams] = useSearchParams();
  const [keyword, setKeyword] = useState("");
  const [maxPrice, setMaxPrice] = useState(100000);
  const [sortBy, setSortBy] = useState("recommended");

  const city = params.get("destination") || "";
  const checkIn = params.get("checkIn") || "";
  const checkOut = params.get("checkOut") || "";

  // Supports both old and new search parameter names.
  const roomCount = Number(params.get("rooms") ?? params.get("roomCount") ?? 1);

  const guests = Number(params.get("guests") || 2);
  const nights = nightsBetween(checkIn, checkOut);

  const datesValid =
    Boolean(checkIn && checkOut) && checkIn >= getToday() && nights > 0;

  const searchValid =
    datesValid &&
    Number.isInteger(roomCount) &&
    roomCount >= 1 &&
    Number.isInteger(guests) &&
    guests >= 1;

  const cities = [
    ...new Set([
      ...hotels.map((hotel) => hotel.destination),
      "Hunza",
      "Skardu",
      "Naran",
      "Swat",
      "Murree",
      "Gilgit",
    ]),
  ].filter(Boolean);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(params);

    if (value !== "") {
      next.set(key, String(value));
    } else {
      next.delete(key);
    }

    if (key === "rooms") {
      next.delete("roomCount");
    }

    if (
      key === "checkIn" &&
      next.get("checkOut") &&
      next.get("checkOut") <= value
    ) {
      next.delete("checkOut");
    }

    setParams(next);
  };

  const allRooms = hotels.flatMap((hotel) =>
    (hotel.rooms || []).map((room) => ({
      hotel,
      room,
      available: datesValid
        ? remainingRooms(hotel.id, room.id, checkIn, checkOut)
        : 0,
    })),
  );

  const results = searchValid
    ? allRooms
        .filter(({ hotel, room, available }) => {
          const cityMatch =
            !city || hotel.destination?.toLowerCase() === city.toLowerCase();

          const text = [
            hotel.name,
            hotel.location,
            hotel.destination,
            room.name,
          ]
            .join(" ")
            .toLowerCase();

          const keywordMatch = text.includes(keyword.trim().toLowerCase());

          const priceMatch =
            Number(room.price) > 0 && Number(room.price) <= maxPrice;

          const capacityMatch = Number(room.capacity) * roomCount >= guests;

          const inventoryMatch = available >= roomCount;

          return (
            cityMatch &&
            keywordMatch &&
            priceMatch &&
            capacityMatch &&
            inventoryMatch
          );
        })
        .sort((a, b) => {
          if (sortBy === "price-low") {
            return Number(a.room.price) - Number(b.room.price);
          }

          if (sortBy === "price-high") {
            return Number(b.room.price) - Number(a.room.price);
          }

          if (sortBy === "rating") {
            return Number(b.hotel.rating || 0) - Number(a.hotel.rating || 0);
          }

          return 0;
        })
    : [];

  const resetFilters = () => {
    setParams({});
    setKeyword("");
    setMaxPrice(100000);
    setSortBy("recommended");
  };

  return (
    <main className="hotels-page">
      <section className="listing-banner">
        <div className="container">
          <span className="section-label">NORTHERNSTAYS ROOM MARKETPLACE</span>
          <h1>Find Available Rooms</h1>
          <p>Search by city, travel dates, number of rooms and guests.</p>
        </div>
      </section>

      <div className="container listing-layout">
        {/* FILTER SIDEBAR */}
        <aside className="filters-panel">
          <div className="filters-title">
            <SlidersHorizontal size={20} />
            <h3>Search & Filters</h3>
          </div>

          <label>Search Room or Hotel</label>
          <div className="filter-input">
            <Search size={17} />
            <input
              type="text"
              placeholder="Deluxe, family, mountain..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>

          <label>
            <MapPin size={15} /> City
          </label>
          <select
            value={city}
            onChange={(e) => updateParam("destination", e.target.value)}
          >
            <option value="">All Cities</option>
            {cities.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <label>
            <CalendarDays size={15} /> Check-in
          </label>
          <input
            type="date"
            min={getToday()}
            value={checkIn}
            onChange={(e) => updateParam("checkIn", e.target.value)}
          />

          <label>
            <CalendarDays size={15} /> Check-out
          </label>
          <input
            type="date"
            min={checkIn || getToday()}
            value={checkOut}
            onChange={(e) => updateParam("checkOut", e.target.value)}
          />

          <label>
            <BedDouble size={15} /> Number of Rooms
          </label>
          <select
            value={roomCount}
            onChange={(e) => updateParam("rooms", e.target.value)}
          >
            {Array.from({ length: 10 }, (_, index) => index + 1).map(
              (count) => (
                <option key={count} value={count}>
                  {count} {count === 1 ? "Room" : "Rooms"}
                </option>
              ),
            )}
          </select>

          <label>
            <Users size={15} /> Total Guests
          </label>
          <select
            value={guests}
            onChange={(e) => updateParam("guests", e.target.value)}
          >
            {Array.from({ length: 30 }, (_, index) => index + 1).map(
              (count) => (
                <option key={count} value={count}>
                  {count} {count === 1 ? "Guest" : "Guests"}
                </option>
              ),
            )}
          </select>

          <label>Maximum Price / Room / Night</label>
          <input
            type="range"
            min="1000"
            max="100000"
            step="1000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />

          <strong className="price-value">{formatPKR(maxPrice)}</strong>

          <button
            type="button"
            className="reset-filters"
            onClick={resetFilters}
          >
            Reset Filters
          </button>
        </aside>

        {/* ROOM RESULTS */}
        <section className="hotel-results">
          <div className="results-header">
            <div>
              <h2>{city || "All Cities"} — Available Rooms</h2>
              <p>
                {searchValid
                  ? `${results.length} matching room types · ${roomCount} rooms · ${guests} guests · ${nights} nights`
                  : "Select valid check-in and check-out dates to see available rooms."}
              </p>
            </div>

            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="recommended">Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          <div className="hotel-cards">
            {results.map(({ hotel, room, available }) => {
              const photo = room.image || room.gallery?.[0] || hotel.image;

              const total = Number(room.price) * roomCount * nights;

              const bookingParams = new URLSearchParams({
                destination: hotel.destination,
                checkIn,
                checkOut,
                rooms: String(roomCount),
                guests: String(guests),
                roomId: String(room.id),
              });

              return (
                <article
                  className="hotel-list-card"
                  key={`${hotel.id}-${room.id}`}
                >
                  <img src={photo} alt={room.name} loading="lazy" />

                  <div className="hotel-card-body">
                    <span className="hotel-type">
                      {hotel.destination} · {hotel.type}
                    </span>

                    <h3>{room.name}</h3>

                    <p className="hotel-location">
                      <MapPin size={15} />
                      {hotel.name} · {hotel.location}
                    </p>

                    <div className="hotel-rating">
                      <Star size={16} fill="currentColor" />
                      <strong>{hotel.rating || "New"}</strong>
                      <span>({hotel.reviews || 0} reviews)</span>
                    </div>

                    <div className="hotel-amenities">
                      <span>
                        <Users size={15} />
                        Up to {room.capacity} guests / room
                      </span>

                      <span>
                        <BedDouble size={15} />
                        {available} rooms available
                      </span>
                    </div>

                    <div className="hotel-card-bottom">
                      <div>
                        <small>Per room / night</small>
                        <strong>{formatPKR(Number(room.price))}</strong>
                        <small>
                          {roomCount} rooms × {nights} nights
                        </small>
                        <strong>Total: {formatPKR(total)}</strong>
                      </div>

                      <Link
                        className="details-button"
                        to={`/hotels/${hotel.id}?${bookingParams.toString()}`}
                      >
                        View Room
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {!searchValid && (
            <div className="empty-results">
              <h3>Choose Your Travel Dates</h3>
              <p>
                Enter check-in, check-out, rooms and guests to search available
                room types.
              </p>
            </div>
          )}

          {searchValid && results.length === 0 && (
            <div className="empty-results">
              <h3>No Matching Rooms Found</h3>
              <p>
                Try another city, different dates, fewer rooms or a higher price
                range.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
