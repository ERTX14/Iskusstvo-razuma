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


// =====================================================
// ДАННЫЕ ШЕСТИ КУРСОВ
// =====================================================

const courses = {

    // =================================================
    // КУРС 1
    // =================================================

    course1: {

        title: "Название курса 1",

        description: [
            "Первый пункт курса 1",
            "Второй пункт курса 1",
            "Третий пункт курса 1",
            "Четвёртый пункт курса 1"
        ],

        media: [
            {
                type: "image",
                src: "images/course1-1.jpg"
            },
            {
                type: "image",
                src: "images/course1-2.jpg"
            },
            {
                type: "video",
                src: "videos/course1.mp4"
            }
        ],

        buttonLink: "#registration"
    },


    // =================================================
    // КУРС 2
    // =================================================

    course2: {

        title: "Название курса 2",

        description: [
            "Первый пункт курса 2",
            "Второй пункт курса 2",
            "Третий пункт курса 2",
            "Четвёртый пункт курса 2"
        ],

        media: [
            {
                type: "image",
                src: "images/course2-1.jpg"
            },
            {
                type: "image",
                src: "images/course2-2.jpg"
            },
            {
                type: "video",
                src: "videos/course2.mp4"
            }
        ],

        buttonLink: "#registration"
    },


    // =================================================
    // КУРС 3
    // =================================================

    course3: {

        title: "Название курса 3",

        description: [
            "Первый пункт курса 3",
            "Второй пункт курса 3",
            "Третий пункт курса 3",
            "Четвёртый пункт курса 3"
        ],

        media: [
            {
                type: "image",
                src: "images/course3-1.jpg"
            },
            {
                type: "image",
                src: "images/course3-2.jpg"
            },
            {
                type: "video",
                src: "videos/course3.mp4"
            }
        ],

        buttonLink: "#registration"
    },


    // =================================================
    // КУРС 4
    // =================================================

    course4: {

        title: "Название курса 4",

        description: [
            "Первый пункт курса 4",
            "Второй пункт курса 4",
            "Третий пункт курса 4",
            "Четвёртый пункт курса 4"
        ],

        media: [
            {
                type: "image",
                src: "images/course4-1.jpg"
            },
            {
                type: "image",
                src: "images/course4-2.jpg"
            },
            {
                type: "video",
                src: "videos/course4.mp4"
            }
        ],

        buttonLink: "#registration"
    },


    // =================================================
    // КУРС 5
    // =================================================

    course5: {

        title: "Название курса 5",

        description: [
            "Первый пункт курса 5",
            "Второй пункт курса 5",
            "Третий пункт курса 5",
            "Четвёртый пункт курса 5"
        ],

        media: [
            {
                type: "image",
                src: "images/course5-1.jpg"
            },
            {
                type: "image",
                src: "images/course5-2.jpg"
            },
            {
                type: "video",
                src: "videos/course5.mp4"
            }
        ],

        buttonLink: "#registration"
    },


    // =================================================
    // КУРС 6

// =================================================

    course6: {

        title: "Название курса 6",

        description: [
            "Первый пункт курса 6",
            "Второй пункт курса 6",
            "Третий пункт курса 6",
            "Четвёртый пункт курса 6"
        ],

        media: [
            {
                type: "image",
                src: "images/course6-1.jpg"
            },
            {
                type: "image",
                src: "images/course6-2.jpg"
            },
            {
                type: "video",
                src: "videos/course6.mp4"
            }
        ],

        buttonLink: "#registration"
    }

};



// =====================================================
// ЭЛЕМЕНТЫ МОДАЛЬНОГО ОКНА
// =====================================================

const modal = document.getElementById("courseModal");

const modalTitle = document.getElementById("modalTitle");

const modalList = document.getElementById("modalList");

const modalImage = document.getElementById("modalImage");

const modalVideo = document.getElementById("modalVideo");

const modalButton = document.getElementById("modalButton");

const closeModal = document.querySelector(".close-modal");

const nextButton = document.querySelector(".modal-arrow.next");

const prevButton = document.querySelector(".modal-arrow.prev");



// =====================================================
// ТЕКУЩИЙ СЛАЙДЕР
// =====================================================

let currentMedia = [];

let currentMediaIndex = 0;



// =====================================================
// ВСЕ КАРТОЧКИ
// =====================================================

const cards = document.querySelectorAll(".course-card");



// =====================================================
// ОТКРЫТИЕ КУРСА
// =====================================================

cards.forEach(card => {

    card.addEventListener("click", () => {

        // Получаем название курса из data-course

        const courseId = card.dataset.course;


        // Получаем данные курса

        const course = courses[courseId];


        // Если курс не найден — ничего не делаем

        if (!course) {
            console.error("Курс не найден:", courseId);
            return;
        }



        // =============================================
        // НАЗВАНИЕ
        // =============================================

        modalTitle.textContent = course.title;



        // =============================================
        // ОПИСАНИЕ
        // =============================================

        modalList.innerHTML = "";


        course.description.forEach(item => {

            const li = document.createElement("li");

            li.textContent = item;

            modalList.appendChild(li);

        });



        // =============================================
        // КНОПКА
        // =============================================

        modalButton.href = course.buttonLink;



        // =============================================
        // СЛАЙДЕР
        // =============================================

        currentMedia = course.media;

        currentMediaIndex = 0;


        showMedia();



        // =============================================
        // ОТКРЫВАЕМ МОДАЛЬНОЕ ОКНО
        // =============================================

        modal.classList.add("active");

    });

});



// =====================================================
// ПОКАЗ МЕДИА
// =====================================================

function showMedia() {

    if (currentMedia.length === 0) {
        return;
    }


    const media = currentMedia[currentMediaIndex];



    // Сначала скрываем всё

    modalImage.style.display = "none";

    modalVideo.style.display = "none";



    // =============================================
    // ЕСЛИ ЭТО КАРТИНКА
    // =============================================

    if (media.type === "image") {

modalImage.src = media.src;

        modalImage.style.display = "block";

    }



    // =============================================
    // ЕСЛИ ЭТО ВИДЕО
    // =============================================

    if (media.type === "video") {

        modalVideo.querySelector("source").src = media.src;

        modalVideo.load();

        modalVideo.style.display = "block";

    }

}



// =====================================================
// СЛЕДУЮЩАЯ КАРТИНКА
// =====================================================

nextButton.addEventListener("click", (event) => {

    event.stopPropagation();


    currentMediaIndex++;


    if (currentMediaIndex >= currentMedia.length) {

        currentMediaIndex = 0;

    }


    showMedia();

});



// =====================================================
// ПРЕДЫДУЩАЯ КАРТИНКА
// =====================================================

prevButton.addEventListener("click", (event) => {

    event.stopPropagation();


    currentMediaIndex--;


    if (currentMediaIndex < 0) {

        currentMediaIndex = currentMedia.length - 1;

    }


    showMedia();

});



// =====================================================
// ЗАКРЫТИЕ
// =====================================================

closeModal.addEventListener("click", () => {

    modal.classList.remove("active");

});



// =====================================================
// ЗАКРЫТИЕ ПРИ КЛИКЕ ПО ФОНУ
// =====================================================

modal.addEventListener("click", (event) => {

    if (event.target === modal) {

        modal.classList.remove("active");

    }

});

document.addEventListener("DOMContentLoaded", function () {

    const diplomaButtons = document.querySelectorAll(".diploma-button");
    const diplomaModals = document.querySelectorAll(".diploma-modal");
    const diplomaCloseButtons = document.querySelectorAll(".diploma-close");


    diplomaButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const modalId = this.getAttribute("data-diploma");
            const modal = document.getElementById(modalId);

            console.log("Нажата карточка:", modalId);
            console.log("Найдено окно:", modal);

            if (modal) {

                modal.classList.add("active");

                document.body.style.overflow = "hidden";

            }

        });

    });


    diplomaCloseButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const modal = this.closest(".diploma-modal");

            if (modal) {

                modal.classList.remove("active");

                document.body.style.overflow = "";

            }

        });

    });


    diplomaModals.forEach(function (modal) {

        modal.addEventListener("click", function (event) {

            if (event.target === modal) {

                modal.classList.remove("active");

                document.body.style.overflow = "";

            }

        });

    });


    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {

            diplomaModals.forEach(function (modal) {

                modal.classList.remove("active");

            });

            document.body.style.overflow = "";

        }

    });

});
/* =====================================================
   ДИПЛОМЫ
===================================================== */

function openDiploma(id) {

    const popup = document.getElementById(id);

    if (!popup) {
        console.error("Окно не найдено:", id);
        return;
    }

    popup.classList.add("show");

    document.body.style.overflow = "hidden";
}


function closeDiploma(id) {

    const popup = document.getElementById(id);

    if (!popup) {
        return;
    }

    popup.classList.remove("show");

    document.body.style.overflow = "";
}


/* Закрытие по тёмному фону */

document.addEventListener("click", function(event) {

    if (event.target.classList.contains("diploma-popup")) {

        event.target.classList.remove("show");

        document.body.style.overflow = "";

    }

});


/* Закрытие клавишей ESC */

document.addEventListener("keydown", function(event) {

    if (event.key === "Escape") {

        document
            .querySelectorAll(".diploma-popup")
            .forEach(function(popup) {

                popup.classList.remove("show");

            });

        document.body.style.overflow = "";

    }

});