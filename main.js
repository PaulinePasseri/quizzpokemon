let currentPokemon = null
let ValiderPoke = document.getElementById("btnValiderPoke")
ValiderPoke.addEventListener("click", () => {
    quizz()
    showPokemon()
})

async function getRandomPokeImg () {
    const response = await fetch("https://tyradex.vercel.app/api/v1/pokemon");
    const data = await response.json();
    const randomIndex = Math.floor(Math.random() * data.length);
    currentPokemon = data[randomIndex]
    let randomPokeImg = currentPokemon.sprites.regular;
    return randomPokeImg
}

async function showPokemon () {
    const prop = document.getElementById("proposition")
    const randomPokeImg = await getRandomPokeImg()
    prop.innerHTML = `<img src="${randomPokeImg}" alt = "Image du Pokémon">`
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
}

showPokemon()