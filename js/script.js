/* =========================================================
   ИСКУССТВО РАЗУМА — ОБЩИЙ JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       MOBILE MENU
       ========================= */

    const menuToggle = document.querySelector(".mobile-menu-toggle");
    const nav = document.querySelector("header nav");

    if (menuToggle && nav) {

        menuToggle.addEventListener("click", () => {
            const isOpen = menuToggle.classList.toggle("active");
            nav.classList.toggle("mobile-open", isOpen);

            menuToggle.setAttribute("aria-expanded", String(isOpen));
            menuToggle.setAttribute(
                "aria-label",
                isOpen ? "Закрыть меню" : "Открыть меню"
            );
        });

        nav.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                menuToggle.classList.remove("active");
                nav.classList.remove("mobile-open");
                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.setAttribute("aria-label", "Открыть меню");
            });
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 768) {
                menuToggle.classList.remove("active");
                nav.classList.remove("mobile-open");
                menuToggle.setAttribute("aria-expanded", "false");
            }
        });
    }


    /* =========================
       SCROLL TO TOP
       ========================= */

    const scrollTopBtn = document.getElementById("scrollTopBtn");

    if (scrollTopBtn) {

        window.addEventListener("scroll", () => {
            scrollTopBtn.classList.toggle("show", window.scrollY > 500);
        }, { passive: true });

        scrollTopBtn.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }


    /* =========================
       HERO SLIDER
       ========================= */

    const slides = document.querySelectorAll(".hero-slider .slide");
    const dots = document.querySelectorAll(".hero-slider .dot");
    const nextButton = document.querySelector(".hero-slider .slider-btn.next");
    const prevButton = document.querySelector(".hero-slider .slider-btn.prev");

    if (slides.length) {

        let current = 0;
        let timer;

        const showSlide = (index) => {

            current = (index + slides.length) % slides.length;

            slides.forEach((slide, i) => {
                slide.classList.toggle("active", i === current);
            });

            dots.forEach((dot, i) => {
                dot.classList.toggle("active", i === current);
            });
        };

        const nextSlide = () => showSlide(current + 1);
        const prevSlide = () => showSlide(current - 1);

        const restartTimer = () => {
            clearInterval(timer);
            timer = setInterval(nextSlide, 15000);
        };

        nextButton?.addEventListener("click", () => {
            nextSlide();
            restartTimer();
        });

        prevButton?.addEventListener("click", () => {
            prevSlide();
            restartTimer();
        });

        dots.forEach((dot, index) => {
            dot.addEventListener("click", () => {
                showSlide(index);
                restartTimer();
            });
        });

        /* Touch swipe */
        const slider = document.querySelector(".hero-slider");
        let touchStartX = 0;
        let touchStartY = 0;

        slider?.addEventListener("touchstart", (event) => {
            const touch = event.changedTouches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
        }, { passive: true });

        slider?.addEventListener("touchend", (event) => {
            const touch = event.changedTouches[0];
            const deltaX = touch.clientX - touchStartX;
            const deltaY = touch.clientY - touchStartY;

            if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
                if (deltaX < 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
                restartTimer();
            }
        }, { passive: true });

        showSlide(0);
        restartTimer();
    }


    /* =========================
       COURSES FILTERS
       ========================= */

    const cards = document.querySelectorAll(".course-card");
    const filterButtons = document.querySelectorAll(".filter-btn");
    const resetFilters = document.querySelector(".reset-filters");

    if (cards.length && filterButtons.length) {

        let currentAge = "";
        let currentDirection = "";
        let currentFormat = "";

        const filterCourses = () => {

            cards.forEach(card => {

                const ageMatch =
                    currentAge === "" ||
                    card.dataset.age === currentAge;

                const directionMatch =
                    currentDirection === "" ||
                    card.dataset.direction === currentDirection;

                const formatMatch =
                    currentFormat === "" ||
                    card.dataset.format === currentFormat;

                const visible = ageMatch && directionMatch && formatMatch;

                card.classList.toggle("is-hidden", !visible);
            });
        };

        filterButtons.forEach(button => {

            button.addEventListener("click", () => {

                const type = button.dataset.type;
                const value = button.dataset.value;
                const wasActive = button.classList.contains("active");

                document
                    .querySelectorAll(`[data-type="${type}"]`)
                    .forEach(btn => btn.classList.remove("active"));

                if (wasActive) {

                    if (type === "age") currentAge = "";
                    if (type === "direction") currentDirection = "";
                    if (type === "format") currentFormat = "";

                } else {

                    button.classList.add("active");

                    if (type === "age") currentAge = value;
                    if (type === "direction") currentDirection = value;
                    if (type === "format") currentFormat = value;
                }

                filterCourses();
            });
        });

        resetFilters?.addEventListener("click", () => {

            currentAge = "";
            currentDirection = "";
            currentFormat = "";

            filterButtons.forEach(button => {
                button.classList.remove("active");
            });

            filterCourses();
        });

        filterCourses();
    }


    /* =========================
       COURSE MODAL
       ========================= */

    const modal = document.getElementById("courseModal");

    if (modal) {

        const closeModal = modal.querySelector(".close-modal");
        const modalButton = modal.querySelector(".modal-btn");

        document.querySelectorAll(".open-course").forEach(button => {

            button.addEventListener("click", (event) => {
                event.preventDefault();
                modal.classList.add("active");
                document.body.classList.add("modal-open");
            });
        });

        const closeCourseModal = () => {
            modal.classList.remove("active");
            document.body.classList.remove("modal-open");

            const video = document.getElementById("modalVideo");
            if (video) {
                video.pause();
                video.currentTime = 0;
            }
        };

        closeModal?.addEventListener("click", closeCourseModal);

        modal.addEventListener("click", (event) => {
            if (event.target === modal) {
                closeCourseModal();
            }
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && modal.classList.contains("active")) {
                closeCourseModal();
            }
        });

        modalButton?.addEventListener("click", (event) => {

            event.preventDefault();
            closeCourseModal();

            document.getElementById("register")?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });
    }

});
