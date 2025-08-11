const slides = [
  {
    src: "/TempImages/person1.jpg",
    text: "Ürün 1",
    subText: "Açıklama 1",
    btnText: "İncele",
    btnColor: "primary",
  },
  {
    src: "/TempImages/person2.jpg",
    text: "Ürün 2",
    subText: "Açıklama 2",
    btnText: "İncele",
    btnColor: "primary",
  },
  {
    src: "/TempImages/person3.jpg",
    text: "Ürün 3",
    subText: "Açıklama 3",
    btnText: "İncele",
    btnColor: "primary",
  },
];

const readySlides = [
  {
    id: 1,
    mainImg: "/TempImages/filtered-person1.jpg",
    personImg: "/TempImages/person2.jpg",
    glassesImg: "/TempImages/glasses4.webp",
    alt: "Kişi 1 ama filtreli",
    label: "Kişi 1",
  },
  {
    id: 1,
    mainImg: "Elimizde Yok",
    personImg: "/TempImages/person1.jpg",
    glassesImg: "/TempImages/glasses2.webp",
    alt: "Kişi 2 ama filtreli",
    label: "Kişi 2",
  },
  {
    id: 1,
    mainImg: "Elimizde Yok",
    personImg: "/TempImages/person3.jpg",
    glassesImg: "/TempImages/glasses3.webp",
    alt: "Kişi 3 ama filtreli",
    label: "Kişi 3",
  },
];

// Body nin üstündeki swiper
const wrapper = document.querySelector(".swiper-wrapper");
if (wrapper) {
  const slideElements = slides
    .map(
      (slide) => `
<div class="swiper-slide position-relative" style="height: 400px;">
  <img src="${slide.src}" alt="${slide.text}" class="slide-image w-100 h-100 object-fit-contain">
  <div class="position-absolute bottom-0 start-0 end-0 text-center text-white p-4">
    <h5 class="fw-bold mb-2 text-shadow">${slide.text}</h5>
    <p class="mb-3 text-shadow">${slide.subText}</p>
    <a href="#" class="btn btn-${slide.btnColor}">${slide.btnText}</a>
  </div>
</div>
`
    )
    .join("");
  wrapper.innerHTML = slideElements;

  const swiper = new Swiper(".swiper", {
    direction: "horizontal",
    loop: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    scrollbar: {
      el: ".swiper-scrollbar",
    },
  });
}

// Ready to find (ikinci swiper)
const readyToFindWrapper = document.querySelector(".ready-to-find-wrapper");
if (readyToFindWrapper) {
  const readySlidesMarkup = readySlides
    .map(
      (slide, index) => `
    <div class="swiper-slide position-relative" style="height: 400px; cursor: pointer;" data-slide-index="${index}" data-id="${
        slide.id
      }">
      <img src="${
        slide.mainImg && slide.mainImg !== "Elimizde Yok"
          ? slide.mainImg
          : slide.personImg
      }" alt="${slide.alt}" class="slide-image w-100 h-100 object-fit-contain">
      <div class="position-absolute bottom-0 start-0 end-0 text-center text-white p-4">
        <h5 class="fw-bold mb-2 text-shadow">${slide.label}</h5>
      </div>
    </div>
  `
    )
    .join("");
  readyToFindWrapper.innerHTML = readySlidesMarkup;

  // modal açma eventi
  readyToFindWrapper.querySelectorAll(".swiper-slide").forEach((el) => {
    el.addEventListener("click", (e) => {
      const slideIndex = parseInt(e.currentTarget.dataset.slideIndex);
      const slideData = readySlides[slideIndex];
      openSlideModal(slideData);
    });
  });
}

// İkinci swiper (ready to find)
const readySwiperContainer = document.querySelector(".ready-swiper");
let readySwiper = null;

if (readySwiperContainer) {
  readySwiper = new Swiper(readySwiperContainer, {
    direction: "horizontal",
    loop: true,
    loopedSlides: readySlides.length,
    slidesPerView: 1,
    spaceBetween: 0,
    navigation: {
      nextEl: ".ready-swiper .ready-next",
      prevEl: ".ready-swiper .ready-prev",
    },
    observer: true,
    observeParents: true,
    watchOverflow: true,
    centeredSlides: false,
  });
}

// Navbar gizleme ve gösterme işlevi
document.addEventListener("DOMContentLoaded", () => {
  let lastScroll = window.pageYOffset;
  const navbar = document.getElementById("navbar");

  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > lastScroll) {
      navbar.classList.add("nav-hidden");
    } else {
      navbar.classList.remove("nav-hidden");
    }
    lastScroll = currentScroll;
  });

  // Kişi verileri
  const personImages = [
    { id: 1, src: "/TempImages/person1.jpg", label: "Person 1" },
    { id: 2, src: "/TempImages/person2.jpg", label: "Person 2" },
    { id: 3, src: "/TempImages/person3.jpg", label: "Person 3" },
  ];
  // Gözlük verileri
  const glassesImages = [
    { id: 1, src: "/TempImages/glasses1.webp", label: "Glasses 1" },
    { id: 2, src: "/TempImages/glasses2.webp", label: "Glasses 2" },
    { id: 3, src: "/TempImages/glasses3.webp", label: "Glasses 3" },
    { id: 4, src: "/TempImages/glasses4.webp", label: "Glasses 4" },
  ];

  const personThumbs = document.getElementById("personThumbs");
  const glassesThumbs = document.getElementById("glassesThumbs");
  const selectedPerson = document.getElementById("selectedPerson");
  const selectedGlasses = document.getElementById("selectedGlasses");
  const resultRow = document.getElementById("resultRow");
  const resultImage = document.getElementById("resultImage");

  let chosenPerson = null;
  let chosenGlasses = null;

  function updateVisibility() {
    if (chosenPerson) selectedPerson.classList.remove("d-none"); else selectedPerson.classList.add("d-none");
    if (chosenGlasses) selectedGlasses.classList.remove("d-none"); else selectedGlasses.classList.add("d-none");
  }

  function maybeShowResult() {
    if (chosenPerson && chosenGlasses) {
      resultRow.style.display = "flex";
      resultImage.src = "/TempImages/filtered-person1.jpg"; // placeholder
    } else {
      resultRow.style.display = "none";
    }
  }

  function renderThumbs(list, container, isPerson) {
    if (!container) return;
    container.innerHTML = list
      .map(
        (item, idx) => `
        <div class="col-4">
          <img src="${item.src}" data-index="${idx}" class="img-fluid w-100 rounded thumb-img" alt="${item.label}" title="${item.label}">
        </div>`
      )
      .join("");
  }

  renderThumbs(personImages, personThumbs, true);
  renderThumbs(glassesImages, glassesThumbs, false);

  // resimlere click eventi ekleme
  function attachEvents(container, targetImg, isPerson) {
    if (!container || !targetImg) return;
    container.addEventListener("click", (e) => {
      const img = e.target.closest("img.thumb-img");
      if (!img) return;
      const index = parseInt(img.dataset.index, 10);
      const collection = isPerson ? personImages : glassesImages;
      const selectedObj = collection[index];
      if (!selectedObj) return;
      targetImg.src = selectedObj.src;
      container.querySelectorAll("img.thumb-img").forEach(i => i.classList.remove("active"));
      img.classList.add("active");
      if (isPerson) chosenPerson = selectedObj; else chosenGlasses = selectedObj;
      updateVisibility();
      maybeShowResult();
    });
  }

  attachEvents(personThumbs, selectedPerson, true);
  attachEvents(glassesThumbs, selectedGlasses, false);

  updateVisibility();
  maybeShowResult();
});

// swiper hizalamasını güncelle
window.addEventListener("resize", () => {
  if (typeof swiper !== 'undefined') swiper.update();
  if (readySwiper) readySwiper.update();
});

// Modal açma fonksiyonu
function openSlideModal(slideData) {
  const modal = new bootstrap.Modal(document.getElementById("slideModal"));

  const modalMainImg = document.getElementById("modalMainImg");
  const modalPersonImg = document.getElementById("modalPersonImg");
  const modalGlassesImg = document.getElementById("modalGlassesImg");
  const modalTitle = document.getElementById("slideModalLabel");

  // Ana resim yoksa kişi resmi gelecek
  modalMainImg.src =
    slideData.mainImg && slideData.mainImg !== "Elimizde Yok"
      ? slideData.mainImg
      : slideData.personImg;

  // Kişi ve gözlük resimleri
  modalPersonImg.src = slideData.personImg;
  modalGlassesImg.src = slideData.glassesImg;

  modalTitle.textContent = slideData.label || "Detay";

  modal.show();
}

