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

        tick();
    }
});
