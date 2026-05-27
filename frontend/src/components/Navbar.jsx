import { NavLink } from "react-router-dom";
import {
  Ambulance as AmbulanceIcon,
  Building2,
  CalendarDays,
  Droplet,
  Hospital,
  Info,
  Microscope,
  Pill,
  Video,
} from "lucide-react";

const navFixStyles = `
.nav {
  position: sticky;
  top: 0;
  z-index: 100;
  overflow-x: auto;
  overflow-y: hidden;
  background: rgba(255, 255, 255, 0.86) !important;
  backdrop-filter: blur(18px);
  border-bottom: 1px solid rgba(219, 234, 254, 0.9);
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.06);
  scrollbar-width: none;
}

.nav::-webkit-scrollbar {
  display: none;
}

.nav-container,
.dashboard-nav-fix {
  width: 100%;
  max-width: 1720px;
  min-height: 74px;
  margin: 0 auto;
  padding: 0 clamp(76px, 7vw, 140px) !important;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(10px, 1.15vw, 18px);
  flex-wrap: nowrap;
}

.nav-item {
  position: relative;
  flex: 0 0 auto;
  min-height: 46px;
  padding: 0 15px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  white-space: nowrap;
  color: #475569 !important;
  text-decoration: none !important;
  font-weight: 900;
  letter-spacing: 0.01em;
  border: 1px solid transparent !important;
  background: transparent;
  transition:
    transform 0.2s ease,
    background 0.2s ease,
    color 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.nav-item svg {
  width: 18px;
  height: 18px;
  stroke-width: 2.4;
  transition: transform 0.2s ease;
}

.nav-item:hover {
  transform: translateY(-2px);
  color: #2563eb !important;
  background: #eff6ff;
  border-color: #dbeafe !important;
  box-shadow: 0 12px 26px rgba(37, 99, 235, 0.12);
}

.nav-item:hover svg {
  transform: scale(1.08);
}

.nav-item.active {
  color: #ffffff !important;
  background: linear-gradient(135deg, #2563eb, #14b8a6) !important;
  border-color: transparent !important;
  box-shadow: 0 16px 34px rgba(37, 99, 235, 0.26);
}

.nav-item.active::after {
  content: "";
  position: absolute;
  left: 22%;
  right: 22%;
  bottom: -13px;
  height: 4px;
  border-radius: 999px;
  background: linear-gradient(90deg, #2563eb, #14b8a6);
}

.nav-item.active svg {
  color: white;
}

@media (max-width: 1320px) {
  .nav-container,
  .dashboard-nav-fix {
    justify-content: flex-start;
    padding: 0 26px !important;
    gap: 10px;
  }

  .nav-item {
    padding: 0 13px;
  }
}

@media (max-width: 760px) {
  .nav-container,
  .dashboard-nav-fix {
    min-height: 68px;
    padding: 0 16px !important;
  }

  .nav-item {
    min-height: 42px;
    padding: 0 12px;
    font-size: 0.9rem;
  }
}
`;

const navItems = [
  {
    label: "Hospitals",
    path: "/hospitals",
    icon: Hospital,
  },
  {
    label: "Diagnostic Centers",
    path: "/diagnostic-centers",
    icon: Microscope,
  },
  {
    label: "Blood Banks",
    path: "/blood-banks",
    icon: Droplet,
  },
  {
    label: "Pharmacies",
    path: "/pharmacies",
    icon: Pill,
  },
  {
    label: "Ambulance",
    path: "/ambulance",
    icon: AmbulanceIcon,
  },
  {
    label: "Telemedicine",
    path: "/telemedicine",
    icon: Video,
  },
  {
    label: "Drug Interactions",
    path: "/drug-interactions",
    icon: Info,
  },
  {
    label: "Appointments",
    path: "/appointments",
    icon: CalendarDays,
  },
];

export default function Navbar() {
  return (
    <nav className="nav">
      <div className="container nav-container">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}