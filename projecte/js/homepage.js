document.addEventListener("DOMContentLoaded", function() {
    const menuButton = document.getElementById("menu");
    const closeButton = document.getElementById("cerrar-menu");
    const menu = document.getElementById("lista-paginas");

    menuButton.addEventListener("click", function() {
        menu.classList.remove("menu-hidden");
        menu.classList.add("menu-visible");
    });

    closeButton.addEventListener("click", function() {
        menu.classList.remove("menu-visible");
        menu.classList.add("menu-hidden");
    });
});