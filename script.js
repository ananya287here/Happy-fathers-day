/* =====================================================
   STORAGE
===================================================== */

const STORAGE_KEY = "dad_newspaper_scrapbook_v1";

let scrapbookData = {
    images: {},
    text: {},
    currentPage: 0
};

/* =====================================================
   ELEMENTS
===================================================== */

const pages = [...document.querySelectorAll(".page")];
const dots = [...document.querySelectorAll(".dot")];

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");



const exportBtn = document.getElementById("exportBtn");


/* =====================================================
   LOAD DATA
===================================================== */

function loadData() {

    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {

        scrapbookData = JSON.parse(saved);

    }

}

function saveData() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(scrapbookData)
    );

}

/* =====================================================
PAGE SYSTEM
===================================================== */

let currentPage = scrapbookData.currentPage || 0;

function showPage(index) {


if (index < 0) index = 0;
if (index > pages.length - 1) index = pages.length - 1;

pages.forEach(page => {
    page.classList.remove("active");
});

dots.forEach(dot => {
    dot.classList.remove("active");
});

pages[index].classList.add("active");

if (dots[index]) {
    dots[index].classList.add("active");
}

currentPage = index;

const pageNumber =
    document.getElementById("pageNumber");

if (pageNumber) {

    pageNumber.textContent =
        `Page ${index + 1} of ${pages.length}`;

}

scrapbookData.currentPage = index;

saveData();

/* Always start at top of page */

window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth"
});

animatePage();


}

if (prevBtn) {


prevBtn.addEventListener("click", () => {

    showPage(currentPage - 1);

});


}

if (nextBtn) {


nextBtn.addEventListener("click", () => {

    showPage(currentPage + 1);

});


}

dots.forEach((dot, index) => {


dot.addEventListener("click", () => {

    showPage(index);

});


});





/* =====================================================
   EDITABLE TEXT
===================================================== */

const editableItems =
    document.querySelectorAll(
        "[contenteditable='true']"
    );

editableItems.forEach(item => {

    const key =
        item.dataset.key;

    if (
        scrapbookData.text &&
        scrapbookData.text[key]
    ) {

        item.innerHTML =
            scrapbookData.text[key];

    }

    item.addEventListener("input", () => {

        scrapbookData.text[key] =
            item.innerHTML;

        saveData();

    });

});

/* =====================================================
   SWIPE SUPPORT
===================================================== */

let touchStartX = 0;
let touchEndX = 0;

document.addEventListener(
    "touchstart",
    (e) => {

        touchStartX =
            e.changedTouches[0].screenX;

    },
    { passive: true }
);

document.addEventListener(
    "touchend",
    (e) => {

        touchEndX =
            e.changedTouches[0].screenX;

        handleSwipe();

    },
    { passive: true }
);

function handleSwipe() {

    const distance =
        touchEndX - touchStartX;

    if (distance > 80) {

        showPage(currentPage - 1);

    }

    if (distance < -80) {

        showPage(currentPage + 1);

    }

}

/* =====================================================
   KEYBOARD SUPPORT
===================================================== */

document.addEventListener(
    "keydown",
    (e) => {

        if (e.key === "ArrowRight") {

            showPage(currentPage + 1);

        }

        if (e.key === "ArrowLeft") {

            showPage(currentPage - 1);

        }

    }
);

/* =====================================================
   EXPORT PAGE
===================================================== */

exportBtn.addEventListener(
    "click",
    async () => {

        const activePage =
            document.querySelector(
                ".page.active"
            );

        const canvas =
            await html2canvas(
                activePage,
                {
                    scale: 2,
                    useCORS: true,
                    backgroundColor: null
                }
            );

        const link =
            document.createElement("a");

        link.download =
            `dad-page-${currentPage + 1}.png`;

        link.href =
            canvas.toDataURL();

        link.click();

    }
);



/* =====================================================
   ENTRANCE ANIMATION
===================================================== */

function animatePage() {

    const active =
        document.querySelector(
            ".page.active"
        );

    active.animate(
        [
            {
                opacity: 0,
                transform:
                    "translateY(20px)"
            },
            {
                opacity: 1,
                transform:
                    "translateY(0)"
            }
        ],
        {
            duration: 600,
            easing: "ease"
        }
    );

}



/* =====================================================
   FLOATING PARALLAX
===================================================== */

document.addEventListener(
    "mousemove",
    (e) => {

        const x =
            e.clientX /
            window.innerWidth;

        const y =
            e.clientY /
            window.innerHeight;

        document
            .querySelectorAll(
                ".flower,.sticker"
            )
            .forEach(el => {

                const moveX =
                    (x - .5) * 8;

                const moveY =
                    (y - .5) * 8;

                el.style.transform =
                    `translate(${moveX}px,${moveY}px)`;

            });

    }
);

/* =====================================================
INIT
===================================================== */

loadData();



showPage(
scrapbookData.currentPage || 0
);


/* =====================================================
   MUSIC
===================================================== */

document.addEventListener("click", () => {

    const music = document.getElementById("bgMusic");

    if (!music) return;

    music.volume = 0.6;

    if (music.paused) {
        music.play();
    }

}, { once: true });