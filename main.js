let currentPokemon = null;
let selectedGenerations = [];
let counter = 0;
let points = 0;
let data = null;
let availablePokemon = [];

// Filtrer les Pokémon disponibles en fonction des générations sélectionnées
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

// Choix d'une ou plusieurs générations
function toggleGeneration(generation, buttonElement) {
    points = 0;
    counter = 0;
    updateScore(); 

    const index = selectedGenerations.indexOf(generation);
    
    if (index === -1) {
        selectedGenerations.push(generation);
        buttonElement.classList.add("selected");
    } else {
        selectedGenerations.splice(index, 1);
        buttonElement.classList.remove("selected");
    }

    const allButton = document.getElementById("all");
    if (selectedGenerations.length === 9) {
        allButton.classList.add("selected");
    } else {
        allButton.classList.remove("selected");
    }

    availablePokemon = [];
    filterAvailablePokemon(); 
    showPokemon(); 
}

// Gérer le bouton "Toutes"
function handleAllGenerations() {
    const allButton = document.getElementById("all");
    const genButtons = document.querySelectorAll(".btnSelectGen:not(#all)");

    if (selectedGenerations.length === 9) {
        // Désélectionner toutes les générations
        selectedGenerations = [];
        allButton.classList.remove("selected");
        genButtons.forEach(button => button.classList.remove("selected"));
    } else {
        // Sélectionner toutes les générations
        selectedGenerations = Array.from({ length: 9 }, (_, i) => i + 1);
        allButton.classList.add("selected");
        genButtons.forEach(button => button.classList.add("selected"));
    }

    points = 0;
    counter = 0;
    updateScore();
    filterAvailablePokemon();
    showPokemon();
}

// Écouteurs d'événements pour les clics et les touchés
const generationButtons = document.querySelectorAll(".btnSelectGen"); // Sélectionner tous les boutons de génération

generationButtons.forEach(button => {
    button.addEventListener("pointerdown", (event) => {
        event.stopPropagation(); // Empêcher la propagation à d'autres éléments
        if (button.id === "all") {
            handleAllGenerations(); // Gérer le bouton "Toutes"
        } else {
            toggleGeneration(parseInt(button.id.replace('gen', '')), button); // Gérer la sélection d'une génération
        }
    });
});

// Sélectionne une image de Pokémon aléatoirement 
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

// Affiche l'image du pokémon
async function showPokemon() {
    const prop = document.getElementById("proposition");
    const randomPokeImg = await getRandomPokeImg();
    
    if (randomPokeImg) {
        prop.innerHTML = `<img src="${randomPokeImg}" alt="Image du Pokémon">`;
    } else {
        prop.innerHTML = `<p>Aucun Pokémon disponible. Veuillez sélectionner une génération.</p>`;
    }
}

// Retrait des accents et symboles 
function removeGenderSymbols(pokemonName) {
    return pokemonName.replace(/[♂♀]/g, '');
}

function removeAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function quizz() {
    if (!currentPokemon) return;

    let message = document.querySelector("#reponse");
    const inputPokemon = document.getElementById("inputPoke");

    const userAnswer = removeAccents(removeGenderSymbols(inputPokemon.value.toLowerCase()));
    const correctAnswer = removeAccents(removeGenderSymbols(currentPokemon.name.fr.toLowerCase()));
    
    let isCorrect = userAnswer === correctAnswer;
    
    if (isCorrect) {
        points++;
    }
    
    counter++;
    
    updateScore();

    if (isCorrect) {
        message.innerHTML = `<p><strong>Correct</strong>, la bonne réponse est ${currentPokemon.name.fr} ! <br>Votre score : ${points}/${counter}</p>`;
    } else {
        message.innerHTML = `<p><strong>Faux</strong>, la bonne réponse est ${currentPokemon.name.fr}. <br>Votre score : ${points}/${counter}</p>`;
    }

    inputPokemon.value = ""; 

    if (availablePokemon.length === 0) {
        message.innerHTML += `<p>Bravo vous avez vu tous les Pokémon des générations sélectionnées ! Votre score final est de ${points}/${counter} !</p>
                              <p>Appuyez sur Rejouer pour recommencer.</p>`;
                              
        document.getElementById("btnValiderPoke").disabled = true;
        document.getElementById("inputPoke").disabled = true;
        
    } else {
        showPokemon(); 
    }
}

function updateScore() {
   const scoreElement = document.getElementById("scoreDisplay"); 
   if (scoreElement) {
       scoreElement.innerHTML = `${points}/${counter}`;
   }
}

// Validation par Entrée
const inputPokemon = document.getElementById("inputPoke");

inputPokemon.addEventListener("keydown", (event) => {
   if (event.key === "Enter") {
       quizz();
   }
});

// Validation manuelle
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

// Afficher un Pokémon au démarrage
showPokemon();