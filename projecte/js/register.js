const form = document.getElementsByTagName("form")[0];
const nombreUsuario = document.getElementById("username");
const contrasena = document.getElementById("password");
const confirmarContrasena = document.getElementById("confirm-password");
const submitButton = document.getElementById("submit");
const errorMessage = document.getElementById("error-message");
const fechaNacimiento = document.getElementById("birthdate");
const email = document.getElementById("email");
const confirmarCorreo = document.getElementById("confirm-email");
const togglePassword = document.getElementById("toggle-password");
const toggleConfirmPassword = document.getElementById("toggle-confirm-password");

// Corregido: obtener usuarios existentes del localStorage con la clave correcta
const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

document.addEventListener("DOMContentLoaded", function() {
    // Inicializar el array de usuarios solo si no existe
    if (!localStorage.getItem("usuarios")) {
        localStorage.setItem("usuarios", JSON.stringify([]));
    }

    // Limpiar el usuario logueado al cargar la página
    if (localStorage.getItem("usuarioLogeado")) {
        localStorage.removeItem("usuarioLogeado"); 
    }
    // Limpiar el mensaje de error al cargar la página
    errorMessage.textContent = "";
    errorMessage.style.display = "none";
    // Limpiar el formulario al cargar la página
    nombreUsuario.focus();
});

submitButton.addEventListener("click", (e) => {
    e.preventDefault();
    
    // Obtener usuarios actualizados del localStorage antes de validar
    const usuariosActuales = JSON.parse(localStorage.getItem("usuarios")) || [];
    
    const usuarionombre = nombreUsuario.value;
    const password = contrasena.value;
    const confirmarPassword = confirmarContrasena.value;
    const fechaNacimiento = new Date(birthdate.value);
    const edad = (new Date().getFullYear() - fechaNacimiento.getFullYear());
    const correoElectronico = email.value;
    const confirmarCorreoElectronico = confirmarCorreo.value;
    const rol = document.getElementById("rol").value;
    
    const usuario = {
        "nombre": usuarionombre,
        "contrasena": password,
        "fechaNacimiento": fechaNacimiento,
        "correoElectronico": correoElectronico,
        "rol": rol
    }
    
    // Comprobar si los campos están vacíos o nulos
    if (!usuarionombre || usuarionombre.trim() === "" || usuarionombre === null) {
        mostrarError("El nombre de usuario es obligatorio.");
        return;
    }
    
    if (!password || password.trim() === "" || password === null) {
        mostrarError("La contraseña es obligatoria.");
        return;
    }
    
    if (!confirmarPassword || confirmarPassword.trim() === "" || confirmarPassword === null) {
        mostrarError("Debe confirmar la contraseña.");
        return;
    }
    
    if (!birthdate.value || birthdate.value.trim() === "" || birthdate.value === null) {
        mostrarError("La fecha de nacimiento es obligatoria.");
        return;
    }
    
    if (!correoElectronico || correoElectronico.trim() === "" || correoElectronico === null) {
        mostrarError("El correo electrónico es obligatorio.");
        return;
    }
    
    if (!confirmarCorreoElectronico || confirmarCorreoElectronico.trim() === "" || confirmarCorreoElectronico === null) {
        mostrarError("Debe confirmar el correo electrónico.");
        return;
    }
    
    if (!rol || rol.trim() === "" || rol === null) {
        mostrarError("Debe seleccionar un rol.");
        return;
    }
    
    // validaciones adicionales
    if (password !== confirmarPassword) {
        mostrarError("Las contraseñas no coinciden.");
        return;
    }
    
    if (correoElectronico !== confirmarCorreoElectronico) {
        mostrarError("Los correos electrónicos no coinciden.");
        return;
    }
    
    if (calcularEdad(fechaNacimiento) < 14) {
        mostrarError("Debes tener al menos 14 años para registrarte.");
        return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoElectronico)) {
        mostrarError("Por favor, introduce un correo electrónico válido.");
        return;
    }
    
    // Corregida la validación de contraseña: debe tener al menos 8 caracteres Y contener mayúsculas y números
    if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
        mostrarError("La contraseña debe tener al menos 8 caracteres, una mayúscula y un número.");
        return;
    }
    
    // Corregida la validación de nombre de usuario: debe tener al menos 4 caracteres
    if (usuarionombre.length < 4 || !/^[a-zA-Z0-9]+$/.test(usuarionombre)) {
        mostrarError("El nombre de usuario debe tener al menos 4 caracteres y contener solo letras y números.");
        return;
    }
    
    if (containsNombreUsuario(usuariosActuales, usuarionombre)) {
        mostrarError("El nombre de usuario ya está registrado.");
        return;
    }
    
    // Si todas las validaciones pasan, agregar el usuario
    errorMessage.style.display = "none";
    usuariosActuales.push(usuario);
    localStorage.setItem("usuarios", JSON.stringify(usuariosActuales));
    
    // Mostrar mensaje de éxito
    errorMessage.textContent = "El usuario ha sido registrado correctamente.";
    errorMessage.style.display = "block";
    errorMessage.style.color = "green";
    form.reset(); // Limpiar el formulario
    setTimeout(() => {
        window.location.href = "../views/login.html";
    }, 2000);
});

confirmarContrasena.addEventListener("blur", (e) => {
    const password = contrasena.value;
    const confirmarPassword = e.target.value;

    if (password !== confirmarPassword) {
        mostrarError("Las contraseñas no coinciden.");
        confirmarContrasena.style.borderColor = "red";
        confirmarContrasena.focus();
    } else if (password === confirmarPassword && password !== "") {
        errorMessage.style.display = "none";
        confirmarContrasena.style.borderColor = "none";
        submitButton.disabled = false; // Habilitar el botón de envío si las contraseñas coinciden
    }
});

confirmarCorreo.addEventListener("blur", (e) => {
    const correoElectronico = email.value;
    const confirmarCorreoElectronico = e.target.value;

    if (correoElectronico !== confirmarCorreoElectronico) {
        mostrarError("Los correos electrónicos no coinciden.");
        confirmarCorreo.style.borderColor = "red";
        confirmarCorreo.focus();
    } else if (correoElectronico === confirmarCorreoElectronico && correoElectronico !== "") {
        errorMessage.style.display = "none";
        confirmarCorreo.style.borderColor = "none";
    }
});

nombreUsuario.addEventListener("blur", (e) => {
    const usuarionombre = e.target.value;

    if (usuarionombre.length < 4 || !/^[a-zA-Z0-9]+$/.test(usuarionombre)) {
        mostrarError("El nombre de usuario debe tener al menos 4 caracteres y contener solo letras y números.");
        nombreUsuario.style.borderColor = "red";
        nombreUsuario.focus();
    } else {
        errorMessage.style.display = "none";
        nombreUsuario.style.borderColor = "none";
        submitButton.disabled = false; // Habilitar el botón de envío si el nombre de usuario es válido
    }
});

// Función para validar la fortaleza de la contraseña
contrasena.addEventListener("input", (e) => {
    const password = e.target.value;
    const strengthText = document.getElementById("strength-text");
    const strengthBar = document.getElementById("strength-bar");

    if (password.length < 6) {
        strengthText.textContent = "Muy débil";
        strengthBar.className = "weak";
        submitButton.disabled = true; // Deshabilitar el botón de envío si la contraseña es muy débil
    } else if (password.length < 9|| !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
        strengthText.textContent = "Débil";
        strengthBar.className = "medium";
    } else {
        strengthText.textContent = "Fuerte";
        strengthBar.className = "strong";
    }
});

// Función para alternar la visibilidad de la confirmación de contraseña 
toggleConfirmPassword.addEventListener("click", () => {
    // Corregir los selectores - buscar las imágenes dentro del botón
    const showPWdIcon = toggleConfirmPassword.querySelector(".visible");
    const hidePWdIcon = toggleConfirmPassword.querySelector(".hidden");
    const confirmPasswordField = confirmarContrasena;
    
    const type = confirmPasswordField.getAttribute("type") === "password" ? "text" : "password";
    
    if (type === "text") {
        showPWdIcon.style.display = "none";
        hidePWdIcon.style.display = "block";
    } else {
        showPWdIcon.style.display = "block";
        hidePWdIcon.style.display = "none";
    }
    
    confirmPasswordField.setAttribute("type", type);
});

// Función auxiliar para mostrar errores
function mostrarError(mensaje) {
    // Limpiar el mensaje de error anterior
    errorMessage.textContent = "";
    errorMessage.textContent = mensaje;
    errorMessage.style.display = "block";
    errorMessage.style.color = "red";
    submitButton.disabled = true; // Deshabilitar el botón de envío si hay un error

    
    setTimeout(() => {
        errorMessage.style.display = "none";
    }, 5000);
}

function calcularEdad(fechaNacimiento) {
    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const mesActual = hoy.getMonth();
    const diaActual = hoy.getDate();
    const mesNacimiento = fechaNacimiento.getMonth();
    const diaNacimiento = fechaNacimiento.getDate();
    
    // Si aún no ha llegado el cumpleaños este año, restar 1
    if (mesActual < mesNacimiento || (mesActual === mesNacimiento && diaActual < diaNacimiento)) {
        edad--;
    }
    
    return edad;
}

// Función corregida para verificar si el nombre de usuario ya existe
function containsNombreUsuario(array, nombre) {
    return array.some(usuario => usuario.nombre === nombre);
}