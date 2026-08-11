document.addEventListener("DOMContentLoaded", () => {
    /* =========================
       MOBILE MENU
       ========================= */
    const menuButton = document.querySelector(".mobile-menu-toggle");
    const nav = document.querySelector("header nav");

    if (menuButton && nav) {
        menuButton.addEventListener("click", () => {
            const open = nav.classList.toggle("mobile-open");
            menuButton.classList.toggle("active", open);
            menuButton.setAttribute("aria-expanded", String(open));
        });

        nav.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                nav.classList.remove("mobile-open");
                menuButton.classList.remove("active");
                menuButton.setAttribute("aria-expanded", "false");
            });
        });
    }

    /* =========================
       HERO SLIDER
       ========================= */
    const slides = [...document.querySelectorAll(".slide")];
    const dots = [...document.querySelectorAll(".dot")];
    const nextButton = document.querySelector(".hero-slider .next");
    const prevButton = document.querySelector(".hero-slider .prev");
    let currentSlide = Math.max(0, slides.findIndex(slide => slide.classList.contains("active")));
    let sliderTimer = null;

    function showSlide(index) {
        if (!slides.length) return;
        currentSlide = (index + slides.length) % slides.length;
        slides.forEach((slide, i) => slide.classList.toggle("active", i === currentSlide));
        dots.forEach((dot, i) => dot.classList.toggle("active", i === currentSlide));
    }

    function nextSlide() { showSlide(currentSlide + 1); }
    function prevSlide() { showSlide(currentSlide - 1); }
    function restartSliderTimer() {
        if (sliderTimer) clearInterval(sliderTimer);
        if (slides.length > 1) sliderTimer = setInterval(nextSlide, 15000);
    }

    if (slides.length) {
        nextButton?.addEventListener("click", () => { nextSlide(); restartSliderTimer(); });
        prevButton?.addEventListener("click", () => { prevSlide(); restartSliderTimer(); });
        dots.forEach((dot, i) => dot.addEventListener("click", () => { showSlide(i); restartSliderTimer(); }));

        let touchStartX = 0;
        let touchStartY = 0;
        const hero = document.querySelector(".hero-slider");
        hero?.addEventListener("touchstart", e => {
            touchStartX = e.changedTouches[0].clientX;
            touchStartY = e.changedTouches[0].clientY;
        }, { passive: true });
        hero?.addEventListener("touchend", e => {
            const dx = e.changedTouches[0].clientX - touchStartX;
            const dy = e.changedTouches[0].clientY - touchStartY;
            if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
                dx < 0 ? nextSlide() : prevSlide();
                restartSliderTimer();
            }
        }, { passive: true });

        showSlide(currentSlide);
        restartSliderTimer();
    }

    /* =========================
       FILTERS
       Second click on the same option = reset this filter.
       ========================= */
    const cards = [...document.querySelectorAll(".course-card")];
    const filterButtons = [...document.querySelectorAll(".filter-btn")];
    const resetFiltersButton = document.querySelector(".reset-filters");
    const filterState = { age: "all", direction: "all", format: "all" };

    function updateFilterButtons() {
        filterButtons.forEach(button => {
            const type = button.dataset.type;
            const value = button.dataset.value;
            button.classList.toggle("active", filterState[type] === value && value !== "all");
        });
    }

    function filterCourses() {
        cards.forEach(card => {
            const visible = Object.entries(filterState).every(([type, value]) => {
                return value === "all" || card.dataset[type] === value;
            });
            card.hidden = !visible;
        });
    }

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            const type = button.dataset.type;
            const value = button.dataset.value;
            filterState[type] = filterState[type] === value ? "all" : value;
            updateFilterButtons();
            filterCourses();
        });
    });

    resetFiltersButton?.addEventListener("click", () => {
        filterState.age = "all";
        filterState.direction = "all";
        filterState.format = "all";
        updateFilterButtons();
        filterCourses();
    });

    filterCourses();

    /* =========================
       SCROLL TOP
       ========================= */
    const scrollTopButton = document.getElementById("scrollTopBtn");
    if (scrollTopButton) {
        const toggleScrollTop = () => scrollTopButton.classList.toggle("show", window.scrollY > 500);
        window.addEventListener("scroll", toggleScrollTop, { passive: true });
        toggleScrollTop();
        scrollTopButton.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    }

    /* =========================
       COURSE MODAL
       ========================= */
    const modal = document.getElementById("courseModal");
    if (modal) {
        const modalTitle = document.getElementById("modalTitle");
        const modalList = document.getElementById("modalList");
        const modalImage = document.getElementById("modalImage");
        const modalVideo = document.getElementById("modalVideo");
        const modalButton = modal.querySelector(".modal-btn");
        const media = {
            diagnostic: [
                { type: "image", src: "img/4.jfif" },
                { type: "image", src: "img/mppcFq3DGt9bjiSggGPrAIfJs1wMKVLcjJnD3ilXtty2ujEzFQMJ6T56Ti9t0TuLL0e433uZ_P8csJc0zgiIcyul.jpg" }
            ],
            trial: [
                { type: "image", src: "img/5.jfif" }
            ],
            neuro: [
                { type: "image", src: "img/_rABsYpVmRu7lBsdLFjQY-pMVBDgaRLMOslQrWzYrPpO5vj9Kuezbs4VHHAWCte-2RKXMQDgyOiFQPfJLJDKqhhS.jpg" }
            ]
        };
        const courseInfo = {
            diagnostic: { title: "Диагностика", value: "diagnostic", list: ["Понимание сильных сторон ребёнка", "Определение зон развития", "Рекомендации для родителей", "Подбор подходящей программы"] },
            trial: { title: "Пробное занятие", value: "trial", list: ["Знакомство с форматом занятий", "Игровая практика", "Наблюдение за ребёнком", "Рекомендации специалиста"] },
            neuro: { title: "НейроСказки", value: "neuro", list: ["Развитие речи", "Воображение", "Эмоциональный интеллект", "Творческие практики"] }
        };
        let activeCourse = null;
        let activeMediaIndex = 0;

        function renderMedia() {
            const items = media[activeCourse] || [];
            const item = items[activeMediaIndex] || items[0];
            if (!item) return;
            if (item.type === "video") {
                modalImage.style.display = "none";
                modalVideo.style.display = "block";
                modalVideo.src = item.src;
            } else {
                modalVideo.pause();
                modalVideo.removeAttribute("src");
                modalVideo.style.display = "none";
                modalImage.style.display = "block";
                modalImage.src = item.src;
            }
        }

        function openModal(courseId) {
            const info = courseInfo[courseId];
            if (!info) return;
            activeCourse = courseId;
            activeMediaIndex = 0;
            modalTitle.textContent = info.title;
            modalList.innerHTML = info.list.map(item => `<li>${item}</li>`).join("");
            renderMedia();
            modal.classList.add("active");
            document.body.style.overflow = "hidden";
        }
        function closeModal() {
            modal.classList.remove("active");
            document.body.style.overflow = "";
            modalVideo?.pause();
        }

        document.querySelectorAll(".open-course").forEach(button => {
            button.addEventListener("click", () => openModal(button.dataset.course));
        });
        modal.querySelector(".close-modal")?.addEventListener("click", closeModal);
        modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });
        document.addEventListener("keydown", e => { if (e.key === "Escape" && modal.classList.contains("active")) closeModal(); });
        modal.querySelector(".modal-arrow.prev")?.addEventListener("click", () => {
            const items = media[activeCourse] || [];
            if (!items.length) return;
            activeMediaIndex = (activeMediaIndex - 1 + items.length) % items.length;
            renderMedia();
        });
        modal.querySelector(".modal-arrow.next")?.addEventListener("click", () => {
            const items = media[activeCourse] || [];
            if (!items.length) return;
            activeMediaIndex = (activeMediaIndex + 1) % items.length;
            renderMedia();
        });
        modalButton?.addEventListener("click", e => {
            e.preventDefault();
            const select = document.querySelector("#register select");
            if (select && activeCourse) select.value = courseInfo[activeCourse].value;
            closeModal();
            document.getElementById("register")?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    }
});
