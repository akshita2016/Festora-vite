import {
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ReactElement,
  type ReactNode,
} from "react";
import "./LandingHome.css";

type IconProps = { size?: number };
type IconComponent = (props: IconProps) => ReactElement;

const makeIcon = (content: ReactNode): IconComponent => ({ size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {content}
  </svg>
);

const Flower2 = makeIcon(<><circle cx="12" cy="12" r="2" /><path d="M12 10C7 3 2 8 7 12c-5 4 0 9 5 2 5 7 10 2 5-2 5-4 0-9-5-2Z" /></>);
const Menu = makeIcon(<path d="M4 6h16M4 12h16M4 18h16" />);
const X = makeIcon(<path d="m6 6 12 12M18 6 6 18" />);
const ArrowRight = makeIcon(<path d="M5 12h14M13 6l6 6-6 6" />);
const Search = makeIcon(<><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>);
const Sparkles = makeIcon(<><path d="m12 3 1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3Z" /><path d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z" /></>);
const Users = makeIcon(<><circle cx="9" cy="8" r="3" /><path d="M3 20c0-3 2.5-5 6-5s6 2 6 5M16 5.5a3 3 0 0 1 0 5.8M18 15c2 .5 3 2 3 5" /></>);
const LayoutGrid = makeIcon(<><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>);
const CalendarHeart = makeIcon(<><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M16 2v4M8 2v4M3 9h18M12 17s-3-1.8-3-3.5a1.8 1.8 0 0 1 3-1.2 1.8 1.8 0 0 1 3 1.2C15 15.2 12 17 12 17Z" /></>);
const Handshake = makeIcon(<path d="m4 12 3-3 4 2 3-2 6 3-3 5-4-2-3 2-6-3 0-2Z" />);
const PartyPopper = makeIcon(<><path d="m4 20 5-11 6 6-11 5ZM9 9l2-2M16 7l1-3M20 11l2-1M15 13l3 2" /></>);
const Compass = makeIcon(<><circle cx="12" cy="12" r="9" /><path d="m15 9-2 4-4 2 2-4 4-2Z" /></>);
const Store = makeIcon(<><path d="M4 10v10h16V10M3 10l2-6h14l2 6M3 10c0 2 3 2 4 0 1 2 4 2 5 0 1 2 4 2 5 0 1 2 4 2 4 0M9 20v-5h6v5" /></>);
const Instagram = makeIcon(<><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".5" fill="currentColor" /></>);
const Facebook = makeIcon(<path d="M14 21v-8h3l.5-3H14V8c0-1 .4-2 2-2h1.5V3.2C17 3.1 16 3 15 3c-3 0-5 2-5 5v2H7v3h3v8" />);
const Mail = makeIcon(<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>);

/* ------------------------------------------------------------------ *
 * ROUTES - change these to match your App.tsx. This is the ONLY place
 * you need to edit if your paths differ.
 * ------------------------------------------------------------------ */
const ROUTES = {
  home: "/landing",
  explore: "/citizen/venues",
  login: "/login",
  signup: "/signup",
};
const CURRENT_YEAR = new Date().getFullYear();

/* ------------------------------------------------------------------ *
 * IMAGES - hosted event photography keeps the landing page visual
 * without requiring a separate image bundle in public/.
 * ------------------------------------------------------------------ */
const IMG = {
  hero: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=85",
  businessCta: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=85",
  weddings: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=85",
  birthdays: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=900&q=85",
  engagements: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=85",
  anniversaries: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=900&q=85",
  corporate: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=900&q=85",
  parties: "https://images.unsplash.com/photo-1496337589254-7e19d01cec44?auto=format&fit=crop&w=900&q=85",
};

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Explore Businesses", to: ROUTES.explore },
  { label: "How It Works", href: "#how-it-works" },
  { label: "About Us", href: "#about" },
];

const CATEGORIES = [
  { name: "Weddings", img: IMG.weddings },
  { name: "Birthdays", img: IMG.birthdays },
  { name: "Corporate Events", img: IMG.corporate },
  { name: "Private Parties", img: IMG.parties },
];

const AUDIENCE_CARDS = [
  {
    icon: Users,
    title: "For Customers",
    text: "Find trusted professionals and plan your event stress-free.",
  },
  {
    icon: Store,
    title: "For Vendors",
    text: "Showcase your services, reach new customers, and grow your business.",
  },
];

const PROFESSIONALS = [
  {
    name: "Bloom Arrangements",
    category: "Event Decorators",
    location: "Riverside, Punjab",
    price: "₹15,000",
    rating: "4.9",
    img: IMG.weddings,
  },
  {
    name: "Lens & Lights Studio",
    category: "Photography & Films",
    location: "Model Town, Punjab",
    price: "₹25,000",
    rating: "4.8",
    img: IMG.engagements,
  },
  {
    name: "Swaad Caterers",
    category: "Food & Catering",
    location: "City Centre, Punjab",
    price: "₹350 / plate",
    rating: "4.8",
    img: IMG.corporate,
  },
];

const STEPS = [
  {
    icon: PartyPopper,
    title: "Choose Your Event",
    text: "Select the occasion you are planning.",
  },
  {
    icon: Search,
    title: "Discover Services",
    text: "Find the services and professionals you need.",
  },
  {
    icon: Handshake,
    title: "Connect and Celebrate",
    text: "Explore businesses and connect with the right providers.",
  },
];

const FEATURES = [
  {
    icon: LayoutGrid,
    title: "Multiple Service Categories",
    text: "Decorators, caterers, photographers, venues and more, all in one place.",
  },
  {
    icon: Compass,
    title: "Easy Business Discovery",
    text: "Pick your event and city to see businesses relevant to your celebration.",
  },
  {
    icon: CalendarHeart,
    title: "Convenient Event Planning",
    text: "Choose the services you need and keep your planning in one flow.",
  },
  {
    icon: Users,
    title: "Connecting Clients and Businesses",
    text: "A shared space where hosts and event professionals find each other.",
  },
];

function Link({
  to,
  children,
  ...props
}: ComponentPropsWithoutRef<"a"> & { to: string }) {
  return (
    <a href={to} {...props}>
      {children}
    </a>
  );
}

/* Fade-in on scroll, no extra dependency */
function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      el.classList.add("is-visible");
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (node: T | null) => {
    ref.current = node;
  };
}

function Reveal({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section";
}) {
  const ref = useReveal<HTMLElement>();
  const classes = `reveal ${className}`;

  if (Tag === "section") {
    return (
      <section ref={ref} className={classes}>
        {children}
      </section>
    );
  }

  return (
    <div ref={ref} className={classes}>
      {children}
    </div>
  );
}

function Landing() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="fl-page" id="home">
      {/* ============ NAVBAR ============ */}
      <header className={`fl-nav ${scrolled ? "fl-nav--scrolled" : ""}`}>
        <div className="fl-container fl-nav__inner">
          <Link to={ROUTES.home} className="fl-brand" onClick={closeMenu}>
            <span className="fl-brand__mark">
              <Flower2 size={20} />
            </span>
            <span className="fl-brand__name">
              Fest<span>ora</span>
            </span>
          </Link>

          <nav
            className={`fl-nav__links ${menuOpen ? "is-open" : ""}`}
            aria-label="Primary"
          >
            {NAV_LINKS.map((l) =>
              l.to ? (
                <Link key={l.label} to={l.to} onClick={closeMenu}>
                  {l.label}
                </Link>
              ) : (
                <a key={l.label} href={l.href} onClick={closeMenu}>
                  {l.label}
                </a>
              )
            )}
            <div className="fl-nav__mobile-actions">
              <Link
                to={ROUTES.login}
                className="fl-btn fl-btn--ghost"
                onClick={closeMenu}
              >
                Login
              </Link>
              <Link
                to={ROUTES.signup}
                className="fl-btn fl-btn--primary"
                onClick={closeMenu}
              >
                Sign Up
              </Link>
            </div>
          </nav>

          <div className="fl-nav__actions">
            <Link to={ROUTES.login} className="fl-nav__login">
              Login
            </Link>
            <Link to={ROUTES.signup} className="fl-btn fl-btn--primary fl-btn--sm">
              Sign Up
            </Link>
          </div>

          <button
            type="button"
            className="fl-nav__toggle"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      <main>
        {/* ============ HERO ============ */}
        <section className="fl-hero">
          <div className="fl-hero__glow" aria-hidden="true" />
          <div className="fl-container fl-hero__inner">
            <div className="fl-hero__copy">
              <span className="fl-eyebrow">
                <Sparkles size={14} /> PLAN SOMETHING UNFORGETTABLE
              </span>
              <h1 className="fl-hero__title">
                Find your <em>perfect team</em>
                <br />
                for your next
                <br />
                celebration.
              </h1>
              <p className="fl-hero__text">
                Discover trusted event professionals and everything you need to
                create celebrations that feel truly yours.
              </p>
              <div className="fl-hero__buttons">
                <Link to={ROUTES.explore} className="fl-btn fl-btn--primary fl-btn--lg">
                  Explore Businesses <ArrowRight size={18} />
                </Link>
                <Link to={ROUTES.signup} className="fl-btn fl-btn--outline fl-btn--lg">
                  Join as a Vendor
                </Link>
              </div>
              <div className="fl-audience">
                {AUDIENCE_CARDS.map((card) => (
                  <div className="fl-audience__card" key={card.title}>
                    <span className="fl-audience__icon"><card.icon size={16} /></span>
                    <div>
                      <strong>{card.title}</strong>
                      <p>{card.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="fl-hero__visual">
              <div
                className="fl-hero__photo"
                style={{ backgroundImage: `url(${IMG.hero})` }}
                role="img"
                aria-label="An elegantly decorated celebration table with flowers"
              />
              <div className="fl-float fl-float--a">
                <span className="fl-float__icon">
                  <Users size={16} />
                </span>
                Find your perfect event team
              </div>
              <div className="fl-float fl-float--b">
                <span className="fl-float__icon">
                  <Handshake size={16} />
                </span>
                Trusted event professionals
              </div>
              <div className="fl-float fl-float--c">
                <span className="fl-float__icon">
                  <PartyPopper size={16} />
                </span>
                Everything for your celebration
              </div>
              <span className="fl-dot fl-dot--1" aria-hidden="true" />
              <span className="fl-dot fl-dot--2" aria-hidden="true" />
            </div>
          </div>
        </section>

        {/* ============ CATEGORIES ============ */}
        <section className="fl-section" id="categories">
          <div className="fl-container">
            <Reveal className="fl-heading">
              <h2>
                Everything You Need <em>to Celebrate.</em>
              </h2>
              <p>Find trusted professionals for every special moment.</p>
            </Reveal>

            <Reveal className="fl-cats">
              {CATEGORIES.map((c) => (
                <Link key={c.name} to={ROUTES.explore} className="fl-cat">
                  <div
                    className="fl-cat__img"
                    style={{ backgroundImage: `url(${c.img})` }}
                  />
                  <div className="fl-cat__overlay" />
                  <div className="fl-cat__label">
                    <span>{c.name}</span>
                    <span className="fl-cat__arrow">
                      <ArrowRight size={16} />
                    </span>
                  </div>
                </Link>
              ))}
            </Reveal>

            <div className="fl-professionals-heading">
              <h3>Popular professionals near you</h3>
              <Link to={ROUTES.explore} className="fl-link">
                View all businesses <ArrowRight size={14} />
              </Link>
            </div>

            <Reveal className="fl-professionals">
              {PROFESSIONALS.map((professional) => (
                <Link
                  key={professional.name}
                  to={ROUTES.explore}
                  className="fl-professional"
                >
                  <div
                    className="fl-professional__img"
                    style={{ backgroundImage: `url(${professional.img})` }}
                  >
                    <span className="fl-professional__rating">★ {professional.rating}</span>
                  </div>
                  <div className="fl-professional__body">
                    <h4>{professional.name}</h4>
                    <p>{professional.category}</p>
                    <span className="fl-professional__location">
                      <Compass size={13} /> {professional.location}
                    </span>
                    <div className="fl-professional__footer">
                      <span>Starting from <strong>{professional.price}</strong></span>
                      <span className="fl-professional__view">View profile</span>
                    </div>
                  </div>
                </Link>
              ))}
            </Reveal>
          </div>
        </section>

        {/* ============ HOW IT WORKS ============ */}
        <section className="fl-section fl-section--blush" id="how-it-works">
          <div className="fl-container">
            <Reveal className="fl-heading">
              <h2>
                How <em>Festora works.</em>
              </h2>
              <p>Everything you need to plan a memorable celebration.</p>
            </Reveal>

            <Reveal className="fl-steps">
              {STEPS.map((s, i) => (
                <div className="fl-step" key={s.title}>
                  <div className="fl-step__badge">
                    <s.icon size={26} />
                    <span className="fl-step__num">{i + 1}</span>
                  </div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        {/* ============ WHY FESTORA ============ */}
        <section className="fl-section" id="about">
          <div className="fl-container fl-why">
            <Reveal className="fl-why__intro">
              <span className="fl-eyebrow">Why Festora</span>
              <h2>
                Everything You Need, <em>All in One Place.</em>
              </h2>
              <p>
                Festora brings people planning events and the businesses that
                serve them onto one platform, so finding the right help takes
                less effort.
              </p>
              <Link to={ROUTES.explore} className="fl-link">
                Start discovering <ArrowRight size={16} />
              </Link>
            </Reveal>

            <Reveal className="fl-why__grid">
              {FEATURES.map((f) => (
                <article className="fl-feature" key={f.title}>
                  <span className="fl-feature__icon">
                    <f.icon size={22} />
                  </span>
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                </article>
              ))}
            </Reveal>
          </div>
        </section>

        {/* ============ BUSINESS CTA ============ */}
        <section className="fl-section fl-section--tight">
          <div className="fl-container">
            <Reveal className="fl-biz">
              <div className="fl-biz__copy">
                <span className="fl-eyebrow fl-eyebrow--light">
                  <Store size={14} /> For businesses
                </span>
                <h2>
                  Have an Event Business? <em>Let's Grow Together.</em>
                </h2>
                <p>
                  Showcase your services, connect with people planning events,
                  and grow your business with Festora.
                </p>
                <Link to={ROUTES.signup} className="fl-btn fl-btn--white fl-btn--lg">
                  Join Festora as a Business <ArrowRight size={18} />
                </Link>
              </div>
              <div
                className="fl-biz__photo"
                style={{ backgroundImage: `url(${IMG.businessCta})` }}
                role="img"
                aria-label="A beautifully styled event setup"
              />
              <span className="fl-biz__ring" aria-hidden="true" />
            </Reveal>
          </div>
        </section>

        {/* ============ FINAL CTA ============ */}
        <section className="fl-final">
          <Reveal className="fl-container fl-final__inner">
            <h2>
              Your Next Celebration <em>Starts Here.</em>
            </h2>
            <Link to={ROUTES.explore} className="fl-btn fl-btn--primary fl-btn--lg">
              Start Exploring <ArrowRight size={18} />
            </Link>
          </Reveal>
        </section>
      </main>

      {/* ============ FOOTER ============ */}
      <footer className="fl-footer">
        <div className="fl-container fl-footer__grid">
          <div className="fl-footer__brand">
            <Link to={ROUTES.home} className="fl-brand">
              <span className="fl-brand__mark">
                <Flower2 size={20} />
              </span>
              <span className="fl-brand__name">
                Fest<span>ora</span>
              </span>
            </Link>
            <p>
              Festora connects people planning events with businesses that
              provide event-related services.
            </p>
          </div>

          <div>
            <h4>Explore</h4>
            <ul>
              <li>
                <Link to={ROUTES.explore}>Explore Businesses</Link>
              </li>
              <li>
                <a href="#how-it-works">How It Works</a>
              </li>
              <li>
                <a href="#about">About Us</a>
              </li>
            </ul>
          </div>

          <div>
            <h4>For Businesses</h4>
            <ul>
              <li>
                <Link to={ROUTES.signup}>Register your business</Link>
              </li>
            </ul>
            <h4 className="fl-footer__sub">Account</h4>
            <ul>
              <li>
                <Link to={ROUTES.login}>Login</Link>
              </li>
              <li>
                <Link to={ROUTES.signup}>Sign Up</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4>Contact</h4>
            {/* Placeholders only - replace when you have real details */}
            <ul className="fl-footer__social">
              <li>
                <span>
                  <Mail size={16} /> Email (coming soon)
                </span>
              </li>
              <li>
                <span>
                  <Instagram size={16} /> Instagram (coming soon)
                </span>
              </li>
              <li>
                <span>
                  <Facebook size={16} /> Facebook (coming soon)
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="fl-container fl-footer__bottom">
          &copy; {CURRENT_YEAR} Festora. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default Landing;