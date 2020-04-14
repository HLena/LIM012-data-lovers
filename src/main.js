/* eslint-disable no-unused-vars */
/* eslint-disable no-loop-func */
/* eslint-disable no-undef */
/* eslint-disable no-param-reassign */

import {
  dinamicSearchPokemon, filterPokemon, sortBy, changeOrder, calculateBetterCombinations,
} from './data.js';

import data from './data/pokemon/pokemon.js';

const typeColors = {
  normal: '#AAA284',
  fire: '#FF9C06',
  grass: '#95C215',
  water: '#168CBF',
  electric: '#F4C313',
  ice: '#85EFF5',
  flying: '#20E5F1',
  poison: '#C22AF8',
  ground: '#AB8709',
  psychic: '#F013F4',
  rock: '#C9AF53',
  bug: '#4C6C2C',
  dragon: '#731E9B',
  ghost: '#8968AA',
  dark: '#6C695C',
  steel: '#9DAFC0',
  fairy: '#FAB3E2',
  fighting: '#BD5022',
};

let currentData = [];
const dataFiltered = [[], [], []];
const optionsToFilter = ['type', 'resistant', 'weaknesses'];
let isFlexContainer = true;
let typeChoosed = '';
const responsiveSize = 800;

const getById = label => document.getElementById(label);
const getByClass = label => document.getElementsByClassName(label);
const getByQuery = label => document.querySelector(label);
const getByQueryAll = label => document.querySelectorAll(label);
const display = (element, state) => { element.style.display = state; };

// contenedores div
const cardContainer = getById('cards-container');
const carouselsContainer = getById('carousels-container');
const modalWindow = getById('modal-window');

// botones
const goBackBtn = getByQuery('#back-btn');
const goUpBtn = getById('arrow-up-btn');
const menuBtn = getById('menu-btn');
const homeBtn = getById('home-btn');
const closeModalBtn = getById('close-modal');

const titleContainer = getByQuery('.title-container');
let ascendent;
const sortBtn = getById('btn-sort');


// variables para manejar el carrusel de tarjetas
const carouselContainer = getByQueryAll('.carousel-container');
const ctrlLeft = getByQueryAll('.control-left');
const ctrlRight = getByQueryAll('.control-right');
const titlesCarousel = getByQueryAll('h3.title-carousel');

// link to see all
const linksSeeAll = getByQueryAll('.see-all');

// barra de busqueda
const inputBarSearch = getById('input-search');

// elementos para manejar el menu
const ulFilter = getByQuery('.ul-filter');
const ulSort = getByQuery('.ul-sort');
let dotsList;

// To modal effect
const modalMode = getById('modal-mode');

menuBtn.addEventListener('click', (event) => {
  const menu = getById('menu');
  if (menu.style.left < '0') {
    menu.style.left = '0px';
    event.target.classList.replace('fa-bars', 'fa-times');
  } else {
    menu.style.left = '-280px';
    event.target.classList.replace('fa-times', 'fa-bars');
  }
});

const divMain = (value) => {
  if (value) {
    display(cardContainer, 'none');
    display(carouselsContainer, 'block');
    isFlexContainer = false;
  } else {
    display(carouselsContainer, 'none');
    display(cardContainer, 'flex');
    isFlexContainer = true;
  }
};

const createPokemonType = (type) => {
  const divPokemonType = document.createElement('div');
  divPokemonType.className = 'pokemon-type font text-aling';
  divPokemonType.appendChild(document.createTextNode(type));
  divPokemonType.style.background = typeColors[type];
  return divPokemonType;
};

const putPokemonTypes = (dataTypesPokemon, divCardTypes) => {
  for (let i = 0; i < dataTypesPokemon.length; i += 1) {
    divCardTypes.appendChild(createPokemonType(dataTypesPokemon[i]));
  }
};

const createPokemonCard = (index, pokemon, container) => {
  if (typeof pokemon !== 'undefined') {
    const card = document.createElement('div');
    card.setAttribute('name', pokemon.name);
    card.className = 'pokemon-card flex-wrap font grow';
    card.id = pokemon.name;
    card.innerHTML = `<span class="pokemon-name">${pokemon.name}</span>
                      <span class="pokemon-cp-hp">MAX CP ${pokemon.stats['max-cp']} / MAX HP ${pokemon.stats['max-cp']}</span>              
                      <img class="pokemon-img-medium" src="${pokemon.img}">
                      <span class= "pokemon-about text-aling" > ${pokemon.about}</span>`;
    putPokemonTypes(pokemon.type, card);
    container.append(card);
  }
};

const showCard = (dataPokemon, container) => {
  container.innerHTML = '';
  for (let i = 0; i < dataPokemon.length; i += 1) {
    createPokemonCard(i, dataPokemon[i], container);
  }
};

goBackBtn.addEventListener('click', () => {
  titleContainer.style.visibility = 'hidden';
  sortBtn.style.visibility = 'hidden';
  divMain(true);
});

homeBtn.addEventListener('click', () => {
  if (isFlexContainer === false) divMain(false);
  titleContainer.style.visibility = 'hidden';
  sortBtn.style.visibility = 'hidden';
  currentData = data.pokemon;
  showCard(currentData, cardContainer);
});


/* System to search a pokemon by name or first letter */
const searchSystem = () => {
  if (isFlexContainer === false) divMain(false);
  const wordIntroduced = getById('input-search').value;
  currentData = dinamicSearchPokemon(wordIntroduced);
  if (currentData.length > 0) {
    showCard(currentData, cardContainer);
  } else if (currentData.length === 0 && wordIntroduced.length !== 0) {
    cardContainer.innerHTML = `<p class="message font text-aling">
    Sorry, no results were found for your search <span class="import-text font">${wordIntroduced}</span> make sure it is well written
    </p>`;
  } else {
    currentData = data.pokemon;
    showCard(currentData, cardContainer);
  }
};

/* carousel system */
const carouselSystem = () => {
  for (let index = 0; index < carouselContainer.length; index += 1) {
    ctrlLeft[index].addEventListener('click', () => {
      carouselContainer[index].scrollLeft -= carouselContainer[index].offsetWidth;
    });
    ctrlRight[index].addEventListener('click', () => {
      carouselContainer[index].scrollLeft += carouselContainer[index].offsetWidth;
    });
    linksSeeAll[index].addEventListener('click', () => {
      titleContainer.querySelector('#title-span').textContent = titlesCarousel[index].textContent;
      titleContainer.style.visibility = 'visible';
      divMain(false);
      showCard(dataFiltered[index], cardContainer);
    });
  }
};

/* event that call to searchSystem when there is an input */
inputBarSearch.addEventListener('keyup', searchSystem);

const onlyText = (e) => {
  const key = e.keyCode || e.which;
  const tecla = String.fromCharCode(key).toLowerCase();
  const letras = ' áéíóúabcdefghijklmnñopqrstuvwxyz';
  if (letras.indexOf(tecla) === -1) {
    e.preventDefault();
  }
};

inputBarSearch.addEventListener('keypress', onlyText, false);

/* -------- muestra pokemones despues del filrtado por tipo -----------*/

const showRecommendedPokemons = () => {
  const carousels = getByQueryAll('.carousel');
  for (let i = 0; i < carousels.length; i += 1) {
    carousels[i].innerHTML = '';
    if (dataFiltered[i].length > 0) {
      showCard(dataFiltered[i], carousels[i]);
    } else {
      ctrlLeft[i].style.visibility = 'hidden';
      ctrlRight[i].style.visibility = 'hidden';
      linksSeeAll[i].style.visibility = 'hidden';
      // carousels[i].style.visibility = 'hidden';
    }
  }
};

const filterPokemonsByType = (type) => {
  const quantity = getByQueryAll('.num');
  const title = getByQueryAll('.type-choosed');
  for (let index = 0; index < optionsToFilter.length; index += 1) {
    dataFiltered[index] = filterPokemon(optionsToFilter[index], type);
    quantity[index].textContent = dataFiltered[index].length;
    title[index].textContent = type;
  }
};


let checked;
const filterSystem = () => {
  ulFilter.addEventListener('click', (event) => {
    if (event.target.className === 'li-filter') {
      titleContainer.style.visibility = 'hidden';
      sortBtn.style.visibility = 'hidden';
      if (isFlexContainer) divMain(true);
      typeChoosed = event.target.textContent;
      filterPokemonsByType(typeChoosed);
      showRecommendedPokemons();
      if (window.screen.width < responsiveSize) {
        dotsList = ulFilter.querySelectorAll('i.fa-circle');
        dotsList.forEach((element) => { if (element.className === 'fas fa-circle selected') checked = element; });
        if (checked !== undefined) checked.classList.remove('selected');
        const i = event.target.querySelector('i');
        i.classList.add('selected');
      }
    }
  });
};

// revisando codigo
const sortRecomnendedPokemons = (option) => {
  dataFiltered.forEach((dataFilter) => {
    dataFilter = sortBy(dataFilter, option);
  });
  showRecommendedPokemons();
};

sortBtn.addEventListener('click', () => {
  if (ascendent) {
    if (sortBtn.classList.contains('fa-sort-alpha-down')) {
      sortBtn.classList.replace('fa-sort-alpha-down', 'fa-sort-alpha-up');
      sortBtn.setAttribute('title', 'reverse alphabetical');
    } else {
      sortBtn.classList.replace('fa-sort-amount-down-alt', 'fa-sort-amount-up-alt');
      sortBtn.setAttribute('title', 'Descending Order');
    }
    ascendent = false;
  } else if (ascendent === false) {
    if (sortBtn.classList.contains('fa-sort-alpha-up')) {
      sortBtn.classList.replace('fa-sort-alpha-up', 'fa-sort-alpha-down');
      sortBtn.setAttribute('title', 'alphabetical order');
    } else {
      sortBtn.classList.replace('fa-sort-amount-up-alt', 'fa-sort-amount-down-alt');
      sortBtn.setAttribute('title', 'Ascending Order');
    }
    ascendent = true;
  }
  currentData = changeOrder(currentData);
  showCard(currentData, cardContainer);
});

const sortSystem = () => {
  ulSort.addEventListener('click', (event) => {
    if (event.target.className === 'li-sort') {
      if (isFlexContainer) {
        currentData = sortBy(currentData, event.target.textContent);
        // titleContainer.style.visibility = 'visible';
        showCard(currentData, cardContainer);
        sortBtn.className = 'grow cursor fas';
        ascendent = true;
        if (event.target.textContent === 'alphabethic') {
          sortBtn.classList.add('fa-sort-alpha-down');
          sortBtn.setAttribute('title', 'alphabetical order');
        } else {
          sortBtn.classList.add('fa-sort-amount-down-alt');
          sortBtn.setAttribute('title', 'Ascending Order');
        }
        sortBtn.style.visibility = 'visible';
      } else sortRecomnendedPokemons(event.target.textContent);

      if (window.screen.width < responsiveSize) {
        dotsList = ulSort.querySelectorAll('i.fa-circle');
        dotsList.forEach((element) => { if (element.className === 'fas fa-circle selected') checked = element; });
        if (checked !== undefined) checked.classList.remove('selected');
        const i = event.target.querySelector('i');
        i.classList.add('selected');
      }
    }
  });
};


const createIconType = (type) => {
  const iconType = document.createElement('img');
  iconType.className = 'icon-type-modal';
  iconType.setAttribute('src', `images/${type}-icon.png`);
  return iconType;
};

const showEvolution = (poke, container, prev, next) => {
  container.innerHTML = '';
  let divContainer; let pokemon;
  if (prev !== undefined) {
    for (let i = 0; i < prev.length; i += 1) {
      pokemon = data.pokemon.find(pk => pk.name === prev[i].name);
      if (pokemon !== undefined) {
        divContainer = document.createElement('div');
        divContainer.className = 'card-pokemon-evolition';
        divContainer.innerHTML = `<span class="font one-fraction ">${pokemon.name}</span>
                                  <img src="${pokemon.img}" alt="" class="img-modal">`;
        container.append(divContainer);
      }
    }
  }
  divContainer = document.createElement('div');
  divContainer.className = 'card-pokemon-evolition';
  divContainer.innerHTML = `<span class="font one-fraction ">${poke.name}</span>
                            <img src="${poke.img}" alt="" class="img-modal">`;
  container.append(divContainer);

  if (next !== undefined) {
    for (let i = 0; i < next.length; i += 1) {
      pokemon = data.pokemon.find(pk => pk.name === next[i].name);
      if (pokemon !== undefined) {
        divContainer = document.createElement('div');
        divContainer.className = 'card-pokemon-evolition';
        divContainer.innerHTML = `<span class="font one-fraction">${pokemon.name}</span>
                                  <img src="${pokemon.img}" alt="" class="img-modal">`;
        container.append(divContainer);
      }
    }
  }
};

const createIcons = (list, container) => {
  for (let i = 0; i < list.length; i += 1) {
    container.append(createIconType(list[i]));
  }
};

const buildTable = (list, table) => {
  table.innerHTML = '';
  table.innerHTML = `<tr><th></th>
                    <th><img class="icon-modal" src="images/type.png"></th>
                    <th><img class="icon-modal" src="images/box.png"></th>
                    <th><img class="icon-modal" src="images/energy.png"></th>
                    <th><img class="icon-modal" src="images/time.png"></tr>`;
  for (let i = 0; i < list.length; i += 1) {
    const row = `<tr><td>${list[i].name}</td>
                    <td><img class="icon-type-modal" src="/images/${list[i].type}-icon.png"></td>
                    <td>${list[i]['base-damage']}</td>
                    <td>${list[i].energy}</td>
                    <td>${list[i]['move-duration-seg']}</td></tr>`;
    table.innerHTML += `${row}`;
  }
};
const divMoveAndAttacks = getById('move-and-attack');
const divcalculateMove = getById('calculate-damage');

const showDamageOfMove = (btn) => {
  if (btn.name === 'calculate') {
    divMoveAndAttacks.style.display = 'none';
    divcalculateMove.style.display = 'block';
    btn.textContent = 'Moves & Attacks';
    btn.name = 'moves';
  } else {
    divMoveAndAttacks.style.display = 'flex';
    divcalculateMove.style.display = 'none';
    btn.textContent = 'Calculate Damage';
    btn.name = 'calculate';
  }
};
// let isCalculate = false;
const calculeDamage = (container, list) => {
  container.innerHTML = '';
  container.innerHTML += '<tr><th>Quick Move</th><th></th><th>Special Attack</th><th></th><th>Damage</th></tr>';
  for (let i = 0; i < list.length; i += 1) {
    container.innerHTML += `<tr><td>${list[i][0]}</td><td><img src="images/plus1.png" class="icon-modal"></td>
                            <td>${list[i][1]}</td><td><img src="images/igual1.png" class="icon-modal"></td>
                            <td>${list[i][2]}</td></tr>`;
  }
};

const btnCalc = getById('btn-calculate');
btnCalc.addEventListener('click', () => {
  showDamageOfMove(btnCalc);
});

const showInfoPokemon = (name) => {
  modalWindow.style.display = 'block';
  const pokemon = data.pokemon.find(pk => pk.name === name);
  getById('img-pokemon-modal').setAttribute('src', pokemon.img);
  getById('pokemon-name-modal').textContent = pokemon.name;
  getById('value-height').textContent = pokemon.size.height;
  getById('value-candy').textContent = pokemon.evolution.candy.replace('candy', '');
  getById('value-region').textContent = pokemon.generation.name;
  getById('value-weight').textContent = pokemon.size.weight;
  const types = getById('types');
  const resistant = getById('resistant');
  const weaknesses = getById('weaknesses');
  types.innerHTML = '';
  resistant.innerHTML = '';
  weaknesses.innerHTML = '';
  createIcons(pokemon.type, types);
  createIcons(pokemon.resistant, resistant);
  createIcons(pokemon.weaknesses, weaknesses);
  const specialAttacks = getById('special-attacks-table');
  const quickMove = getById('quick-move-table');
  const calcDamage = getById('table-damage');
  calcDamage.innerHTML = '';
  calculeDamage(calcDamage, calculateBetterCombinations(pokemon));
  buildTable(pokemon['special-attack'], specialAttacks);
  buildTable(pokemon['quick-move'], quickMove);
  const evolution = getById('evolution');
  showEvolution(pokemon, evolution, pokemon.evolution['prev-evolution'], pokemon.evolution['next-evolution']);
};

const menuSystem = () => {
  sortSystem();
  filterSystem();
};

const loadPage = () => {
  window.scrollTo(0, 0);
  currentData = data.pokemon;
  menuSystem();
  showCard(currentData, cardContainer);
};

document.addEventListener('click', (event) => {
  // console.log(event.target.className);
  if (event.target.className === 'pokemon-card flex-wrap font grow') {
    modalMode.style.display = 'flex';
    divMoveAndAttacks.style.display = 'flex';
    divcalculateMove.style.display = 'none';
    btnCalc.name = 'calculate';
    btnCalc.textContent = 'Calculate Damage';
    showInfoPokemon(event.target.id);
  } else {
    const element = event.target.parentNode;
    if (element.className === 'pokemon-card flex-wrap font grow') {
      modalMode.style.display = 'flex';
      divMoveAndAttacks.style.display = 'flex';
      divcalculateMove.style.display = 'none';
      btnCalc.name = 'calculate';
      btnCalc.textContent = 'Calculate Damage';
      showInfoPokemon(element.id);
    }
  }
});


// ---------btn to go at top on the page-----------

window.addEventListener('scroll', () => {
  goUpBtn.style.visibility = (window.scrollY > 800) ? 'visible' : 'hidden';
  goUpBtn.addEventListener('click', () => {
    window.scrollTo(0, 0);
  });
});

carouselSystem();
window.onload = loadPage;
