import "../scss/style.scss";
import receipts from "./receipts";

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

function loadReceipt(hash) {
  const receipt = receipts.find(
    (item) => item.id === Number(hash.replace("#", ""))
  );

  const warnText = document.querySelector("#receipt-not-found");
  const receiptHTML = document.querySelector("#receipt");
  if (!receipt) {
    warnText.classList.remove("hidden");
    receiptHTML.classList.add("hidden");
    return;
  }

  warnText.classList.add("hidden");
  receiptHTML.classList.remove("hidden");

  setPageData(receipt);
}

function setCauldronTextPosition() {
  const text = document.querySelector(".promo__text");
  if (window.matchMedia("(min-width: 1024px)").matches) {
    text.style = "";
    return;
  }
  const cauldron = document.querySelector(".cauldron-wrapper");
  const cRect = cauldron.getBoundingClientRect();
  const tRect = text.getBoundingClientRect();
  text.style.top =
    cRect.top + window.pageYOffset + cRect.height / 2 - tRect.height / 2 + "px";
  text.style.maxWidth = cRect.width - 80 + "px";
  text.classList.add("promo__text--visible");
}

function handleBurgerMenuLogic() {
  const $burger = document.querySelector("#burger-trigger");
  const $menu = document.querySelector("#mobile-menu");
  // const $menuCloser = document.querySelector("#menu-closer");

  if ($burger && $menu) {
    $burger.addEventListener("click", function () {
      $menu.classList.toggle("active");
      // $menuCloser.setAttribute("aria-hidden", "false");
      lockScroll();
    });

    const closeMenu = () => {
      // $menuCloser.setAttribute("aria-hidden", "true");
      $burger.classList.remove("active");
      $menu.classList.remove("active");
      lockScroll(false);
    };

    // $menuCloser.addEventListener("click", closeMenu);

    $menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });
  }
}
function setPageData(data) {
  const image = document.querySelector("#receipt-image");
  const title = document.querySelector("#receipt-title");
  const author = document.querySelector("#receipt-author");
  const ingredients = document.querySelector("#receipt-ingredients");
  const steps = document.querySelector("#receipt-steps");
  const description = document.querySelector("#receipt-description");

  image.setAttribute("src", data.image);
  title.textContent = data.title;
  author.textContent = data.author;
  author.href = data.authorLink;
  description.textContent = data.description;
  ingredients.innerHTML = "";
  steps.innerHTML = "";
  data.ingredients.forEach((ingredient) => {
    const li = document.createElement("li");
    li.textContent = ingredient;
    ingredients.appendChild(li);
  });
  data.steps.forEach((step) => {
    const li = document.createElement("li");
    li.textContent = step;
    steps.appendChild(li);
  });
}

function renderReceiptCards() {
  const receiptItems = document.querySelector("#receipt-items");
  if (!receiptItems) return;
  const items = [];
  receipts.forEach((receipt) => {
    const content = `
    <div class="receipt__image">
      <img src="${receipt.image}" alt="Фото рецепта">
    </div>
    <div class="receipt__content">
        <p class="receipt__category">${receipt.category}</p>
        <p class="receipt__name">${receipt.title}</p>
        <a href="/receipt.html#${receipt.id}" class="receipt__link" title="Перейти на страницу рецепта: ${receipt.title}"></a>
    </div>
    `;
    const template = document.createElement("article");
    template.classList = "receipt";
    template.innerHTML = content;
    items.push(template);
  });
  receiptItems.append(...items);
}

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
  if (pathname.includes("/receipt")) {
    loadReceipt(hash);

    window.addEventListener("hashchange", (event) => {
      const { newURL } = event;
      const [, newHash] = newURL.split("#");
      loadReceipt(newHash);
    });
  }

  renderReceiptCards();
  handleBurgerMenuLogic();

  setCauldronTextPosition();
  window.addEventListener("resize", setCauldronTextPosition);
};
