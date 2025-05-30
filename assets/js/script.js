let currentPage = 1;
const limit = 9; // Número de personajes por página

document.addEventListener("DOMContentLoaded", () => {
    fetchCharacters();
    window.addEventListener("scroll", handleScroll);
});

document.getElementById("search-btn").addEventListener("click", () => {
    currentPage = 1;
    document.getElementById("characters-container").innerHTML = "";
    fetchCharacters();
});

async function fetchCharacters() {
    const searchValue = document.getElementById("search").value.trim();
    let url = `https://dragonball-api.com/api/characters?page=${currentPage}&limit=${limit}`;
    
    if (searchValue) {
        url = `https://dragonball-api.com/api/characters?name=${encodeURIComponent(searchValue)}`;
    }

    document.getElementById("loading").style.display = "block";

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Error al consultar la API");

        const data = await response.json();
        displayCharacters(data.items);
        currentPage++;
    } catch (error) {
        alert(error.message);
    } finally {
        document.getElementById("loading").style.display = "none";
    }
}

function displayCharacters(characters) {
    const container = document.getElementById("characters-container");

    if (characters.length === 0) {
        container.innerHTML = "<p class='text-center'>No se encontraron personajes.</p>";
        return;
    }

    characters.forEach(character => {
        const card = document.createElement("div");
        card.classList.add("col-md-4");

        card.innerHTML = `
            <div class="card">
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

function handleScroll() {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        fetchCharacters();
    }
}