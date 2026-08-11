document.addEventListener("DOMContentLoaded", () => {
    /* =========================
       MOBILE SIDE MENU
       ========================= */
    const logoButton = document.getElementById("logoMenuButton");
    const nav = document.getElementById("siteNav");
    const overlay = document.getElementById("mobileMenuOverlay");

    function setMenu(open) {
        if (!nav || !overlay) return;
        nav.classList.toggle("mobile-open", open);
        overlay.classList.toggle("active", open);
        if (logoButton) logoButton.setAttribute("aria-expanded", String(open));
        document.body.classList.toggle("menu-open", open);
    }

    if (logoButton && nav) {
        logoButton.addEventListener("click", () => {
            setMenu(!nav.classList.contains("mobile-open"));
        });

        nav.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => setMenu(false));
        });

        overlay?.addEventListener("click", () => setMenu(false));

        document.addEventListener("keydown", e => {
            if (e.key === "Escape") setMenu(false);
        });
    }

    /* =========================
       HERO SLIDER + SWIPE
       ========================= */
    const slides = [...document.querySelectorAll(".slide")];
    const dots = [...document.querySelectorAll(".dot")];
    const nextBtn = document.querySelector(".hero-slider .slider-btn.next");
    const prevBtn = document.querySelector(".hero-slider .slider-btn.prev");
    const hero = document.querySelector(".hero-slider");
    let current = 0;
    let sliderTimer;

    function showSlide(index) {
        if (!slides.length) return;
        current = (index + slides.length) % slides.length;

        slides.forEach((slide, i) => slide.classList.toggle("active", i === current));
        dots.forEach((dot, i) => dot.classList.toggle("active", i === current));
    }

    function nextSlide() { showSlide(current + 1); }
    function prevSlide() { showSlide(current - 1); }

    function restartSlider() {
        clearInterval(sliderTimer);
        if (slides.length > 1) sliderTimer = setInterval(nextSlide, 15000);
    }

    nextBtn?.addEventListener("click", () => { nextSlide(); restartSlider(); });
    prevBtn?.addEventListener("click", () => { prevSlide(); restartSlider(); });

    dots.forEach((dot, i) => {
        dot.addEventListener("click", () => {
            showSlide(i);
            restartSlider();
        });
    });

    let touchStartX = 0;
    hero?.addEventListener("touchstart", e => {
        touchStartX = e.changedTouches[0].clientX;
    }, { passive:true });

    hero?.addEventListener("touchend", e => {
        const delta = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(delta) > 45) {
            delta < 0 ? nextSlide() : prevSlide();
            restartSlider();
        }
    }, { passive:true });

    showSlide(0);
    restartSlider();

    /* =========================
       SPECIALIST MODAL
       ========================= */
    const specialistModal = document.getElementById("specialistModal");
    const specialistImage = document.getElementById("specialistModalImage");
    const specialistTitle = document.getElementById("specialistModalTitle");
    const specialistSubtitle = document.getElementById("specialistModalSubtitle");
    const specialistText = document.getElementById("specialistModalText");

    const specialists = {
        galina: {
            name: "Галина Чернявская",
            image: "img/Frame 26.png",
            subtitle: "Педагог, психолог, автор развивающих программ студии «Искусство Разума».",
            text: `<p>Более 25 лет помогает детям раскрывать сильные стороны, понимать себя, выстраивать отношения и уверенно действовать в новых ситуациях.</p><p>Использует творчество и игровые практики как инструмент развития мышления, самостоятельности и жизненных навыков.</p>`
        },
        oksana: {
            name: "Оксана Орлова",
            image: "img/Frame 25.png",
            subtitle: "Педагог, учитель английского языка, автор программ студии «Искусство Разума».",
            text: `<p>Работает с детьми и подростками, создаёт развивающие программы, направленные на формирование эмоционального интеллекта, коммуникативных навыков и уверенности в себе.</p><p>Уверена, что развитие происходит легче там, где ребёнку интересно, безопасно и где его сильные стороны замечают и поддерживают.</p>`
        }
    };

    function openSpecialist(key) {
        const data = specialists[key];
        if (!data || !specialistModal) return;

        specialistImage.src = data.image;
        specialistImage.alt = data.name;
        specialistTitle.textContent = data.name;
        specialistSubtitle.textContent = data.subtitle;
        specialistText.innerHTML = data.text;
        specialistModal.classList.add("active");
        specialistModal.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-open");
    }

    function closeSpecialist() {
        specialistModal?.classList.remove("active");
        specialistModal?.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-open");
    }

    document.querySelectorAll(".specialist-trigger").forEach(trigger => {
        trigger.addEventListener("click", () => openSpecialist(trigger.dataset.specialist));
        trigger.addEventListener("keydown", e => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openSpecialist(trigger.dataset.specialist);
            }
        });
    });

    specialistModal?.querySelector(".specialist-modal__close")?.addEventListener("click", closeSpecialist);
    specialistModal?.querySelector(".specialist-modal__backdrop")?.addEventListener("click", closeSpecialist);

    /* =========================
       COURSE MODALS
       ========================= */
    const courseModal = document.getElementById("courseModal");
    const modalTitle = document.getElementById("modalTitle");
    const modalImage = document.getElementById("modalImage");
    const modalVideo = document.getElementById("modalVideo");
    const modalList = document.getElementById("modalList");
    const modalStart = document.querySelector(".modal-btn");

    const courseData = {
        diagnostic: {
            title: "Диагностика ребёнка",
            images: ["img/4.jfif"],
            points: ["Первичная оценка сильных сторон ребёнка", "Определение актуальных задач развития", "Рекомендации по дальнейшим занятиям"],
            direction: "diagnostic"
        },
        trial: {
            title: "Пробное занятие",
            images: ["img/5.jfif"],
            points: ["Знакомство со студией", "Игровой формат", "Подбор подходящей программы"],
            direction: "trial"
        },
        neuro: {
            title: "Нейросказки",
            images: ["img/_rABsYpVmRu7lBsdLFjQY-pMVBDgaRLMOslQrWzYrPpO5vj9Kuezbs4VHHAWCte-2RKXMQDgyOiFQPfJLJDKqhhS.jpg"],
            points: ["Развивающие истории", "Творческие задания", "Развитие мышления и эмоционального интеллекта"],
            direction: "neuro"
        }
    };

    let modalCourseKey = null;

    function openCourse(key) {
        const data = courseData[key];
        if (!data || !courseModal) return;

        modalCourseKey = key;
        modalTitle.textContent = data.title;
        modalImage.src = data.images[0];
        modalImage.style.display = "block";
        if (modalVideo) modalVideo.style.display = "none";

        modalList.innerHTML = data.points.map(point => `<li>${point}</li>`).join("");
        courseModal.classList.add("active");
        document.body.classList.add("modal-open");
    }

    function closeCourse() {
        courseModal?.classList.remove("active");
        document.body.classList.remove("modal-open");
    }

    document.querySelectorAll(".open-course").forEach(button => {
        button.addEventListener("click", () => openCourse(button.dataset.course));
    });

    document.querySelector(".close-modal")?.addEventListener("click", closeCourse);

    courseModal?.addEventListener("click", e => {
        if (e.target === courseModal) closeCourse();
    });

    modalStart?.addEventListener("click", e => {
        e.preventDefault();
        closeCourse();

        const register = document.getElementById("register");
        const select = register?.querySelector("select");

        if (select && modalCourseKey) {
            select.value = courseData[modalCourseKey].direction;
            select.dispatchEvent(new Event("change", { bubbles:true }));
        }

        register?.scrollIntoView({ behavior:"smooth", block:"start" });
    });

    /* =========================
       SCROLL TOP
       ========================= */
    const scrollTopBtn = document.getElementById("scrollTopBtn");

    window.addEventListener("scroll", () => {
        scrollTopBtn?.classList.toggle("show", window.scrollY > 500);
    }, { passive:true });

    scrollTopBtn?.addEventListener("click", () => {
        window.scrollTo({ top:0, behavior:"smooth" });
    });

    /* =========================
       FILTERS — repeated click resets
       ========================= */
    const cards = [...document.querySelectorAll(".course-card")];

    if (cards.length) {
        const state = { age:"all", direction:"all", format:"all" };

        document.querySelectorAll(".filter-btn").forEach(button => {
            button.addEventListener("click", () => {
                const type = button.dataset.type;
                const value = button.dataset.value;

                if (state[type] === value) {
                    state[type] = "all";
                    document.querySelectorAll(`[data-type="${type}"]`).forEach(btn => btn.classList.remove("active"));
                    document.querySelector(`[data-type="${type}"][data-value="all"]`)?.classList.add("active");
                } else {
                    state[type] = value;
                    document.querySelectorAll(`[data-type="${type}"]`).forEach(btn => btn.classList.remove("active"));
                    button.classList.add("active");
                }

                cards.forEach(card => {
                    const visible =
                        (state.age === "all" || card.dataset.age === state.age) &&
                        (state.direction === "all" || card.dataset.direction === state.direction) &&
                        (state.format === "all" || card.dataset.format === state.format);

                    card.style.display = visible ? "" : "none";
                });
            });
        });
    }

    /* ESC closes everything */
    document.addEventListener("keydown", e => {
        if (e.key === "Escape") {
            closeCourse();
            closeSpecialist();
            setMenu(false);



            /* =========================================================
   МОБИЛЬНОЕ МЕНЮ
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const logoMenuButton =
        document.getElementById("logoMenuButton");

    const mobileMenu =
        document.getElementById("siteNav");

    const mobileMenuOverlay =
        document.getElementById("mobileMenuOverlay");

    const mobileMenuClose =
        document.getElementById("mobileMenuClose");

    const mobileNavLinks =
        document.querySelectorAll(".mobile-nav-link");


    if (
        !logoMenuButton ||
        !mobileMenu ||
        !mobileMenuOverlay ||
        !mobileMenuClose
    ) {
        return;
    }


    function openMobileMenu() {

        mobileMenu.classList.add("open");

        mobileMenuOverlay.classList.add("open");

        document.body.classList.add("mobile-menu-open");

        logoMenuButton.setAttribute(
            "aria-expanded",
            "true"
        );

    }


    function closeMobileMenu() {

        mobileMenu.classList.remove("open");

        mobileMenuOverlay.classList.remove("open");

        document.body.classList.remove("mobile-menu-open");

        logoMenuButton.setAttribute(
            "aria-expanded",
            "false"
        );

    }


    /* Нажатие на логотип */

    logoMenuButton.addEventListener(
        "click",
        openMobileMenu
    );


    /* Крестик */

    mobileMenuClose.addEventListener(
        "click",
        closeMobileMenu
    );


    /* Нажатие по затемнению */

    mobileMenuOverlay.addEventListener(
        "click",
        closeMobileMenu
    );


    /* После перехода по ссылке закрываем меню */

    mobileNavLinks.forEach(link => {

        link.addEventListener(
            "click",
            closeMobileMenu
        );

    });


    /* Escape */

    document.addEventListener(
        "keydown",
        event => {

            if (event.key === "Escape") {
                closeMobileMenu();
            }

        }
    );

});
        }
    });
});
