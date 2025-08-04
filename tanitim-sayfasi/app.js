const slides = [
  {
    src: "/TempImages/person1.jpg",
    text: "Ürün 1",
    subText: "Açıklama 1",
    btnText: "Satın Al",
    btnColor: "primary",
  },
  {
    src: "/TempImages/person2.jpg",
    text: "Ürün 2",
    subText: "Açıklama 2",
    btnText: "Detay",
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

// TODO : how to works kısmı js ile döndürülebilir ilerde şimdilik kalsın. 
// const works = [{}];

const wrapper = document.querySelector(".swiper-wrapper");

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
