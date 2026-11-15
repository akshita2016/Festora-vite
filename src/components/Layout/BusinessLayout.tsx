
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import "./CitizenLayout.css";

import {
  LayoutGrid,
  CalendarDays,
  Store,
  ClipboardList,
  Heart,
  MessageSquare,
  Settings,
  LogOut,
  Search,
  Bell,
  ChevronDown,
} from "lucide-react";

function BusinessLayout() {
  const navigate = useNavigate();
  const location = useLocation();

 const navItems = [
  { path: "/business/dashboard", icon: LayoutGrid, label: "Overview" },
  // { path: "/business/venues", icon: Store, label: "Explore Businesses" },
  
  { path: "/business/settings", icon: Settings, label: "Profile Settings" },
];

  return (
    <div className="citizen-layout">

      {/* SIDEBAR */}
    
<aside className="cd-sidebar">

  {/* LOGO */}
  <div className="cd-logo">

    <div className="cd-logo-mark">
      <LayoutGrid size={21} />
    </div>

   <span className="cd-logo-text">Fest<em>ora</em></span>

  </div>

  {/* NAVIGATION */}
  <nav className="cd-nav">

    {navItems.map((item) => {

      const Icon = item.icon;

      const active = location.pathname === item.path;

      let navClass = "cd-nav-item";

      if (active) {
        navClass = "cd-nav-item is-active";
      }

      return (
        <button
          key={item.path}
         className={`cd-nav-item ${active ? "is-active" : ""}`}
          onClick={() => navigate(item.path)}
        >
         <Icon size={19} strokeWidth={active ? 2.5 : 2} />
         <span>
  {item.label}
</span>
        </button>
      );

    })}

  </nav>

  {/* LOGOUT */}
  <button
    className="cd-nav-item cd-nav-logout"
    onClick={() => navigate("/login")}
  >
    <LogOut size={19} />
    <span>Logout</span>
  </button>

</aside>


      {/* MAIN CONTENT */}
      <main className="citizen-main">

        {/* TOPBAR */}
        <header className="citizen-topbar">

          <div className="topbar-welcome">
            <span>Welcome back,</span>
            <strong>Akshita</strong>
          </div>

          <div className="topbar-actions">

            <div className="topbar-search">
              <Search size={19} />
              <input
                type="text"
                placeholder="Search vendors, services or locations..."
              />
            </div>

            <button className="notification-button">
              <Bell size={19} />
            </button>

            <div className="topbar-profile">
              <div className="profile-avatar">A</div>
              <ChevronDown size={16} />
            </div>

          </div>
        </header>

        {/* PAGE CONTENT */}
     
 
  <Outlet />

      </main>
    </div>
  );
}

export default BusinessLayout;
