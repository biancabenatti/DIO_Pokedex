const pokeApi = {};

pokeApi.convertPokeApiDetailToPokemon = (pokeDetail) => {
    const pokemon = new Pokemon();
    pokemon.number = pokeDetail.id;
    pokemon.name = pokeDetail.name;

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name);
    const [primaryType] = types;

    pokemon.types = types;
    pokemon.type = primaryType;

    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default ||
                    pokeDetail.sprites.front_default;
    
    return pokemon;
};

pokeApi.getPokemonDetail = async (pokemon) => {
    try {
        const response = await fetch(pokemon.url);
        const data = await response.json();
        return pokeApi.convertPokeApiDetailToPokemon(data);
    } catch (error) {
        console.error(`Erro ao buscar detalhes do Pokémon ${pokemon.name}:`, error);
        throw error;
    }
};

pokeApi.getPokemons = async (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;

    try {
        const response = await fetch(url);
        const jsonBody = await response.json();
        const results = jsonBody.results;

        const detailRequests = results.map(pokeApi.getPokemonDetail);
        const pokemonsDetails = await Promise.all(detailRequests);
        
        return pokemonsDetails;
    } catch (error) {
        console.error('Erro ao buscar lista de Pokémons:', error);
        return [];
    }
};