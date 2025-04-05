document.addEventListener("DOMContentLoaded", () => {
    const loginBtn = document.getElementById("loginBtn");

    loginBtn.addEventListener("click", () => {
        // Po stlačení tlačidla presmeruje používateľa na admin stránku
        window.location.href = '/admin/admin.html'; // Zmena cesty na tvoju správnu admin stránku
    });
});