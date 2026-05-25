"use client";

import { useState, useEffect, useRef } from "react";

// Types for portfolio & blog items
interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  image: string;
  client: string;
  date: string;
  description: string;
  longDescription: string;
  techStack: string;
  liveUrl: string;
  tools: string[];
}

// Helper to return beautiful, clean, responsive inline SVGs for major tools
const getTechIcon = (tool: string) => {
  switch (tool.toLowerCase()) {
    case "react":
      return (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
          <circle cx="12" cy="12" r="2" />
          <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(30 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(90 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(150 12 12)" />
        </svg>
      );
    case "typescript":
      return (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <path d="M7 8h5M9.5 8v8M16 8h-4.5v8M11.5 12h3" />
        </svg>
      );
    case "mysql":
      return (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M3 5v6c0 1.66 4 3 9 3s9-1.34 9-3V5M3 11v6c0 1.66 4 3 9 3s9-1.34 9-3v-6" />
        </svg>
      );
    case "prisma":
      return (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
          <path d="M12 3L2 19h20L12 3z" />
          <path d="M12 3v16" />
          <path d="M2 19l10-6 10 6" />
        </svg>
      );
    default:
      return null;
  }
};

// Menu item label mapping
const menuLabels: Record<string, string> = {
  home: "Home",
  about: "About",
  skills: "Skills",
  timeline: "Experience",
  portfolio: "Portfolio",
  contact: "Contact"
};

export default function Home() {
  // 1. STATE VARIABLES
  const [preloaderLoaded, setPreloaderLoaded] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentSection, setCurrentSection] = useState("home");
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [activeService, setActiveService] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Contact form state
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [formError, setFormError] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  // Custom cursor state
  const [cursorX, setCursorX] = useState(-100);
  const [cursorY, setCursorY] = useState(-100);
  const [cursorHover, setCursorHover] = useState(false);
  const [cursorOuterX, setCursorOuterX] = useState(-100);
  const [cursorOuterY, setCursorOuterY] = useState(-100);



  // High-fidelity Glitch refs
  const glitchLayer1Ref = useRef<HTMLDivElement>(null);
  const glitchLayer2Ref = useRef<HTMLDivElement>(null);
  const glitchLayer3Ref = useRef<HTMLDivElement>(null);

  // 2. DATA ARRAYS
  // Services
  const services = [
    {
      title: "Enterprise Web Apps",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 32, height: 32 }}><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
      ),
      description: "Engineering powerful, high-performance web applications using modern stacks like React, Next.js, Laravel, and CakePHP, tailored for seamless business scalability."
    },
    {
      title: "Custom E-Commerce & CMS",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 32, height: 32 }}><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="2" y1="20" x2="22" y2="20"></line><line x1="12" y1="17" x2="12" y2="20"></line></svg>
      ),
      description: "Building bespoke, high-converting digital storefronts and robust WordPress ecosystems equipped with custom theme integrations and secure payment architectures."
    },
    {
      title: "Database Design & DevOps",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 32, height: 32 }}><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"></path></svg>
      ),
      description: "Designing ultra-secure, highly optimized database layers using MySQL and MongoDB, combined with clean Git workflows and automated VPS cloud deployments."
    }
  ];

  // Portfolio items
  const portfolioItems: PortfolioItem[] = [
    {
      id: "p1",
      title: "VPS Rocket",
      category: "detail",
      image: "img/vpsrocket.png",
      client: "VPS Rocket LLC",
      date: "Mar 15, 2026",
      techStack: "React, TypeScript, MySQL",
      liveUrl: "https://vpsrocket.net",
      tools: ["react", "typescript", "mysql"],
      description: "Web Hosting Company",
      longDescription: "VPS Rocket is a comprehensive, client-centric web hosting portal designed for modern web professionals. Built using a high-performance React frontend, robust TypeScript logic, and backed by high-capacity MySQL datastores, the platform handles instant cloud VPS deployments, real-time bandwidth consumption analytics, and secure billing layers. The interface features fully interactive sliders to customize server resources on the fly."
    },
    {
      id: "p2",
      title: "Sav Technologies",
      category: "detail",
      image: "img/sav.png",
      client: "Sav Technologies",
      date: "Jan 28, 2026",
      techStack: "React, TypeScript, MySQL",
      liveUrl: "https://sav.com.bd",
      tools: ["react", "typescript", "mysql"],
      description: "Tech Company",
      longDescription: "Sav Technologies is a top-tier digital product agency website built with modular React components, typed with strict TypeScript contracts, and powered by secure backend database pipelines. It delivers visual storytelling through dynamic page interactions, showcase grids of completed enterprise integrations, and detailed contact captures. The platform acts as a lead generation hub featuring premium aesthetics, fluid layouts, and complete responsiveness."
    },
    {
      id: "p3",
      title: "Al Baraka Group",
      category: "detail",
      image: "img/al-baraka.png",
      client: "Al Baraka Group",
      date: "Feb 10, 2026",
      techStack: "React, TypeScript, MySQL",
      liveUrl: "https://albarakagroupom.com",
      tools: ["react", "typescript", "mysql"],
      description: "Company Portfolio",
      longDescription: "Al Baraka Group is an enterprise-grade corporate platform designed to convey prestige, multi-sector presence, and investment growth. It aggregates details of construction portfolios, investment operations, and global trade volumes. The frontend is powered by React and styled to perfection, utilizing TypeScript for modular code robustness and MySQL for managing structured asset catalogs and dynamic global updates."
    },
    {
      id: "p4",
      title: "Royal Plaza Hotel",
      category: "detail",
      image: "img/royalplaza.png",
      client: "Royal Plaza Hotel",
      date: "May 20, 2026",
      techStack: "React, TypeScript, MySQL, Prisma",
      liveUrl: "https://royalplazahotel.com",
      tools: ["react", "typescript", "mysql", "prisma"],
      description: "3star hotel",
      longDescription: "Royal Plaza Hotel is an ultra-modern booking and hospitality management web application engineered for a premium 3-star luxury resort. Leveraging React for dynamic client-side scheduling and real-time room availability, TypeScript for type-safe business logic, and MySQL managed through Prisma ORM for highly structured, ultra-fast guest registration and payment processing databases. The platform delivers an exceptional reservation experience with fluid animations and responsive layout design."
    }
  ];

  // Testimonials
  const testimonials = [
    {
      quote: "Imam Hasan delivered an exceptional web application for our enterprise. His attention to pixel-perfect styling, clean code interfaces, and database optimization exceeded all our expectations.",
      author: "Alisa Barker",
      job: "Product Lead, TechCorp",
      avatar: "img/avatar_alisa.png"
    },
    {
      quote: "Working with Imam Hasan was a game-changer for our cloud deployment. He engineered our custom VPS integration flawlessly, creating a highly scalable platform that processes millions of operations daily.",
      author: "Colin Robinson",
      job: "CTO, Sav Technologies",
      avatar: "img/avatar_colin.png"
    },
    {
      quote: "Imam Hasan possesses a rare combination of visual mastery and backend robust engineering. He developed our custom Laravel infrastructure with absolute speed and professionalism. Highly recommended!",
      author: "David Silva",
      job: "Founder, Al Baraka Group",
      avatar: "img/avatar_david.png"
    }
  ];


  // 3. EFFECTS & LISTENERS
  useEffect(() => {
    // A. Preloader delay
    const loaderTimer = setTimeout(() => {
      setPreloaderLoaded(true);
    }, 700);

    // B. Scroll listeners (Sticky Header & Scroll Spy)
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      
      // Toggle sticky header classes
      if (scrollPos > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Scroll Spy active sections
      const sections = ["home", "about", "skills", "timeline", "portfolio", "contact"];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const offsetTop = el.offsetTop - 120;
          const offsetHeight = el.offsetHeight;
          if (scrollPos >= offsetTop && scrollPos < offsetTop + offsetHeight) {
            setCurrentSection(section);
          }
        }
      }
    };

    // C. Magic Cursor Tracking
    const handleMouseMove = (e: MouseEvent) => {
      setCursorX(e.clientX);
      setCursorY(e.clientY);
    };

    // D. Window resize tracking for isMobile state
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(loaderTimer);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Soft trailing inertia effect for the outer cursor circle
  useEffect(() => {
    let animId: number;
    
    const updateCursorOuter = () => {
      // Lerp custom cursor coordinates
      setCursorOuterX(prev => prev + (cursorX - prev) * 0.15);
      setCursorOuterY(prev => prev + (cursorY - prev) * 0.15);
      
      animId = requestAnimationFrame(updateCursorOuter);
    };

    animId = requestAnimationFrame(updateCursorOuter);
    return () => cancelAnimationFrame(animId);
  }, [cursorX, cursorY]);

  // High-fidelity Glitch Engine Timer Hook (mgGlitch.js React Port)
  useEffect(() => {
    let active = true;

    // Layer 1 Loop (Slow-jitter: 600ms - 1000ms)
    const runLayer1 = () => {
      if (!active) return;
      const el = glitchLayer1Ref.current;
      if (el) {
        const height = Math.random() * 20 + 5; // 5% to 25% height slice
        const top = Math.random() * (100 - height);
        const x = Math.floor(Math.random() * 20) - 10; // -10px to +10px
        const y = Math.floor(Math.random() * 6) - 3;   // -3px to +3px
        
        el.style.clipPath = `inset(${top}% 0% ${100 - (top + height)}% 0%)`;
        el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        el.style.opacity = "1";

        setTimeout(() => {
          if (active && el) {
            el.style.opacity = "0";
            el.style.transform = "none";
            el.style.clipPath = "none";
          }
        }, 70);
      }

      const nextTime = Math.random() * 400 + 600;
      setTimeout(runLayer1, nextTime);
    };

    // Layer 2 Loop (Fast-jitter with scaling: 40ms - 200ms)
    const runLayer2 = () => {
      if (!active) return;
      const el = glitchLayer2Ref.current;
      if (el) {
        const height = Math.random() * 25 + 5; // 5% to 30% height slice
        const top = Math.random() * (100 - height);
        const x = Math.floor(Math.random() * 30) - 15; // -15px to +15px
        const y = Math.floor(Math.random() * 10) - 5;  // -5px to +5px
        const scale = 1.02 + Math.random() * 0.05;

        el.style.clipPath = `inset(${top}% 0% ${100 - (top + height)}% 0%)`;
        el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
        el.style.opacity = "1";

        setTimeout(() => {
          if (active && el) {
            el.style.opacity = "0";
            el.style.transform = "none";
            el.style.clipPath = "none";
          }
        }, 40);
      }

      const nextTime = Math.random() * 160 + 40;
      setTimeout(runLayer2, nextTime);
    };

    // Layer 3 Loop (Stark monochromatic blend strobe: 30ms - 150ms)
    const runLayer3 = () => {
      if (!active) return;
      const el = glitchLayer3Ref.current;
      if (el) {
        if (Math.random() < 0.4) {
          const height = Math.random() * 30 + 5;
          const top = Math.random() * (100 - height);
          const x = Math.floor(Math.random() * 40) - 20; // -20px to +20px
          const y = Math.floor(Math.random() * 8) - 4;

          el.style.clipPath = `inset(${top}% 0% ${100 - (top + height)}% 0%)`;
          el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
          el.style.opacity = "1";

          setTimeout(() => {
            if (active && el) {
              el.style.opacity = "0";
              el.style.transform = "none";
              el.style.clipPath = "none";
            }
          }, 30);
        }
      }

      const nextTime = Math.random() * 120 + 30;
      setTimeout(runLayer3, nextTime);
    };

    const initTimer1 = setTimeout(runLayer1, 1000);
    const initTimer2 = setTimeout(runLayer2, 1100);
    const initTimer3 = setTimeout(runLayer3, 1200);

    return () => {
      active = false;
      clearTimeout(initTimer1);
      clearTimeout(initTimer2);
      clearTimeout(initTimer3);
    };
  }, []);



  // Form Submit Handler
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail || !formMessage) {
      setFormError(true);
      setFormSuccess(false);
      return;
    }

    setFormError(false);
    setFormSuccess(true);
    setFormName("");
    setFormEmail("");
    setFormMessage("");

    // Fade success message after 4s
    setTimeout(() => {
      setFormSuccess(false);
    }, 4000);
  };

  // Filtered portfolio list
  const filteredPortfolio = activeFilter === "all" 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeFilter);

  return (
    <>
      {/* A. PRELOADER */}
      <div className={`hasan_tm_preloader ${preloaderLoaded ? "loaded" : ""}`}>
        <div className="spinner_wrap">
          <div className="spinner"></div>
        </div>
      </div>

      {/* B. MAGIC CUSTOM CURSOR */}
      <div 
        className={`mouse-cursor cursor-outer ${cursorHover ? "hover" : ""}`}
        style={{ left: `${cursorOuterX}px`, top: `${cursorOuterY}px` }}
      />
      <div 
        className={`mouse-cursor cursor-inner ${cursorHover ? "hover" : ""}`}
        style={{ left: `${cursorX}px`, top: `${cursorY}px` }}
      />

      {/* C. HEADER / TOPBAR */}
      <header className={`hasan_tm_topbar ${scrolled ? "animate" : ""}`}>
        <div className="container">
          <div className="topbar_inner">
            <a 
              className="logo" 
              href="#home"
              onMouseEnter={() => setCursorHover(true)}
              onMouseLeave={() => setCursorHover(false)}
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <span className="stroke">Imam</span>
              <span>Hasan</span>
            </a>
            <nav className="menu">
              <ul>
                {["home", "about", "skills", "timeline", "portfolio", "contact"].map((sec) => (
                  <li key={sec} className={currentSection === sec ? "current" : ""}>
                    <a 
                      href={`#${sec}`}
                      onMouseEnter={() => setCursorHover(true)}
                      onMouseLeave={() => setCursorHover(false)}
                    >
                      <span className="first">{menuLabels[sec]}</span>
                      <span className="second">{menuLabels[sec]}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </header>

      {/* D. MOBILE NAVIGATION */}
      <div className="hasan_tm_mobile_menu">
        <div className="topbar_inner">
          <div className="topbar_in">
            <a className="logo" href="#home" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span className="stroke">Imam</span>
              <span>Hasan</span>
            </a>
            <div 
              className={`my_trigger ${menuOpen ? "active" : ""}`} 
              onClick={() => setMenuOpen(prev => !prev)}
            >
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
        <div className={`dropdown ${menuOpen ? "open" : ""}`}>
          <ul>
            {["home", "about", "skills", "timeline", "portfolio", "contact"].map((sec) => (
              <li 
                key={sec} 
                className={currentSection === sec ? "current" : ""}
                onClick={() => setMenuOpen(false)}
              >
                <a href={`#${sec}`}>{menuLabels[sec]}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* E. HERO SECTION */}
      <section className="hasan_tm_hero" id="home">
        <div className="background">
          <div className="leftpart"></div>
          <div className="rightpart">
            <div className="inner">
              <div className="glitch_wrap">
                <div 
                  className="glitch_base" 
                  style={{ backgroundImage: `url(/hero.png)` }}
                />
                <div 
                  ref={glitchLayer1Ref}
                  className="glitch_layer glitch_one" 
                  style={{ backgroundImage: `url(/hero.png)` }}
                />
                <div 
                  ref={glitchLayer2Ref}
                  className="glitch_layer glitch_two" 
                  style={{ backgroundImage: `url(/hero.png)` }}
                />
                <div 
                  ref={glitchLayer3Ref}
                  className="glitch_layer glitch_three" 
                  style={{ backgroundImage: `url(/hero.png)` }}
                />
              </div>
              <div 
                className="overlay_image" 
                style={{ backgroundImage: `url(/hero.png)` }}
              />
              <div className="myOverlay" />
              <div className="hasan_mobile_arrow">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
              </div>
            </div>
          </div>
        </div>

        <div className="content">
          <div className="container">
            <div className="content_inner">
              <div className="name">
                <h3 className="stroke">Imam</h3>
                <h3>Hasan</h3>
                <span>Creative Web & App Developer</span>
              </div>
            </div>
            <a 
              className="hasan_tm_down" 
              href="#about"
              onMouseEnter={() => setCursorHover(true)}
              onMouseLeave={() => setCursorHover(false)}
            >
              <div className="line_wrapper">
                <div className="line"></div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* F. ABOUT SECTION */}
      <section className="hasan_tm_about" id="about">
        <div className="container">
          <div className="about_inner">
            <div 
              className="left"
              style={{ position: "relative" }}
            >
              <img 
                className="thumbnail" 
                src="img/hasan-about.svg" 
                alt="Imam Hasan" 
              />
              <div className="hasan_mobile_arrow">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
              </div>
            </div>
            <div className="right">
              <div className="name">
                <h3>Imam Hasan<span className="bg">ABOUT</span></h3>
                <span className="job">Creative Web & App Developer</span>
              </div>
              <div className="text">
                <p>I am a results-driven Full Stack Developer with a passion for engineering high-performance, visually stunning web applications. With deep expertise in React, Next.js, Laravel, CakePHP, and WordPress, I blend advanced backend architecture with pixel-perfect frontend layouts to deliver exceptional user experiences.</p>
                <p>By combining modern technologies, robust database optimization, and a devotion to visual aesthetics, I build scalable, secure, and modular digital solutions. My approach focuses on clean code, structural integrity, and functional elegance to turn complex requirements into interactive experiences that delight users.</p>
              </div>
              <div className="hasan_tm_button">
                <a 
                  href="#contact"
                  onMouseEnter={() => setCursorHover(true)}
                  onMouseLeave={() => setCursorHover(false)}
                >
                  Contact Me
                </a>
              </div>
            </div>
          </div>

          {/* G. SERVICES ROW NESTED INSIDE ABOUT */}
          <div className="about_services_wrap">
            <div className="service_inner">
              {services.map((item, idx) => (
                <div 
                  key={idx} 
                  className={`list_inner ${idx === activeService ? "active" : ""}`}
                  onMouseEnter={() => setCursorHover(true)}
                  onMouseLeave={() => setCursorHover(false)}
                  style={{ position: "relative" }}
                >
                  <div className="svg_icon">{item.icon}</div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <div className="hasan_mobile_arrow">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                  </div>
                </div>
              ))}
            </div>
            <div className="services_dots">
              {isMobile ? (
                [0, 1, 2].map((idx) => (
                  <span 
                    key={idx} 
                    className={`dot ${idx === activeService ? "active" : ""}`}
                    onClick={() => setActiveService(idx)}
                  />
                ))
              ) : (
                [0, 1].map((idx) => (
                  <span 
                    key={idx} 
                    className={`dot ${idx === 0 ? "active" : ""}`}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* G1. SKILLS SECTION */}
      <section className="hasan_tm_skills" id="skills">
        <div className="container">
          <div className="hasan_tm_main_title">
            <div className="title">
              <h3>Programming Skills<span className="bg">SKILLS</span></h3>
            </div>
          </div>

          <div className="skills_inner">
            <div className="left_side">
              <div className="bar_wrap">
                <div className="bar_label">
                  <span className="name">HTML & CSS</span>
                  <span className="percentage">95%</span>
                </div>
                <div className="bar_track">
                  <div className="bar_fill" style={{ width: "95%" }}></div>
                </div>
              </div>

              <div className="bar_wrap">
                <div className="bar_label">
                  <span className="name">JavaScript</span>
                  <span className="percentage">85%</span>
                </div>
                <div className="bar_track">
                  <div className="bar_fill" style={{ width: "85%" }}></div>
                </div>
              </div>

              <div className="bar_wrap">
                <div className="bar_label">
                  <span className="name">WordPress</span>
                  <span className="percentage">90%</span>
                </div>
                <div className="bar_track">
                  <div className="bar_fill" style={{ width: "90%" }}></div>
                </div>
              </div>

              <div className="bar_wrap">
                <div className="bar_label">
                  <span className="name">PHP</span>
                  <span className="percentage">90%</span>
                </div>
                <div className="bar_track">
                  <div className="bar_fill" style={{ width: "90%" }}></div>
                </div>
              </div>

              <div className="bar_wrap">
                <div className="bar_label">
                  <span className="name">Laravel</span>
                  <span className="percentage">90%</span>
                </div>
                <div className="bar_track">
                  <div className="bar_fill" style={{ width: "90%" }}></div>
                </div>
              </div>

              <div className="bar_wrap">
                <div className="bar_label">
                  <span className="name">CakePHP</span>
                  <span className="percentage">80%</span>
                </div>
                <div className="bar_track">
                  <div className="bar_fill" style={{ width: "80%" }}></div>
                </div>
              </div>
            </div>

            <div className="right_side">
              <div className="circle_wrap">
                <div className="circle_item">
                  <div className="circle_outer">
                    <svg viewBox="0 0 120 120" width="120" height="120">
                      <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="6" />
                      <circle cx="60" cy="60" r="50" fill="none" stroke="#000000" strokeWidth="6" strokeDasharray="314" strokeDashoffset={314 - (314 * 95) / 100} strokeLinecap="round" transform="rotate(-90 60 60)" />
                    </svg>
                    <span className="percent_num">95%</span>
                  </div>
                  <span className="circle_label">React & Next.js</span>
                </div>

                <div className="circle_item">
                  <div className="circle_outer">
                    <svg viewBox="0 0 120 120" width="120" height="120">
                      <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="6" />
                      <circle cx="60" cy="60" r="50" fill="none" stroke="#000000" strokeWidth="6" strokeDasharray="314" strokeDashoffset={314 - (314 * 85) / 100} strokeLinecap="round" transform="rotate(-90 60 60)" />
                    </svg>
                    <span className="percent_num">85%</span>
                  </div>
                  <span className="circle_label">TypeScript</span>
                </div>

                <div className="circle_item">
                  <div className="circle_outer">
                    <svg viewBox="0 0 120 120" width="120" height="120">
                      <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="6" />
                      <circle cx="60" cy="60" r="50" fill="none" stroke="#000000" strokeWidth="6" strokeDasharray="314" strokeDashoffset={314 - (314 * 90) / 100} strokeLinecap="round" transform="rotate(-90 60 60)" />
                    </svg>
                    <span className="percent_num">90%</span>
                  </div>
                  <span className="circle_label">MySQL</span>
                </div>

                <div className="circle_item">
                  <div className="circle_outer">
                    <svg viewBox="0 0 120 120" width="120" height="120">
                      <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="6" />
                      <circle cx="60" cy="60" r="50" fill="none" stroke="#000000" strokeWidth="6" strokeDasharray="314" strokeDashoffset={314 - (314 * 85) / 100} strokeLinecap="round" transform="rotate(-90 60 60)" />
                    </svg>
                    <span className="percent_num">85%</span>
                  </div>
                  <span className="circle_label">MongoDB</span>
                </div>

                <div className="circle_item">
                  <div className="circle_outer">
                    <svg viewBox="0 0 120 120" width="120" height="120">
                      <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="6" />
                      <circle cx="60" cy="60" r="50" fill="none" stroke="#000000" strokeWidth="6" strokeDasharray="314" strokeDashoffset={314 - (314 * 80) / 100} strokeLinecap="round" transform="rotate(-90 60 60)" />
                    </svg>
                    <span className="percent_num">80%</span>
                  </div>
                  <span className="circle_label">Python</span>
                </div>

                <div className="circle_item">
                  <div className="circle_outer">
                    <svg viewBox="0 0 120 120" width="120" height="120">
                      <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="6" />
                      <circle cx="60" cy="60" r="50" fill="none" stroke="#000000" strokeWidth="6" strokeDasharray="314" strokeDashoffset={314 - (314 * 95) / 100} strokeLinecap="round" transform="rotate(-90 60 60)" />
                    </svg>
                    <span className="percent_num">95%</span>
                  </div>
                  <span className="circle_label">Git & GitHub</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* G2. TIMELINE SECTION */}
      <section className="hasan_tm_timeline" id="timeline">
        <div className="container">
          <div className="hasan_tm_main_title">
            <div className="title">
              <h3>Education & Experience<span className="bg">TIMELINE</span></h3>
            </div>
          </div>

          <div className="timeline_inner">
            <div className="timeline_column">
              <div className="column_title">
                <h4>Education</h4>
              </div>
              <div className="timeline_list">
                <div className="timeline_line"></div>
                
                <div className="timeline_item">
                  <div className="timeline_node"></div>
                  <div className="year_pill">
                    <span>2008 - 2018</span>
                  </div>
                  <div className="timeline_details">
                    <h5>LIDM</h5>
                    <p>SSC</p>
                  </div>
                </div>

                <div className="timeline_item">
                  <div className="timeline_node"></div>
                  <div className="year_pill">
                    <span>2019 - 2023</span>
                  </div>
                  <div className="timeline_details">
                    <h5>ICST</h5>
                    <p>Computer Science</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="timeline_column">
              <div className="column_title">
                <h4>Experience</h4>
              </div>
              <div className="timeline_list">
                <div className="timeline_line"></div>

                <div className="timeline_item">
                  <div className="timeline_node"></div>
                  <div className="year_pill">
                    <span>2018 - running</span>
                  </div>
                  <div className="timeline_details">
                    <h5>VPS Rocket</h5>
                    <p>Server Administrator</p>
                  </div>
                </div>

                <div className="timeline_item">
                  <div className="timeline_node"></div>
                  <div className="year_pill">
                    <span>2024 - running</span>
                  </div>
                  <div className="timeline_details">
                    <h5>Sav Technologies</h5>
                    <p>Full Stack Web Developer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* H. PORTFOLIO SECTION */}
      <section className="hasan_tm_portoflio" id="portfolio">
        <div className="container">
          <div className="hasan_tm_main_title">
            <div className="title">
              <h3>Featured Works<span className="bg">PORTFOLIO</span></h3>
            </div>
            <div className="portfolio_view_all">
              <a 
                href="https://github.com/imamhasan" 
                target="_blank" 
                rel="noreferrer"
                onMouseEnter={() => setCursorHover(true)}
                onMouseLeave={() => setCursorHover(false)}
              >
                <span className="first">View All</span>
                <span className="second">View All</span>
              </a>
            </div>
          </div>

          <div className="portfolio_inner">
            <ul>
              {portfolioItems.map((item) => (
                <li key={item.id}>
                  <a 
                    href={item.liveUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <div 
                      className="list_inner"
                      onMouseEnter={() => setCursorHover(true)}
                      onMouseLeave={() => setCursorHover(false)}
                      style={{ position: "relative" }}
                    >
                      <div className="image_wrap">
                        <img src={item.image} alt={item.title} />
                        <div className="image_overlay">
                          <span>Visit Website ↗</span>
                        </div>
                      </div>
                      <div className="details_title">
                        <h3>{item.title}</h3>
                        <p className="project_category_label">{item.description}</p>
                        <div className="tech_icons_row">
                          {item.tools.map((tool) => (
                            <span key={tool} className="tech_icon_item" title={tool.toUpperCase()}>
                              {getTechIcon(tool)}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="hasan_mobile_arrow">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                      </div>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* I. TESTIMONIALS SECTION (GRID) */}
      <section className="hasan_tm_testimonials">
        <div className="container">
          <div className="hasan_tm_main_title title_flex">
            <div className="title">
              <h3>What Clients Say<span className="bg">TESTIMONIAL</span></h3>
            </div>
          </div>

          <div className="testimonials_grid">
            {testimonials.map((item, idx) => (
              <div 
                key={idx} 
                className={`testimonial_card ${idx === activeTestimonial ? "active" : ""}`}
                onMouseEnter={() => setCursorHover(true)}
                onMouseLeave={() => setCursorHover(false)}
                onClick={() => {
                  if (window.innerWidth <= 768) {
                    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
                  }
                }}
                style={{ position: "relative", cursor: isMobile ? "pointer" : "default" }}
              >
                <p className="text">{item.quote}</p>
                <div className="details">
                  <div 
                    className="avatar" 
                    style={{ backgroundImage: `url(${item.avatar})` }}
                  />
                  <div className="short">
                    <h3>{item.author}</h3>
                    <p>{item.job}</p>
                  </div>
                </div>
                <div className="hasan_mobile_arrow">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                </div>
              </div>
            ))}
          </div>


        </div>
      </section>


      {/* K. CONTACT SECTION */}
      <section className="hasan_tm_contact" id="contact">
        <div className="container">
          <div className="hasan_tm_main_title title_flex">
            <div className="title">
              <h3>Get In Touch<span className="bg">CONTACT</span></h3>
            </div>
          </div>

          <div className="wrapper">
            {/* Form */}
            <div className="left">
              <form className="contact_form" onSubmit={handleContactSubmit}>
                {formError && (
                  <div className="empty_notice" style={{ display: "block" }}>
                    <span>Please fill in all details!</span>
                  </div>
                )}
                {formSuccess && (
                  <div className="returnmessage" style={{ display: "block" }}>
                    <span>Message received. I will contact you soon!</span>
                  </div>
                )}
                <ul>
                  <li>
                    <input 
                      type="text" 
                      placeholder="Your Name" 
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      onMouseEnter={() => setCursorHover(true)}
                      onMouseLeave={() => setCursorHover(false)}
                    />
                  </li>
                  <li>
                    <input 
                      type="text" 
                      placeholder="Your Email" 
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      onMouseEnter={() => setCursorHover(true)}
                      onMouseLeave={() => setCursorHover(false)}
                    />
                  </li>
                  <li>
                    <textarea 
                      placeholder="Your Message" 
                      value={formMessage}
                      onChange={(e) => setFormMessage(e.target.value)}
                      onMouseEnter={() => setCursorHover(true)}
                      onMouseLeave={() => setCursorHover(false)}
                    />
                  </li>
                </ul>
                <div className="hasan_tm_button">
                  <button 
                    type="submit" 
                    onMouseEnter={() => setCursorHover(true)}
                    onMouseLeave={() => setCursorHover(false)}
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>

            {/* Tokyo Google Maps Grayscale Iframe */}
            <div className="right" style={{ position: "relative", minHeight: "380px" }}>
              <div className="interactive_node_map" style={{ width: "100%", height: "100%", overflow: "hidden", position: "relative" }}>
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d118073.4939223703!2d91.31979963955078!3d23.011831885449217!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3753683f2e1a3b37%3A0xe96bf07f7c6e44d5!2sFeni!5e0!3m2!1sen!2sbd!4v1653000000000!5m2!1sen!2sbd" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0, filter: "grayscale(100%) contrast(1.2) opacity(0.85)", position: "absolute", top: 0, left: 0 }} 
                  allowFullScreen={false} 
                  loading="lazy"
                />
                <div className="hasan_mobile_arrow">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                </div>
              </div>
            </div>
          </div>
          

        </div>
      </section>

      {/* L. COPYRIGHT */}
      <footer className="hasan_tm_copyright">
        <div className="container">
          <div className="copyright_inner">
            <ul>
              <li>
                <span className="footer_label">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  Phone
                </span>
                <span className="footer_value">
                  <a 
                    href="tel:+8801887030571"
                    onMouseEnter={() => setCursorHover(true)}
                    onMouseLeave={() => setCursorHover(false)}
                  >
                    +8801887030571
                  </a>
                </span>
              </li>
              <li>
                <span className="footer_label">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  Email
                </span>
                <span className="footer_value">
                  <a 
                    href="mailto:hi@imamhasan.dev"
                    onMouseEnter={() => setCursorHover(true)}
                    onMouseLeave={() => setCursorHover(false)}
                  >
                    hi@imamhasan.dev
                  </a>
                </span>
              </li>
              <li>
                <span className="footer_label">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  Address
                </span>
                <span className="footer_value">Feni, Bangladesh</span>
              </li>
              <li>
                <span className="footer_label">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                  </svg>
                  Socials
                </span>
                <div className="social">
                  <ul>
                    {[
                      { 
                        name: "facebook", 
                        url: "https://facebook.com",
                        renderIcon: () => (
                          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                          </svg>
                        )
                      },
                      { 
                        name: "instagram", 
                        url: "https://instagram.com",
                        renderIcon: () => (
                          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01" />
                          </svg>
                        )
                      },
                      { 
                        name: "twitter", 
                        url: "https://twitter.com",
                        renderIcon: () => (
                          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                          </svg>
                        )
                      },
                      { 
                        name: "linkedin", 
                        url: "https://linkedin.com",
                        renderIcon: () => (
                          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                            <rect x="2" y="9" width="4" height="12" />
                            <circle cx="4" cy="4" r="2" />
                          </svg>
                        )
                      },
                      { 
                        name: "telegram", 
                        url: "https://t.me/+8801887030571",
                        renderIcon: () => (
                          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="22" y1="2" x2="11" y2="13" />
                            <polygon points="22 2 15 22 11 13 2 9 22 2" />
                          </svg>
                        )
                      },
                      { 
                        name: "github", 
                        url: "https://github.com/imamhasan",
                        renderIcon: () => (
                          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                          </svg>
                        )
                      }
                    ].map((soc) => (
                      <li key={soc.name}>
                        <a 
                          href={soc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onMouseEnter={() => setCursorHover(true)}
                          onMouseLeave={() => setCursorHover(false)}
                          aria-label={soc.name}
                        >
                          {soc.renderIcon()}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Divider */}
        <div className="copyright_bottom">
          <div className="container">
            <div className="bottom_inner">
              <p>Copyright &copy; 2026 Imam Hasan Emon | All Rights Reserved</p>
              <div className="bottom_links">
                <a 
                  href="#"
                  onMouseEnter={() => setCursorHover(true)}
                  onMouseLeave={() => setCursorHover(false)}
                >
                  Terms & Conditions
                </a>
                <a 
                  href="#"
                  onMouseEnter={() => setCursorHover(true)}
                  onMouseLeave={() => setCursorHover(false)}
                >
                  Privacy Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

    </>
  );
}
