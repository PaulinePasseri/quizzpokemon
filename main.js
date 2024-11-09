let currentPokemon = null
let selectedGenerations = []

// Fonction pour gérer la sélection de génération
function toggleGeneration(generation, buttonElement) {
    const index = selectedGenerations.indexOf(generation);
    if (index === -1) {
        selectedGenerations.push(generation); 
        buttonElement.classList.add("selected"); 
    } else {
        selectedGenerations.splice(index, 1); 
        buttonElement.classList.remove("selected"); 
    }
    // Désélectionner le bouton "All" si des boutons individuels sont sélectionnés
    if (selectedGenerations.length > 0) {
        document.getElementById("all").classList.remove("selected");
    }
    showPokemon();
}

// Boutons Gen
document.getElementById("gen1").addEventListener("click", (event) => toggleGeneration(1, event.target));
document.getElementById("gen2").addEventListener("click", (event) => toggleGeneration(2, event.target));
document.getElementById("gen3").addEventListener("click", (event) => toggleGeneration(3, event.target));
document.getElementById("gen4").addEventListener("click", (event) => toggleGeneration(4, event.target));
document.getElementById("gen5").addEventListener("click", (event) => toggleGeneration(5, event.target));
document.getElementById("gen6").addEventListener("click", (event) => toggleGeneration(6, event.target));
document.getElementById("gen7").addEventListener("click", (event) => toggleGeneration(7, event.target));
document.getElementById("gen8").addEventListener("click", (event) => toggleGeneration(8, event.target));
document.getElementById("gen9").addEventListener("click", (event) => toggleGeneration(9, event.target));

// Bouton "All"
document.getElementById("all").addEventListener("click", () => {
    if (selectedGenerations.length === 9) {
        selectedGenerations = [];
        document.getElementById("all").classList.remove("selected");
    } else {
        selectedGenerations = Array.from({ length: 9 }, (_, i) => i + 1);
        document.getElementById("all").classList.add("selected");
        const buttons = document.querySelectorAll(".btnSelectGen");
        buttons.forEach(button => {
            if (button.id !== "all") {
                button.classList.remove("selected");
            }
        });
    }
    showPokemon();
});

// Ajouter la possibilité de valider la réponse en appuyant sur "Entrée"
const inputPokemon = document.getElementById("inputPoke");

inputPokemon.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        quizz();  
        showPokemon();
    }
});

// Fonction pour obtenir une image aléatoire d'un Pokémon en fonction des générations sélectionnées
async function getRandomPokeImg() {
    const response = await fetch("https://tyradex.vercel.app/api/v1/pokemon");
    const data = await response.json();

    // Filtrer les Pokémon en fonction des générations sélectionnées
    let filteredData = data;
    if (selectedGenerations.length > 0) {
        filteredData = data.filter(pokemon => selectedGenerations.includes(pokemon.generation));
    }
    if (filteredData.length === 0) {
        alert("Aucune génération sélectionnée.");
        return;
    }

    // Sélectionner un Pokémon aléatoire parmi ceux filtrés
    const randomIndex = Math.floor(Math.random() * filteredData.length);
    currentPokemon = filteredData[randomIndex];
    let randomPokeImg = currentPokemon.sprites.regular;
    return randomPokeImg;
}

// Afficher l'image du Pokémon sélectionné
async function showPokemon() {
    const prop = document.getElementById("proposition");
    const randomPokeImg = await getRandomPokeImg();
    prop.innerHTML = `<img src="${randomPokeImg}" alt="Image du Pokémon">`;
}

function quizz() { 
    let message = document.querySelector("#reponse");
    const inputPokemon = document.getElementById("inputPoke");
    if (inputPokemon.value.toLowerCase() === currentPokemon.name.fr.toLowerCase()) {
        message.innerHTML = `<p>Bravo, il s'agissait bien de ${currentPokemon.name.fr} !</p>`;
    } else {
        message.innerHTML = `<p>Non, la bonne réponse était ${currentPokemon.name.fr}.</p>`;
    }
    inputPokemon.value = ""; 
}

// Validation manuelle du quizz avec le bouton
let ValiderPoke = document.getElementById("btnValiderPoke");
ValiderPoke.addEventListener("click", () => {
    quizz();
    showPokemon(); 
});

showPokemon();
