import { Link, useParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { useBookings } from "../../data/bookingStore";
import { formatPKR } from "../../data/hotels";
import "../../styles/booking.css";

export default function BookingSuccess() {
  const { id } = useParams();
  const booking = useBookings().find((b) => b.id === id);
  if (!booking)
    return (
      <main className="container ns-booking-success">
        <h1>Booking not found</h1>
        <p>
          This demo booking may belong to another browser or may have been
          cleared.
        </p>
        <Link to="/hotels" className="details-button">
          Explore Hotels
        </Link>
      </main>
    );
  return (
    <main className="container ns-booking-success">
      <CheckCircle2 size={54} color="#237b55" />
      <h1>Demo Reservation Submitted</h1>
      <p>
        Your request is saved in this browser with{" "}
        <strong>{booking.status}</strong> status. It is not a confirmed hotel
        reservation.
      </p>
      <div className="ns-confirm-details">
        <div>
          <span>Booking Reference</span>
          <strong>{booking.id}</strong>
        </div>
        <div>
          <span>Hotel</span>
          <strong>{booking.hotelName}</strong>
        </div>
        <div>
          <span>Room</span>
          <strong>{booking.roomName}</strong>
        </div>
        <div>
          <span>Rooms booked</span>
          <strong>{booking.roomCount || 1}</strong>
        </div>
        <div>
          <span>Guest</span>
          <strong>{booking.guestName}</strong>
        </div>
        <div>
          <span>Dates</span>
          <strong>
            {booking.checkIn} → {booking.checkOut}
          </strong>
        </div>
        <div>
          <span>Nights</span>
          <strong>{booking.nights}</strong>
        </div>
        <div>
          <span>Estimated subtotal</span>
          <strong>{formatPKR(booking.subtotal)}</strong>
        </div>
        <div>
          <span>Status</span>
          <strong>{booking.status}</strong>
        </div>
      </div>
      <p>
        No email or payment was sent. Admin can view this request in the same
        browser.
      </p>
      <Link to="/hotels" className="details-button">
        Explore More Hotels
      </Link>
    </main>
  );
}
