let currentPage = 1;
const limit = 9; // Número de personajes por página

// Al cargar la página, mostrar los primeros personajes
document.addEventListener("DOMContentLoaded", () => {
    fetchCharacters();
    window.addEventListener("scroll", handleScroll);
});

// Botón de búsqueda
document.getElementById("search-btn").addEventListener("click", () => {
    currentPage = 1;
    document.getElementById("characters-container").innerHTML = "";
    fetchCharacters(); // Carga la búsqueda por nombre
});

// Botón de reinicio
document.getElementById("reset-btn").addEventListener("click", () => {
    document.getElementById("search").value = "";
    document.getElementById("characters-container").innerHTML = "";
    currentPage = 1;
    fetchCharacters(); // Vuelve al inicio
});

// Trae los personajes desde la API
async function fetchCharacters() {
    const searchValue = document.getElementById("search").value.trim();
    let url = `https://dragonball-api.com/api/characters?page=${currentPage}&limit=${limit}`;

    if (searchValue) {
        // Si hay búsqueda, consultamos por nombre
        url = `https://dragonball-api.com/api/characters?name=${encodeURIComponent(searchValue)}`;
    }

    document.getElementById("loading").style.display = "block";

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Error al consultar la API");

        const data = await response.json();

        // Si es búsqueda, limpiamos el contenedor antes de mostrar
        if (searchValue) {
            document.getElementById("characters-container").innerHTML = "";
        }

        displayCharacters(data.items || data); // Soporta ambas estructuras de respuesta
        if (!searchValue) currentPage++; // Si es scroll, seguimos aumentando la página
    } catch (error) {
        document.getElementById("characters-container").innerHTML =
            "<p class='text-center text-danger'>No se encontraron personajes o hubo un error.</p>";
    } finally {
        document.getElementById("loading").style.display = "none";
    }
}

// Muestra cada personaje como tarjeta en el DOM
function displayCharacters(characters) {
    const container = document.getElementById("characters-container");

    if (characters.length === 0) {
        container.innerHTML = "<p class='text-center'>No se encontraron personajes.</p>";
        return;
    }

    characters.forEach(character => {
        const card = document.createElement("div");
        card.classList.add("col-md-4");

        // Cada tarjeta tiene un onclick para abrir el modal con detalles
        card.innerHTML = `
            <div class="card" onclick="showCharacterDetails('${character.id}')" style="cursor: pointer;">
                <img src="${character.image}" class="card-img-top" alt="${character.name}">
                <div class="card-body">
                    <h5 class="card-title">${character.name}</h5>
                    <p class="card-text">Raza: ${character.race}</p>
                    <p class="card-text">Género: ${character.gender}</p>
                </div>
            </div>
        `;

        container.appendChild(card);
    });
}

// Modal que se abre al hacer clic en una tarjeta
async function showCharacterDetails(id) {
    try {
        const response = await fetch(`https://dragonball-api.com/api/characters/${id}`);
        if (!response.ok) throw new Error("No se pudo obtener información del personaje");

        const character = await response.json();

        // Insertamos los datos en el modal
        document.getElementById("modal-image").src = character.image;
        document.getElementById("modal-name").textContent = character.name;
        document.getElementById("modal-race").textContent = character.race || "Desconocido";
        document.getElementById("modal-gender").textContent = character.gender || "Desconocido";
        document.getElementById("modal-planet").textContent = character.originPlanet || "No especificado";
        document.getElementById("modal-description").textContent = character.description || "No hay descripción disponible";

        // Mostrar el modal
        const modal = new bootstrap.Modal(document.getElementById('characterModal'));
        modal.show();
    } catch (error) {
        alert("Error al obtener detalles del personaje");
    }
}

// Scroll infinito (bonus)
function handleScroll() {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        fetchCharacters();
    }
}
