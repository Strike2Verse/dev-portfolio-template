/**
 * Portfolio script
 * ------------------------------------------------------------------
 * 1. Edit the PROFILE object below — every link on the page reads from it.
 *    Leave a value as "" and that button shows as "coming soon" instead of
 *    silently going nowhere.
 * 2. Put your planet image at assets/planet.webp (a drawn planet is used
 *    as a fallback if the image is missing, so the hero never looks broken).
 */
const PROFILE = {
    email: "john.doe@example.com",
    links: {
        github: "https://github.com/your-username",
        linkedin: "https://www.linkedin.com/in/your-username/",
        // Projects: replace with your repository / live demo links
        projects: {
            project1: "https://github.com/your-username/project-one",   // #01
            project2: "https://github.com/your-username/project-two",   // #02
            project3: "https://github.com/your-username/project-three", // #03
            project4: "https://github.com/your-username/project-four",  // #04
            project5: "https://github.com/your-username/project-five",  // #05
            project6: "https://github.com/your-username/project-six",   // #06
            project7: "https://github.com/your-username/portfolio",     // #07
            project8: "https://github.com/your-username/project-eight", // #08
            project9: "https://github.com/your-username/project-nine"   // #09
        },

        // Certifications: replace with your credential links
        certs: {
            cert1: "https://example.com/certificate-1", // 01
            cert2: "https://example.com/certificate-2", // 02
            cert3: "https://example.com/certificate-3", // 03
            cert4: "https://example.com/certificate-4", // 04
            cert5: "https://example.com/certificate-5"  // 05
        }
    }
};


document.addEventListener("DOMContentLoaded", () => {
    const mobileQuery = window.matchMedia("(max-width: 960px)");
    const isMobile = () => mobileQuery.matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canHover = window.matchMedia("(hover: hover)").matches;

    /* ---------------- 0. Links from PROFILE ---------------- */
    PROFILE.links.email = `mailto:${PROFILE.email}`;

    document.querySelectorAll("[data-link]").forEach(el => {
        const url = el.dataset.link.split(":").reduce((obj, key) => (obj ? obj[key] : undefined), PROFILE.links);
        if (typeof url === "string" && url.trim()) {
            el.href = url;
        } else {
            el.href = "#";
            el.classList.add("is-pending");
            el.setAttribute("aria-disabled", "true");
            el.title = "Link coming soon";
            el.removeAttribute("target");
            el.addEventListener("click", e => {
                e.preventDefault();
                showToast("Link coming soon");
            });
        }
    });
    document.querySelectorAll("[data-email]").forEach(el => { el.textContent = PROFILE.email; });


    /* ---------------- Toast ---------------- */
    const toast = document.getElementById("toast");
    let toastTimer;
    function showToast(msg) {
        if (!toast) return;
        toast.textContent = msg;
        toast.classList.add("show");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
    }

    /* ---------------- 2. Navbar state ---------------- */
    const navbar = document.getElementById("navbar");
    window.addEventListener("scroll", () => {
        navbar?.classList.toggle("is-scrolled", window.scrollY > 24);
    }, { passive: true });

    /* ---------------- 3. Active nav link ---------------- */
    const navLinks = document.querySelectorAll(".nav-link, .mobile-link");
    const sectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const id = entry.target.id;
            navLinks.forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${id}`));
        });
    }, { rootMargin: "-40% 0px -55% 0px" });
    document.querySelectorAll("section[id]").forEach(s => sectionObserver.observe(s));


    /* ---------------- 1. Mobile drawer ---------------- */
    const toggle = document.getElementById("mobileToggle");
    const closeBtn = document.getElementById("mobileClose");
    const menu = document.getElementById("mobileMenu");
    const backdrop = document.getElementById("backdrop");

    function setMenu(open) {
        if (!menu || !backdrop) return;
        menu.classList.toggle("open", open);
        backdrop.classList.toggle("open", open);
        toggle?.setAttribute("aria-expanded", String(open));
        document.body.style.overflow = open ? "hidden" : "";
    }
    toggle?.addEventListener("click", () => setMenu(true));
    closeBtn?.addEventListener("click", () => setMenu(false));
    backdrop?.addEventListener("click", () => setMenu(false));
    document.addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });

    /* ---------------- 5. Typewriter ---------------- */
    const typingEl = document.getElementById("typing-text");
    const phrases = [
        "Project One",
        "Project Two",
        "Project Three",
        "Project Four",
        "Project Five"
    ];
    if (typingEl && !reduceMotion) {
        let p = 0, c = 0, deleting = false, timer = null, running = true;
        typingEl.textContent = "";

        function tick() {
            const phrase = phrases[p];
            c += deleting ? -1 : 1;
            typingEl.textContent = phrase.slice(0, c);
            let delay = deleting ? 35 : 70;
            if (!deleting && c === phrase.length) { delay = 2000; deleting = true; }
            else if (deleting && c === 0) { deleting = false; p = (p + 1) % phrases.length; delay = 350; }
            timer = setTimeout(tick, delay);
        }

        function setTyping(on) {
            if (on === running) return;
            running = on;
            if (on) tick(); else { clearTimeout(timer); timer = null; }
        }

        tick();
        const heroEl = document.getElementById("home");
        let heroVisible = true;
        const syncTyping = () => setTyping(heroVisible && !document.hidden);
        if (heroEl && "IntersectionObserver" in window) {
            new IntersectionObserver(([entry]) => { heroVisible = entry.isIntersecting; syncTyping(); }).observe(heroEl);
        }
        document.addEventListener("visibilitychange", syncTyping);
    }

    /* ---------------- 6. Marquee (clone for seamless loop) ---------------- */
    const track = document.getElementById("marqueeTrack");
    if (track) {
        [...track.children].forEach(item => {
            const clone = item.cloneNode(true);
            clone.setAttribute("aria-hidden", "true");
            track.appendChild(clone);
        });
    }

    /* ---------------- 7. Project filter ---------------- */
    const grid = document.getElementById("projectsGrid");
    const filterBtns = document.querySelectorAll(".filter-btn");
    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const filter = btn.dataset.filter;
            filterBtns.forEach(b => {
                b.classList.toggle("is-active", b === btn);
                b.setAttribute("aria-pressed", String(b === btn));
            });
            grid?.classList.toggle("is-filtered", filter !== "all");
            grid?.querySelectorAll(".project-card").forEach(card => {
                const show = filter === "all" || card.dataset.category.split(" ").includes(filter);
                card.classList.toggle("is-hidden", !show);
                card.classList.remove("is-entering");
                if (show) {
                    card.style.transitionDelay = "";
                    card.classList.add("in", "revealed");
                    void card.offsetWidth; // restart animation
                    card.classList.add("is-entering");
                }
            });
        });
    });

    /* ---------------- 8. Card spotlight + subtle tilt (desktop) ---------------- */
    if (canHover && !reduceMotion) {
        document.querySelectorAll(".spotlight").forEach(card => {
            card.addEventListener("pointermove", e => {
                const r = card.getBoundingClientRect();
                card.style.setProperty("--mx", `${e.clientX - r.left}px`);
                card.style.setProperty("--my", `${e.clientY - r.top}px`);
            });
        });

        const heroScene = document.getElementById("spaceScene");
        if (heroScene && !isMobile()) {
            let pending = false;
            document.addEventListener("pointermove", e => {
                if (pending || window.scrollY > 80) return;
                pending = true;
                requestAnimationFrame(() => {
                    const x = (window.innerWidth / 2 - e.clientX) / 60;
                    const y = (window.innerHeight / 2 - e.clientY) / 60;
                    heroScene.style.transform = `translate3d(${x}px, ${y}px, 0) rotateX(${-y * 0.25}deg) rotateY(${x * 0.25}deg)`;
                    pending = false;
                });
            });
        }
    }

    /* ---------------- 9. Planet + rings canvas ---------------- */
    (function initPlanet() {
        const canvas = document.getElementById("rings-canvas");
        const hero = document.getElementById("home");
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx) return;

        const SIZE = 1200, CX = SIZE / 2, CY = SIZE / 2;
        canvas.width = SIZE;
        canvas.height = SIZE;

        const small = () => isMobile();
        const steps = () => (small() ? 140 : 260);
        const RING_A = "rgba(195,165,255,";
        const RING_B = "rgba(130,90,225,";
        const MOON = "#b89cfc";

        const rings = [
            { rx: 380, ry: 98,  tilt: -12, c: RING_A, lw: 1.35, angle: 0.0, speed: 0.0055, moons: [{ a: 0.4, r: 8.5 }, { a: 2.55, r: 7.5 }, { a: 4.3, r: 6.5 }] },
            { rx: 435, ry: 122, tilt: -7,  c: RING_B, lw: 1.45, angle: 0.85, speed: 0.0042, moons: [{ a: 1.1, r: 8.5 }, { a: 3.65, r: 7.5 }, { a: 5.5, r: 6.5 }] },
            { rx: 490, ry: 146, tilt: -15, c: RING_A, lw: 1.1, angle: 1.8, speed: 0.0032, moons: [{ a: 0.7, r: 7.5 }, { a: 3.0, r: 6.5 }] },
            { rx: 540, ry: 170, tilt: -4,  c: RING_B, lw: 1.2, angle: 2.6, speed: 0.0022, moons: [{ a: 1.55, r: 7.5 }, { a: 4.05, r: 6.5 }] }
        ];

        const dust = Array.from({ length: small() ? 16 : 45 }, () => ({
            x: Math.random() * SIZE, y: Math.random() * SIZE,
            r: Math.random() * 2.2 + 0.8,
            a: Math.random() * 0.45 + 0.18,
            ts: Math.random() * 0.03 + 0.01, tp: Math.random() * Math.PI * 2,
            dx: (Math.random() - 0.5) * 0.16, dy: (Math.random() - 0.5) * 0.16,
            front: Math.random() > 0.4
        }));

        const project = (ring, ang) => {
            const t = ring.tilt * Math.PI / 180;
            const ex = ring.rx * Math.cos(ang), ey = ring.ry * Math.sin(ang);
            return { x: CX + ex * Math.cos(t) - ey * Math.sin(t), y: CY + ex * Math.sin(t) + ey * Math.cos(t), behind: ey < 0 };
        };

        function drawDust(front) {
            ctx.save();
            ctx.shadowColor = "rgba(139,92,246,0.65)";
            dust.forEach(p => {
                if (p.front !== front) return;
                if (!reduceMotion) {
                    p.tp += p.ts; p.x += p.dx; p.y += p.dy;
                    if (p.x < 0) p.x = SIZE; if (p.x > SIZE) p.x = 0;
                    if (p.y < 0) p.y = SIZE; if (p.y > SIZE) p.y = 0;
                }
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(220,200,255,${Math.max(0.05, p.a + Math.sin(p.tp) * 0.15)})`;
                ctx.shadowBlur = small() ? 0 : p.r * 2.5;
                ctx.fill();
            });
            ctx.restore();
        }

        function drawRingHalf(ring, behind) {
            const segs = [];
            const n = steps();
            let seg = null;
            for (let i = 0; i <= n; i++) {
                const pt = project(ring, (i / n) * Math.PI * 2);
                if (pt.behind !== behind) { if (seg && seg.length > 1) segs.push(seg); seg = null; continue; }
                (seg ||= []).push(pt);
            }
            if (seg && seg.length > 1) segs.push(seg);
            if (!segs.length) return;

            ctx.save();
            ctx.shadowColor = ring.c + "0.45)";
            [[ring.c + "0.78)", ring.lw * 2.2, small() ? 0 : 2], [ring.c + "0.38)", ring.lw * 0.85, 0]].forEach(([col, lw, blur]) => {
                ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.shadowBlur = blur;
                segs.forEach(s => {
                    ctx.beginPath();
                    ctx.moveTo(s[0].x, s[0].y);
                    for (let i = 1; i < s.length; i++) ctx.lineTo(s[i].x, s[i].y);
                    ctx.stroke();
                });
            });
            ctx.restore();
        }

        function drawMoons(ring, behind) {
            ring.moons.forEach(m => {
                const pt = project(ring, m.a + ring.angle);
                if (pt.behind !== behind) return;
                const g = ctx.createRadialGradient(pt.x - m.r * 0.35, pt.y - m.r * 0.35, m.r * 0.05, pt.x, pt.y, m.r);
                g.addColorStop(0, "rgba(245,235,255,0.98)");
                g.addColorStop(0.5, MOON);
                g.addColorStop(1, "rgba(30,10,65,0.85)");
                ctx.save();
                ctx.beginPath();
                ctx.arc(pt.x, pt.y, m.r, 0, Math.PI * 2);
                ctx.fillStyle = g;
                ctx.shadowColor = ring.c + "0.9)";
                ctx.shadowBlur = m.r * (small() ? 1.8 : 3.5);
                ctx.fill();
                ctx.restore();
            });
        }

        // Fallback planet drawn in code (used until/unless the image loads)
        function drawFallbackPlanet() {
            const R = 300;
            ctx.save();
            const atmo = ctx.createRadialGradient(CX, CY, R * 0.9, CX, CY, R * 1.25);
            atmo.addColorStop(0, "rgba(139,92,246,0.35)");
            atmo.addColorStop(1, "rgba(139,92,246,0)");
            ctx.fillStyle = atmo;
            ctx.beginPath(); ctx.arc(CX, CY, R * 1.25, 0, Math.PI * 2); ctx.fill();

            ctx.beginPath(); ctx.arc(CX, CY, R, 0, Math.PI * 2); ctx.clip();
            const body = ctx.createRadialGradient(CX - R * 0.35, CY - R * 0.4, R * 0.05, CX, CY, R);
            body.addColorStop(0, "#d9c8ff");
            body.addColorStop(0.35, "#8b5cf6");
            body.addColorStop(0.75, "#3b1d8f");
            body.addColorStop(1, "#120a2e");
            ctx.fillStyle = body;
            ctx.fillRect(CX - R, CY - R, R * 2, R * 2);

            // soft bands
            ctx.globalAlpha = 0.14;
            for (let i = -4; i <= 4; i++) {
                ctx.fillStyle = i % 2 ? "#22d3ee" : "#ffffff";
                ctx.beginPath();
                ctx.ellipse(CX, CY + i * 62, R * 1.1, 14 + Math.abs(i) * 2, -0.18, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1;

            // terminator shadow
            const shade = ctx.createLinearGradient(CX - R, CY - R, CX + R, CY + R);
            shade.addColorStop(0.45, "rgba(5,3,15,0)");
            shade.addColorStop(1, "rgba(5,3,15,0.75)");
            ctx.fillStyle = shade;
            ctx.fillRect(CX - R, CY - R, R * 2, R * 2);
            ctx.restore();

            // rim light
            ctx.save();
            ctx.beginPath(); ctx.arc(CX, CY, R, 0, Math.PI * 2);
            ctx.strokeStyle = "rgba(196,170,255,0.35)"; ctx.lineWidth = 2;
            ctx.shadowColor = "rgba(139,92,246,0.9)"; ctx.shadowBlur = 30;
            ctx.stroke();
            ctx.restore();
        }

        const img = new Image();
        let imgReady = false;
        img.onload = () => { imgReady = img.naturalWidth > 0; if (reduceMotion) frame(); };
        img.src = "assets/planet.webp";
        const pw = 1100, ph = pw * (1024 / 1536);

        let visible = true, raf = null;

        function frame() {
            ctx.clearRect(0, 0, SIZE, SIZE);
            drawDust(false);
            rings.forEach(r => { drawRingHalf(r, true); drawMoons(r, true); });
            if (imgReady) ctx.drawImage(img, CX - pw / 2, CY - ph / 2, pw, ph);
            else drawFallbackPlanet();
            rings.forEach(r => {
                drawRingHalf(r, false); drawMoons(r, false);
                if (!reduceMotion) r.angle += r.speed;
            });
            drawDust(true);
        }

        function loop() {
            if (!visible) { raf = null; return; }
            frame();
            raf = requestAnimationFrame(loop);
        }

        if (reduceMotion) { frame(); return; }

        let heroInView = true;
        const update = () => {
            visible = heroInView && !document.hidden;
            if (visible) {
                if (!raf) raf = requestAnimationFrame(loop);
            } else {
                if (raf) {
                    cancelAnimationFrame(raf);
                    raf = null;
                }
            }
        };
        if (hero && "IntersectionObserver" in window) {
            new IntersectionObserver(([entry]) => { heroInView = entry.isIntersecting; update(); }, { threshold: 0 }).observe(hero);
        }
        document.addEventListener("visibilitychange", update);

        raf = requestAnimationFrame(loop);
    })();
});
