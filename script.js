
let pokemon = "";

// Elementos HTML

const searchBox = document.getElementsByClassName("search-box")[0];
const searchButton = document.getElementsByClassName("search-button")[0];
const resultDiv = document.getElementsByClassName("result")[0];
const lights = document.getElementsByClassName("pokedex-lights-sm-light");
const pokemonImg = document.getElementsByClassName("pokedex-screen-image")[0];
const pokemonName = document.getElementsByClassName("pokemon-name")[0];
const pokemonTypes = document.getElementsByClassName("pokemon-types")[0];
const pokemonHP = document.getElementById("hp");
const pokemonAttack = document.getElementById("attack");
const pokemonDefense = document.getElementById("defense");
const pokemonSpeed = document.getElementById("speed");

// Sonidos Pokedex
const UPDATE_SOUND = new Audio(
  "https://s3-us-west-2.amazonaws.com/s.cdpn.io/605876/pokedex.mp3"
);
const PRESS_SOUND = new Audio(
  "https://freesound.org/data/previews/467/467552_9892063-lq.mp3"
);

// EventListener para el click

searchButton.addEventListener("click", function () {
  runSearch();
});

// EventListener para la tecla Enter

searchBox.addEventListener("keypress", function (e) {
  if (e.which == 13) {
    runSearch();
  }
});

// Iniciar busqueda

function runSearch() {
  clearPokemon();

  pokemon = searchBox.value.toLowerCase();
  searchBox.value = "";

  // Iniciar las luces
  for (let i = 0; i < lights.length; i++) {
    lights[i].classList.add("blink");
  }

  pokemonName.innerHTML = "Cargando...";
  PRESS_SOUND.play();
  UPDATE_SOUND.play();

  // Consulta al API
  setTimeout(function () {
    const url = "https://pokeapi.co/api/v2/pokemon/";
    let fullURL = url + pokemon;

    fetch(fullURL)
      .then((response) => {
        if (!response.ok) {
          //No se encontró Pokemon
          displayError();
        }

        return response.json();

        // Se encontró Pokemon
      })
      .then(displayPokemon);
  }, 1500);
}

// Caso en el que no se encontró Pokemon

function displayError() {
  // Detener las luces
  for (let i = 0; i < lights.length; i++) {
    lights[i].classList.remove("blink");
  }

  clearPokemon();
  pokemonName.innerHTML = "¡No se encontró tu Pokemon!";
}

// Caso en el que sí se encontró Pokemon

function displayPokemon(result) {
  // Detener las luces
  for (let i = 0; i < lights.length; i++) {
    lights[i].classList.remove("blink");
  }

  // Limpiar resultados previos
  clearPokemon();

  let name = result.name.charAt(0).toUpperCase() + result.name.substring(1);
  let hp = result.stats[5].base_stat;
  let attack = result.stats[4].base_stat;
  let defense = result.stats[3].base_stat;
  let speed = result.stats[0].base_stat;

  pokemonImg.src = result.sprites["front_default"];
  pokemonName.innerHTML = name + "  #" + result.id;
  pokemonHP.innerHTML = "HP:" + hp;
  pokemonAttack.innerHTML = "ATAQUE:" + attack;
  pokemonDefense.innerHTML = "DEFENSA:" + defense;
  pokemonSpeed.innerHTML = "VELOCIDAD:" + speed;

  // Ciclo For para pokemones con más de dos tipos
  for (let i = 0; i < result.types.length; i++) {
    let li = document.createElement("li");
    li.classList.add("pokemon-type");
    li.innerHTML = result.types[i].type.name;
    pokemonTypes.appendChild(li);
  }
}

// Función de limpiar Pokedex

function clearPokemon() {
  pokemonImg.src = "";
  pokemonName.innerHTML = "";
  pokemonTypes.innerHTML = "";
  pokemonHP.innerHTML = "";
  pokemonAttack.innerHTML = "";
  pokemonDefense.innerHTML = "";
  pokemonSpeed.innerHTML = "";
}
