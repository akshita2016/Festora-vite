
import {
  CalendarDays,
  CalendarClock,
  ClipboardCheck,
  Heart
} from "lucide-react";

import "./CitizenDash.css";

function CitizenDash() {

  const stats = [
    {
      icon: CalendarDays,
      value: 4,
      label: "Total Events"
    },
    {
      icon: CalendarClock,
      value: 2,
      label: "Upcoming Events"
    },
    {
      icon: ClipboardCheck,
      value: 3,
      label: "Active Bookings"
    },
    {
      icon: Heart,
      value: 2,
      label: "Saved Businesses"
    }
  ];

  return (
    <div className="dashboard">

      {/* HERO SECTION */}
      <section className="dashboard-hero">

        <div className="hero-text">
          <h1>
            Let's make your next
            <span> celebration </span>
            unforgettable!
          </h1>

          <p>
            Plan events, discover trusted vendors and manage every
            booking in one place.
          </p>
        </div>

        <button className="hero-button">
          Explore Businesses
        </button>

      </section>

   
</div>

  );
}

export default CitizenDash;
