(()=>{"use strict";var e={750:(e,o,t)=>{t.r(o)}},o={};function t(r){var n=o[r];if(void 0!==n)return n.exports;var s=o[r]={exports:{}};return e[r](s,s.exports,t),s.exports}t.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t(750),window.onload=function(){document.body.classList.remove("transition-lock"),function(e){var o=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,t=function(o,t){o.forEach((function(o){if(o.isIntersecting){var r=o.target,n=r.dataset.class;r.classList.add(null!=n?n:"reached"),r.classList.remove(e.substring(1)),t.unobserve(r)}}))},r=new IntersectionObserver(t,null!=o?o:{root:null,rootMargin:"0px",threshold:.5}),n=document.querySelectorAll(e);n&&n.forEach((function(e){r.observe(e)}))}(".observed")}})();
//# sourceMappingURL=main.ead180f760146935d5b7.js.map