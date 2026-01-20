// src/services/pokemon.js

// Función para obtener la lista inicial (incluyendo Gen 9 y variedades)
export async function getAllPokemon() {
    // 1025 es el total de especies, pero las variedades (Megas, Alola, G-Max) 
    // empiezan a partir del ID 10001. Aumentamos el límite para capturar más.
    const url = "https://pokeapi.co/api/v2/pokemon?limit=1300";

    try {
        let response = await fetch(url);
        let data = await response.json();
        return data.results;
    } catch (error) {
        console.error("Error fetching all Pokémon:", error);
        return [];
    }
}

// Función para obtener los detalles de un Pokémon específico (por URL)
export async function getPokemonDetails(url) {
    try {
        let response = await fetch(url);
        let data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching Pokémon details for URL:", url, error);
        return null;
    }
}

// Función para obtener los datos de la ESPECIE del Pokémon (incluye variedades y cadena de evolución URL)
export async function getPokemonSpecies(speciesUrlOrId) {
    try {
        const isUrl = typeof speciesUrlOrId === 'string' && speciesUrlOrId.startsWith('http');
        const speciesUrl = isUrl ? speciesUrlOrId : `https://pokeapi.co/api/v2/pokemon-species/${speciesUrlOrId}`;

        const response = await fetch(speciesUrl);
        if (!response.ok) throw new Error(`Species not found: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Error fetching species:", error);
        return null;
    }
}

// Función para obtener la cadena de evolución completa (ahora retorna también variedades)
export async function getEvolutionChain(speciesUrlOrId) {
    try {
        // 1. Obtener los datos de la ESPECIE
        const speciesData = await getPokemonSpecies(speciesUrlOrId);
        if (!speciesData) return null;

        // 2. Obtener la CADENA DE EVOLUCIÓN
        const evolutionChainUrl = speciesData.evolution_chain.url;
        const chainRes = await fetch(evolutionChainUrl);
        const chainData = await chainRes.json();

        // 3. Retornar ambo: la cadena y las variedades encontradas en speciesData
        return {
            chain: chainData.chain,
            varieties: speciesData.varieties || []
        };
    } catch (error) {
        console.error("Error fetching evolution data:", error);
        return null;
    }
}

// Función para obtener Pokémon por tipo
export async function getPokemonByType(type) {
    const url = `https://pokeapi.co/api/v2/type/${type}`;
    try {
        let response = await fetch(url);
        let data = await response.json();
        return data.pokemon.map(p => p.pokemon);
    } catch (error) {
        console.error("Error fetching Pokemon by type:", error);
        return [];
    }
}

// Función para obtener un mapa de todos los Pokémon y sus tipos
export async function getPokemonTypeMap(availableTypes) {
    try {
        const promises = availableTypes.map(type =>
            fetch(`https://pokeapi.co/api/v2/type/${type}`).then(res => res.json())
        );
        const results = await Promise.all(promises);

        const typeMap = {};
        results.forEach((data) => {
            const typeName = data.name;
            data.pokemon.forEach(p => {
                const pokemonName = p.pokemon.name;
                if (!typeMap[pokemonName]) {
                    typeMap[pokemonName] = [];
                }
                typeMap[pokemonName].push(typeName);
            });
        });
        return typeMap;
    } catch (error) {
        console.error("Error building type map:", error);
        return {};
    }
}