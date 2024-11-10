let currentPokemon = null;
let selectedGenerations = [];
let counter = 0;
let points = 0;
let data = null;
let availablePokemon = [];

function filterAvailablePokemon() {
    if (selectedGenerations.length > 0) {
        availablePokemon = data.filter(pokemon => 
            selectedGenerations.includes(pokemon.generation) && 
            pokemon.pokedex_id !== 0 && 
            pokemon.name.fr !== "MissingNo."
        );
    } else {
        availablePokemon = data.filter(pokemon => 
            pokemon.pokedex_id !== 0 && 
            pokemon.name.fr !== "MissingNo."
        );
    }
}

function toggleGeneration(generation, buttonElement) {
    const index = selectedGenerations.indexOf(generation);
    if (index === -1) {
        selectedGenerations.push(generation);
        buttonElement.classList.add("selected");
    } else {
        selectedGenerations.splice(index, 1);
        buttonElement.classList.remove("selected");
    }
    if (selectedGenerations.length > 0) {
        document.getElementById("all").classList.remove("selected");
    }
    filterAvailablePokemon();
    showPokemon();
}

document.getElementById("gen1").addEventListener("click", (event) => toggleGeneration(1, event.target));
document.getElementById("gen2").addEventListener("click", (event) => toggleGeneration(2, event.target));
document.getElementById("gen3").addEventListener("click", (event) => toggleGeneration(3, event.target));
document.getElementById("gen4").addEventListener("click", (event) => toggleGeneration(4, event.target));
document.getElementById("gen5").addEventListener("click", (event) => toggleGeneration(5, event.target));
document.getElementById("gen6").addEventListener("click", (event) => toggleGeneration(6, event.target));
document.getElementById("gen7").addEventListener("click", (event) => toggleGeneration(7, event.target));
document.getElementById("gen8").addEventListener("click", (event) => toggleGeneration(8, event.target));
document.getElementById("gen9").addEventListener("click", (event) => toggleGeneration(9, event.target));

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
    filterAvailablePokemon();
    showPokemon();
});

const inputPokemon = document.getElementById("inputPoke");

inputPokemon.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        quizz();
    }
});

async function getRandomPokeImg() {
    if (!data) {
        const response = await fetch("https://tyradex.vercel.app/api/v1/pokemon");
        data = await response.json();
        filterAvailablePokemon();
    }

    if (availablePokemon.length === 0) {
        if (selectedGenerations.length === 0) {
            alert("Aucune génération sélectionnée.");
            return null;
        }
        resetQuizz();
        return getRandomPokeImg();
    }

    const randomIndex = Math.floor(Math.random() * availablePokemon.length);
    currentPokemon = availablePokemon[randomIndex];
    availablePokemon.splice(randomIndex, 1);
    
    return currentPokemon.sprites.regular;
}

async function showPokemon() {
    const prop = document.getElementById("proposition");
    const randomPokeImg = await getRandomPokeImg();
    if (randomPokeImg) {
        prop.innerHTML = `<img src="${randomPokeImg}" alt="Image du Pokémon">`;
    } else {
        prop.innerHTML = `<p>Aucun Pokémon disponible. Veuillez sélectionner une génération.</p>`;
    }
}

function removeAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function quizz() {
    if (!currentPokemon) return;

    let message = document.querySelector("#reponse");
    const inputPokemon = document.getElementById("inputPoke");

    const userAnswer = removeAccents(inputPokemon.value.toLowerCase());
    const correctAnswer = removeAccents(currentPokemon.name.fr.toLowerCase());

    if (userAnswer === correctAnswer) {
        message.innerHTML = `<p>Bravo, il s'agissait bien de ${currentPokemon.name.fr} !</p>`;
        points++;
    } else {
        message.innerHTML = `<p>Non, la bonne réponse était ${currentPokemon.name.fr}.</p>`;
    }
    counter++;
    inputPokemon.value = "";
    updateScore();

    if (availablePokemon.length === 0) {
        message.innerHTML += `<p>Vous avez vu tous les Pokémon des générations sélectionnées, votre score final est de ${points}/${counter}</p>
                              <p>Appuyez sur Rejouer pour recommencer.</p>`;
        document.getElementById("btnValiderPoke").disabled = true;
        document.getElementById("inputPoke").disabled = true;
    } else {
        showPokemon();
    }
}

function updateScore() {
    const scoreElement = document.getElementById("score");
    scoreElement.innerHTML = `${points}/${counter}`;  
}

let ValiderPoke = document.getElementById("btnValiderPoke");
ValiderPoke.addEventListener("click", quizz);

function resetQuizz() {
    counter = 0;
    points = 0;
    updateScore();
    filterAvailablePokemon();
    document.querySelector("#reponse").innerHTML = "";
    document.getElementById("btnValiderPoke").disabled = false;
    document.getElementById("inputPoke").disabled = false;
    showPokemon();
}

document.getElementById("resetButton").addEventListener("click", resetQuizz);

showPokemon();