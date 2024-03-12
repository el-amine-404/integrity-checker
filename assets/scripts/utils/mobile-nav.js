// SO ANSWER: https://stackoverflow.com/a/10811680
function reloadScrollBars() {
  document.documentElement.style.overflow = "auto"; // firefox, chrome
  document.body.scroll = "yes"; // ie only
}

function unloadScrollBars() {
  document.documentElement.style.overflow = "hidden"; // firefox, chrome
  document.body.scroll = "no"; // ie only
}

const headerBtn = document.querySelector(".header__bars");
const mobileNav = document.querySelector(".mobile-nav");
const mobileLinks = document.querySelectorAll(".mobile-nav__link");
const hamburgerMenu = document.getElementById("hamburger_menu");
// State
let isMobileNavOpen = false;

headerBtn.addEventListener("click", () => {
  isMobileNavOpen = !isMobileNavOpen;
  if (isMobileNavOpen) {
    mobileNav.style.display = "flex";
    unloadScrollBars();
    hamburgerMenu.innerHTML =
      "<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor' class='w-6 h-6'><path stroke-linecap='round' stroke-linejoin='round' d='M6 18 18 6M6 6l12 12' /></svg>";
  } else {
    mobileNav.style.display = "none";
    reloadScrollBars();
    hamburgerMenu.innerHTML =
      "<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-list header__bars' viewBox='0 0 16 16'> <path fill-rule='evenodd' d='M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5' /></svg>";
  }
});

mobileLinks.forEach((link) => {
  link.addEventListener("click", () => {
    isMobileNavOpen = false;
    mobileNav.style.display = "none";
    document.body.style.overflowY = "auto";
  });
});
