import "../scss/style.scss";

function lockScroll(needToLock = true) {
  if (needToLock) {
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    document.body.style.paddingRight = `${scrollbarWidth}px`;
  } else {
    document.body.style.removeProperty("padding-right");
  }

  document.body.classList[needToLock ? "add" : "remove"]("scroll-lock");
}

// function handleBurgerMenuLogic() {
//   const $burger = document.querySelector("#burger-trigger");
//   const $menu = document.querySelector("#mobile-menu");
//   const $menuCloser = document.querySelector("#menu-closer");

//   if ($burger && $menu) {
//     $burger.addEventListener("click", function () {
//       $menu.classList.toggle("active");
//       $menuCloser.setAttribute("aria-hidden", "false");
//       lockScroll();
//     });

//     const closeMenu = () => {
//       $menuCloser.setAttribute("aria-hidden", "true");
//       $burger.classList.remove("active");
//       $menu.classList.remove("active");
//       lockScroll(false);
//     };

//     $menuCloser.addEventListener("click", closeMenu);

//     $menu.querySelectorAll("a").forEach((link) => {
//       link.addEventListener("click", closeMenu);
//     });
//   }
// }

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
};
