const btnMenu = document.querySelector("#btn-menu");
const navMenu = document.querySelector("#nav-menu");
const btnClose = document.querySelector("#btn-close");
const btnFeatures = document.querySelector("#btn-features");
const ulFeatures = document.querySelector(".ul-features");
const arrowDown1 = document.querySelector("#arrow-down-1");
const arrowUp1 = document.querySelector("#arrow-up-1");
const btnCompany = document.querySelector("#btn-company");
const ulCompany = document.querySelector(".ul-company");
const arrowDown2 = document.querySelector("#arrow-down-2");
const arrowUp2 = document.querySelector("#arrow-up-2");

btnMenu.addEventListener("click", () => {
  navMenu.classList.add("nav-visible");
});

btnClose.addEventListener("click", () => {
  navMenu.classList.remove("nav-visible");
});

btnFeatures.addEventListener("mouseover", ()=>{
  ulFeatures.classList.add("ul-visible");
  arrowDown1.style.display = "none";
  arrowUp1.style.display = "inline";
});

btnCompany.addEventListener("mouseover", ()=>{
  ulCompany.classList.add("ul-visible");
  arrowDown2.style.display = "none";
  arrowUp2.style.display = "inline";
});

document.addEventListener("click", ()=>{
  ulFeatures.classList.remove("ul-visible");
  ulCompany.classList.remove("ul-visible");
  arrowDown1.style.display = "inline";
  arrowUp1.style.display = "none";
  arrowDown2.style.display = "inline";
  arrowUp2.style.display = "none";
});

