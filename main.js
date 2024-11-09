let currentPokemon = null
let selectedGenerations = []

// Fonction pour gérer la sélection de génération
function toggleGeneration(generation) {
    const index = selectedGenerations.indexOf(generation);
    if (index === -1) {
        selectedGenerations.push(generation); // Ajouter si non sélectionné
    } else {
        selectedGenerations.splice(index, 1); // Retirer si déjà sélectionné
    }
}

// Ajouter des événements pour chaque bouton de génération
document.getElementById("gen1").addEventListener("click", () => toggleGeneration(1));
document.getElementById("gen2").addEventListener("click", () => toggleGeneration(2));
document.getElementById("gen3").addEventListener("click", () => toggleGeneration(3));
document.getElementById("gen4").addEventListener("click", () => toggleGeneration(4));
document.getElementById("gen5").addEventListener("click", () => toggleGeneration(5));
document.getElementById("gen6").addEventListener("click", () => toggleGeneration(6));
document.getElementById("gen7").addEventListener("click", () => toggleGeneration(7));
document.getElementById("gen8").addEventListener("click", () => toggleGeneration(8));
document.getElementById("gen9").addEventListener("click", () => toggleGeneration(9));

// Bouton pour sélectionner toutes les générations
document.getElementById("all").addEventListener("click", () => {
    selectedGenerations = Array.from({ length: 9 }, (_, i) => i + 1); 
});

// Bouton pour valider la sélection des générations
document.getElementById("validateSelection").addEventListener("click", () => {
    if (selectedGenerations.length > 0) {
        showPokemon();  
    } else {
        alert("Veuillez sélectionner au moins une génération !");
    }
});


let ValiderPoke = document.getElementById("btnValiderPoke")
ValiderPoke.addEventListener("click", () => {
    quizz()
    showPokemon()
})

// Fonction pour obtenir une image aléatoire d'un Pokémon en fonction des générations sélectionnées
async function getRandomPokeImg() {
    const response = await fetch("https://tyradex.vercel.app/api/v1/pokemon");
    const data = await response.json();

    // Filtrer les Pokémon en fonction des générations sélectionnées
    let filteredData = data;
    if (selectedGenerations.length > 0) {
        filteredData = data.filter(pokemon => selectedGenerations.includes(pokemon.generation));
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


function quizz () { 
    let message = document.querySelector("#reponse")
    const inputPokemon = document.getElementById("inputPoke")
    if (inputPokemon.value.toLowerCase() === currentPokemon.name.fr.toLowerCase()) {
        console.log("C'était bien " + currentPokemon.name.fr)
        message.innerHTML = `<p>Bravo il s'agissait bien de ${currentPokemon.name.fr} !</p>`
    } else {
        console.log("Non c'était " + currentPokemon.name.fr)
        message.innerHTML = `<p>Non la bonne réponse était ${currentPokemon.name.fr}</p>`
    }
    inputPokemon.value = ""
}



showPokemon()