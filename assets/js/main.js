const pokemonList = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('loadMoreButton');

const MAX_RECORDS = 151;
const LIMIT = 10;
let currentOffset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${String(pokemon.number).padStart(3, '0')}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>
                <img src="${pokemon.photo}" alt="${pokemon.name}">
            </div>
        </li>
    `;
}

async function loadPokemonItems(offset, limit) {
    try {
        const pokemons = await pokeApi.getPokemons(offset, limit);
        const newHtml = pokemons.map(convertPokemonToLi).join('');
        pokemonList.innerHTML += newHtml;
    } catch (error) {
        console.error('Falha ao carregar itens de Pokémon:', error);
    }
}

loadPokemonItems(currentOffset, LIMIT);

loadMoreButton.addEventListener('click', async () => {
    currentOffset += LIMIT;
    const recordsWithNextPage = currentOffset + LIMIT;

    if (recordsWithNextPage >= MAX_RECORDS) {
        const newLimit = MAX_RECORDS - currentOffset;
        await loadPokemonItems(currentOffset, newLimit);
        loadMoreButton.parentElement.removeChild(loadMoreButton);
    } else {
        await loadPokemonItems(currentOffset, LIMIT);
    }
});