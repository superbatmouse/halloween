import "swiper/css";
import "../scss/style.scss";
import { actualRecipes, previousRecipes } from "./recipes";
import Swiper, { Pagination } from "swiper";

let sliders = null;

/**
 * Блочим скролл на странице, добавляем падинг, чтобы страница не дёргалась при исчезновении скроллбара
 * @param {boolean} needToLock
 */
function lockScroll(needToLock = true) {
  if (needToLock) {
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    document.body.style.position = "fixed";
  } else {
    document.body.style.removeProperty("padding-right");
    document.body.style.removeProperty("position");
  }

  document.body.classList[needToLock ? "add" : "remove"]("scroll-lock");
}

/**
 * Приводим объект с рецептами прошлых лет к плоскому массиву, объединяем с массивом актуальных рецептов
 */
function getAllRecipes() {
  const oldRecipes = Object.values(previousRecipes).flat();
  return oldRecipes.concat(actualRecipes);
}

/**
 * Ищем нужный рецепт по хэшу в поисковой строке.
 * Если находим — запускаем @function setPageData, которая подставит нужные данные на странице рецепта
 * Если нет — выводим сообщение о том, что рецепт не найден
 * @param {string | number} hash
 */
function loadReceipt(hash) {
  const recipe = getAllRecipes().find(
    (item) => item.id == hash.replace("#", "")
  );

  const warnText = document.querySelector("#recipe-not-found");
  const receiptHTML = document.querySelector("#recipe");
  if (!recipe) {
    warnText.classList.remove("hidden");
    receiptHTML.classList.add("hidden");
    return;
  }

  warnText.classList.add("hidden");
  receiptHTML.classList.remove("hidden");

  setPageData(recipe);
}

function renderOldRecipesPage() {
  const recipes = Object.entries(previousRecipes);
  recipes.sort((A, B) => (Number(A[0]) < Number(B[0]) ? 1 : -1));
  recipes.forEach(([year, items]) => {
    const winners = [];
    const other = [];
    items.forEach((item) => {
      item.place ? winners.push(item) : other.push(item);
    });
    renderYearRecipesSection({ year, winners, other });
  });
}

function renderYearRecipesSection({ year, winners, other }) {
  const HTMLRoot = document.querySelector(".past-competition");

  const root = document.createElement("section");
  root.classList = "recipes-by-year";

  const winnersElement = winners.map((item) => {
    item.classes = "swiper-slide";
    return getReceiptElement(item);
  });
  const slider = document.createElement("section");
  slider.classList = "swiper recipes-by-year__slider";
  const sliderWrapper = document.createElement("div");
  sliderWrapper.classList = "swiper-wrapper";
  sliderWrapper.append(...winnersElement);
  slider.append(sliderWrapper);
  slider.insertAdjacentHTML(
    "beforeend",
    '<div class="swiper-pagination"></div>'
  );

  const otherElements = other.map(getReceiptElement);
  const otherElementSection = document.createElement("section");
  otherElementSection.classList = "recipes-by-year__items";
  otherElementSection.append(...otherElements);

  root.innerHTML = `
    <h2 class="recipes-by-year__title">Рецепты ${year}</h2>
    <h3 class="recipes-by-year__subtitle show-for-sm">Рецепты-Победители</h3>
  `;

  root.insertAdjacentElement("beforeend", slider);
  root.insertAdjacentElement("beforeend", otherElementSection);
  HTMLRoot.insertAdjacentElement("beforeend", root);
}

function getReceiptWinnerElement() {}

/**
 *
 * @param {*} recipe
 * @returns {HTMLElement}
 */
function getReceiptElement({ place, classes, ...recipe }) {
  const root = document.createElement("article");
  root.classList = `recipe ${classes}`;
  const image = place ? `<img src="./images/medals/${place}.svg">` : "";
  root.innerHTML = `
  <a href="/recipe.html#${
    recipe.id
  }" class="recipe__link" title="Перейти на страницу рецепта: ${
    recipe.title
  }"></a>
  <div class="recipe__wrapper">
    <div class="recipe__image">
      <img src="${recipe.image}" alt="Фото рецепта">
    </div>
    <div class="recipe__content ${place ? "recipe__content--winner" : ""}">
      <div>
        <p class="recipe__category">${recipe.category}</p>
        <p class="recipe__name">${recipe.title}</p>
      </div>
      ${image}
    </div>
  </div>
  `;
  return root;
}

/**
 * Функция для установления текста на главной четко по середине котла для мобильных экранов.
 * Заодно устанавливается высота для всей секции, чтобы у обёртки была зависимость от высоты котла,
 * который расположен абсолютом, вызывая @function setPromoMobileHeight
 */
function setCauldronTextPosition() {
  const text = document.querySelector(".promo__text");
  if (!text) return;
  if (window.matchMedia("(min-width: 766.98px)").matches) {
    text.style = "";
    setPromoMobileHeight(false);
    return;
  }
  const cauldron = document.querySelector(".cauldron-wrapper");
  const cRect = cauldron.getBoundingClientRect();
  const tRect = text.getBoundingClientRect();
  text.style.top =
    cRect.top + window.pageYOffset + cRect.height / 2 - tRect.height / 2 + "px";
  text.style.maxWidth = cRect.width - 80 + "px";
  text.classList.add("promo__text--visible");
  setPromoMobileHeight();
}

function setPromoMobileHeight(isMobile = true) {
  const cauldron = document.querySelector("#cauldron");
  const promo = document.querySelector(".promo__content");
  const { height } = cauldron.getBoundingClientRect();
  if (isMobile) {
    promo.style.height = height + 90 + "px";
    return;
  }
  promo.style.removeProperty("height");
}

/**
 * Обрабатываем логику открытия-закрытия мобильного меню в шапке
 */
function handleBurgerMenuLogic() {
  const $burger = document.querySelector("#burger-trigger");
  const $menu = document.querySelector("#mobile-menu");
  const $menuCloser = document.querySelector("#menu-closer");

  if ($burger && $menu) {
    $burger.addEventListener("click", function () {
      $menu.classList.toggle("active");
      $menuCloser.setAttribute("aria-hidden", "false");
      lockScroll();
    });

    const closeMenu = () => {
      $menuCloser.setAttribute("aria-hidden", "true");
      $burger.classList.remove("active");
      $menu.classList.remove("active");
      lockScroll(false);
    };

    $menuCloser.addEventListener("click", closeMenu);

    $menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });
  }
}

/**
 * Подставляем нужные данные на странице рецепта в соответствующие поля
 * @param {} data
 */
function setPageData(data) {
  const image = document.querySelector("#recipe-image");
  const title = document.querySelector("#recipe-title");
  const author = document.querySelector("#recipe-author");
  const ingredients = document.querySelector("#recipe-ingredients");
  const steps = document.querySelector("#recipe-steps");
  const description = document.querySelector("#recipe-description");
  const year = document.querySelector("#recipe-year");
  const button = document.querySelector("#recipe-button");

  image.setAttribute("src", data.image);
  title.innerHTML = data.title;
  author.innerHTML = data.author;
  author.href = data.authorLink;
  year.innerHTML = data.year;
  description.innerHTML = data.description;
  ingredients.innerHTML = "";
  steps.innerHTML = "";
  data.ingredients.forEach((ingredient) => {
    const li = document.createElement("li");
    li.innerHTML = ingredient;
    ingredients.appendChild(li);
  });
  data.steps.forEach((step) => {
    const li = document.createElement("li");
    li.innerHTML = step;
    steps.appendChild(li);
  });

  const today = new Date();
  button.classList[today.getFullYear() === data.year ? "remove" : "add"](
    "hidden"
  );
}

/**
 * Отрисовываем массив с рецептами на главной странице на основе данных из файла recipes.js с актуальными рецптами
 *
 */
function renderReceiptCards() {
  const receiptItems = document.querySelector("#recipe-items");
  if (!receiptItems) return;
  const items = actualRecipes.map(getReceiptElement);
  receiptItems.append(...items);
}

/**
 * Функция-наблюдатель. По достижении определённых HTML-элементов мы присваиваем им заданные классы или
 * класс по умолчанию reached, для анимирования элементов при скролле
 * @param {string} classToWatch
 * @param {IntersectionObserverInit} customSettings
 */
function animateItems(classToWatch, customSettings = null) {
  let options = customSettings ?? {
    root: null,
    rootMargin: "0px",
    threshold: 0.5,
  };

  const callback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const classToSet = el.dataset.class;

        el.classList.add(classToSet ?? "reached");

        el.classList.remove(classToWatch.substring(1));
        observer.unobserve(el);
      }
    });
  };

  let observer = new IntersectionObserver(callback, options);

  const toAnimateItems = document.querySelectorAll(classToWatch);

  if (toAnimateItems) {
    toAnimateItems.forEach((item) => {
      observer.observe(item);
    });
  }
}

window.onload = () => {
  document.body.classList.remove("transition-lock");
  animateItems(".observed");

  const { hash, pathname } = window.location;
  if (pathname.includes("/recipe")) {
    loadReceipt(hash);

    window.addEventListener("hashchange", (event) => {
      const { newURL } = event;
      const [, newHash] = newURL.split("#");
      loadReceipt(newHash);
    });
  }

  if (pathname.includes("past-competition")) {
    renderOldRecipesPage();
  }

  renderReceiptCards();
  handleBurgerMenuLogic();

  setCauldronTextPosition();
  window.addEventListener("resize", setCauldronTextPosition);

  setTimeout(() => {
    const media = window.matchMedia("(max-width: 1023.98px)");

    if (media.matches) {
      createSliderForMobile(media);
    }
    media.addEventListener("change", createSliderForMobile);
  });
};

function createSliderForMobile(e) {
  if (e && e.matches) {
    sliders = new Swiper(".swiper", {
      modules: [Pagination],
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      spaceBetween: 20,
      slidesPerView: 1,
      breakpoints: {
        420: {
          slidesPerView: "auto",
        },
      },
    });
  } else if (sliders && Array.isArray(sliders)) {
    sliders.forEach((slider) => slider.destroy(true, true));
  }
}
