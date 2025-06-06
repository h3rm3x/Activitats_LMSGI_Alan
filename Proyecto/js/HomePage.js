document.addEventListener("DOMContentLoaded", function() {
    // Inicializar el sistema de likes
    initializeLikesSystem();
    
    const likeButtons = document.querySelectorAll(".like-button");
    
    // Verificar si hay usuario logueado
    const usuarioLogeado = JSON.parse(localStorage.getItem("usuarioLogeado"));
    
    if (!usuarioLogeado) {
        // Si no hay usuario logueado, ocultar los botones de like
        likeButtons.forEach(function(button) {
            const likeContainer = button.closest(".like-container");
            if (likeContainer) {
                likeContainer.style.display = "none";
            }
        });
    } else {
        // Usuario logueado - mostrar likes y configurar eventos
        updateLikesDisplay();
        
        likeButtons.forEach(function(button) {
            button.addEventListener("click", function(event) {
                event.preventDefault();
                handleLikeClick(this, usuarioLogeado);
            });
        });
    }
});

/*
 Inicializa el sistema de likes en localStorage si no existe
*/
function initializeLikesSystem() {
    if (!localStorage.getItem("articlesLikes")) {
        const initialLikes = {
            "1": { count: 0, users: [] },
            "2": { count: 0, users: [] },
            "3": { count: 0, users: [] },
            "4": { count: 0, users: [] },
            "5": { count: 0, users: [] },
            "6": { count: 0, users: [] }
        };
        localStorage.setItem("articlesLikes", JSON.stringify(initialLikes));
    }
}

/**
 * Obtiene los datos de likes desde localStorage
 */
function getLikesData() {
    const likesData = localStorage.getItem("articlesLikes");
    return likesData ? JSON.parse(likesData) : {};
}

/**
 * Guarda los datos de likes en localStorage
 */
function saveLikesData(likesData) {
    localStorage.setItem("articlesLikes", JSON.stringify(likesData));
}

/**
 * Maneja el click en el botón de like
 */
function handleLikeClick(buttonElement, usuario) {
    // Encontrar el artículo padre y obtener su ID
    const article = buttonElement.closest("article");
    if (!article) return;
    
    const articleId = article.getAttribute("data-id");
    if (!articleId) return;
    
    const username = usuario.nombreUsuario;
    const likesData = getLikesData();
    
    // Inicializar datos del artículo si no existen
    if (!likesData[articleId]) {
        likesData[articleId] = { count: 0, users: [] };
    }
    
    const articleLikes = likesData[articleId];
    const userIndex = articleLikes.users.indexOf(username);
    
    if (userIndex === -1) {
        // Usuario no ha dado like - añadir like
        articleLikes.users.push(username);
        articleLikes.count++;
        
        // Cambiar apariencia del botón (liked)
        buttonElement.classList.add("liked");
        updateButtonImage(buttonElement, true);
        
        console.log(`${username} dio like al artículo ${articleId}`);
    } else {
        // Usuario ya dio like - quitar like
        articleLikes.users.splice(userIndex, 1);
        articleLikes.count--;
        
        // Cambiar apariencia del botón (not liked)
        buttonElement.classList.remove("liked");
        updateButtonImage(buttonElement, false);
        
        console.log(`${username} quitó like al artículo ${articleId}`);
    }
    
    // Guardar datos actualizados
    saveLikesData(likesData);
    
    // Actualizar la visualización del contador
    updateLikeCounter(article, articleLikes.count);
    
    // Guardar actividad del usuario
    saveUserLikeActivity(username, articleId, userIndex === -1);
}

/**
 * Actualiza la imagen del botón de like
 */
function updateButtonImage(buttonElement, isLiked) {
    const img = buttonElement.querySelector("img");
    if (img) {
        if (isLiked) {
            // Cambiar a imagen de "liked" (puedes crear una imagen diferente)
            img.src = "../assets/logos/likefilled.png";
            img.alt = "Unlike";
        } else {
            // Imagen original de like
            img.src = "../assets/logos/like.png";
            img.alt = "Like";
        }
    }
}

/**
 * Actualiza el contador de likes en la interfaz
 */
function updateLikeCounter(article, count) {
    const likeCountElements = article.querySelectorAll(".Nº_likes, .Nº.likes");
    likeCountElements.forEach(element => {
        element.textContent = count.toString();
    });
}

/**
 * Actualiza la visualización de todos los likes al cargar la página
 */
function updateLikesDisplay() {
    const usuarioLogeado = JSON.parse(localStorage.getItem("usuarioLogeado"));
    if (!usuarioLogeado) return;
    
    const username = usuarioLogeado.nombreUsuario;
    const likesData = getLikesData();
    
    // Actualizar cada artículo
    document.querySelectorAll("article[data-id]").forEach(article => {
        const articleId = article.getAttribute("data-id");
        const articleLikes = likesData[articleId];
        
        if (articleLikes) {
            // Actualizar contador
            updateLikeCounter(article, articleLikes.count);
            
            // Actualizar estado del botón
            const likeButton = article.querySelector(".like-button");
            if (likeButton) {
                const userHasLiked = articleLikes.users.includes(username);
                if (userHasLiked) {
                    likeButton.classList.add("liked");
                    updateButtonImage(likeButton, true);
                } else {
                    likeButton.classList.remove("liked");
                    updateButtonImage(likeButton, false);
                }
            }
        }
    });
}
