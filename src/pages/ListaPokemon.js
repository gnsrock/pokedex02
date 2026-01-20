import React, { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import CardPokemon from "../components/CardPokemon";
import TypeFilterBar from "../components/TypeFilterBar/TypeFilterBar";
import { getAllPokemon, getPokemonByType, getPokemonTypeMap } from "../services/pokemon";
import TypeColors from "../theme/TypeColors";
import TypeTranslations from "../theme/TypeTranslations";

function ListaPokemon({ globalSearchTerm, isShiny }) {
  const [allPokemon, setAllPokemon] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [typePokemonList, setTypePokemonList] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]); // Array para selección múltiple
  const [typeMap, setTypeMap] = useState(null);
  const [pendingPokemonId, setPendingPokemonId] = useState(null); // Para navegar después de limpiar filtros

  const [loading, setLoading] = useState(true);
  const [loadingType, setLoadingType] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // 1. CARGAR TODOS LOS POKÉMON SOLO UNA VEZ
  useEffect(() => {
    async function fetchData() {
      try {
        const results = await getAllPokemon();
        setAllPokemon(results);
        setFilteredPokemon(results);

        // Cargar el mapa de tipos para filtrado estricto (Puros vs Duales)
        const types = Object.keys(TypeColors);
        const map = await getPokemonTypeMap(types);
        setTypeMap(map);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // 2. MANEJAR CLIC EN TIPO (Toggle y Selección Múltiple)
  const handleTypeClick = async (type) => {
    if (type === null) {
      clearTypeFilter();
      return;
    }

    let newTypes;
    if (selectedTypes.includes(type)) {
      newTypes = selectedTypes.filter(t => t !== type);
    } else {
      if (selectedTypes.length >= 2) return; // Límite máximo de 2 tipos
      newTypes = [...selectedTypes, type];
    }

    setSelectedTypes(newTypes);
    setCurrentPage(1);

    if (newTypes.length === 0) {
      setTypePokemonList([]);
      return;
    }

    setLoadingType(true);
    try {
      // Obtener los resultados de todos los tipos seleccionados
      const promises = newTypes.map(t => getPokemonByType(t));
      const resultsArray = await Promise.all(promises);

      // 1. Intersección: Solo Pokémon que están en TODAS las listas (AND)
      let commonPokemon = resultsArray[0];
      for (let i = 1; i < resultsArray.length; i++) {
        const currentNames = new Set(resultsArray[i].map(p => p.name));
        commonPokemon = commonPokemon.filter(p => currentNames.has(p.name));
      }

      setTypePokemonList(commonPokemon);
    } catch (error) {
      console.error("Error al obtener tipos:", error);
    } finally {
      setLoadingType(false);
    }
  };

  const clearTypeFilter = () => {
    setSelectedTypes([]);
    setTypePokemonList([]);
    setLoadingType(false);
    setCurrentPage(1);
  };

  const removeType = (typeToRemove) => {
    handleTypeClick(typeToRemove);
  };

  // 3. FUNCIÓN DE FILTRADO UNIFICADA
  useEffect(() => {
    if (allPokemon.length === 0) return;

    let candidates = allPokemon;

    // A. Filtrar por tipos si hay seleccionados
    if (selectedTypes.length > 0) {
      if (typePokemonList.length > 0) {
        candidates = typePokemonList;
      } else {
        // Mientras carga, no mostramos la lista completa para evitar confusión
        candidates = [];
      }
    }

    // B. Filtrar por término de búsqueda (nombre)
    if (globalSearchTerm) {
      const lowerCaseTerm = globalSearchTerm.trim().toLowerCase();
      candidates = candidates.filter(pokemon =>
        pokemon.name.includes(lowerCaseTerm) ||
        pokemon.url.split('/').slice(-2, -1)[0].includes(lowerCaseTerm)
      );
    }

    setFilteredPokemon(candidates);
    setCurrentPage(1);
  }, [globalSearchTerm, selectedTypes, typePokemonList, allPokemon]);

  // E. Efecto para navegar a un Pokémon después de que se actualice la lista (ej. al limpiar filtros)
  useEffect(() => {
    if (pendingPokemonId && !loadingType) {
      const index = allPokemon.findIndex(p => {
        const parts = p.url.split('/');
        return parts[parts.length - 2] === pendingPokemonId.toString();
      });

      if (index !== -1) {
        const targetPage = Math.floor(index / itemsPerPage) + 1;
        setCurrentPage(targetPage);
        window.scrollTo(0, 0);
        setPendingPokemonId(null);
      }
    }
  }, [filteredPokemon, pendingPokemonId, loadingType, allPokemon, itemsPerPage]);


  // 4. LOGICA DE PAGINACION
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPokemon.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPokemon.length / itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo(0, 0);
    }
  };

  // 5. IR A UN POKEMON ESPECIFICO
  const goToPokemon = (pokemonId) => {
    // 1. Intentar buscarlo en la lista filtrada actual
    const index = filteredPokemon.findIndex(p => {
      const parts = p.url.split('/');
      return parts[parts.length - 2] === pokemonId.toString();
    });

    if (index !== -1) {
      // Si está en el filtro actual, vamos directo
      const targetPage = Math.floor(index / itemsPerPage) + 1;
      setCurrentPage(targetPage);
      window.scrollTo(0, 0);
    } else {
      // Si NO está en el filtro actual, limpiamos filtros y marcamos para navegar después
      clearTypeFilter();
      setPendingPokemonId(pokemonId);
    }
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="pokeball-loader" aria-label="Cargando..."></div>
      </div>
    );
  }

  return (
    <div className="pokemon-list-container container mt-5">

      <TypeFilterBar onTypeSelect={handleTypeClick} selectedTypes={selectedTypes} />

      {/* Indicador de Filtros Activos */}
      {selectedTypes.length > 0 && (
        <div className="d-flex flex-wrap justify-content-center align-items-center mb-5" style={{ gap: '10px', position: 'relative', zIndex: 50 }}>
          <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Filtrando por:</span>
          {selectedTypes.map(type => (
            <button
              key={type}
              className="btn btn-sm d-flex align-items-center text-capitalize px-3 py-1"
              style={{
                backgroundColor: TypeColors[type],
                color: ['electric', 'ground', 'ice', 'flying', 'steel', 'grass', 'bug', 'normal', 'fairy', 'rock'].includes(type) ? '#333' : '#fff',
                borderRadius: '20px',
                border: 'none',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                cursor: 'pointer'
              }}
              onClick={() => removeType(type)}
            >
              {TypeTranslations[type] || type}
              <span className="ms-2" style={{ fontWeight: 'bold' }}>&times;</span>
            </button>
          ))}
          <button className="btn btn-link btn-sm ms-2" onClick={clearTypeFilter} style={{ color: '#666', fontWeight: '500' }}>
            Limpiar todo
          </button>
        </div>
      )}

      {loadingType ? (
        <div className="d-flex justify-content-center my-5">
          <Spinner animation="grow" variant="primary" />
        </div>
      ) : (
        <div className="row">
          {currentItems.map((pokemon) => (
            <div key={pokemon.name} className="col-md-4 mb-3">
              <CardPokemon
                pokemon={pokemon}
                goToPokemon={goToPokemon}
                onTypeClick={handleTypeClick}
                isShiny={isShiny}
              />
            </div>
          ))}
          {filteredPokemon.length === 0 && (
            <div className="text-center w-100 mt-5">
              <h5>No se encontraron Pokémon que cumplan con todos los tipos seleccionados.</h5>
              <button className="btn btn-link" onClick={clearTypeFilter}>Limpiar filtros</button>
            </div>
          )}
        </div>
      )}

      {/* Controles de Paginación */}
      {!loadingType && filteredPokemon.length > itemsPerPage && (
        <div className="d-flex justify-content-center mt-4 mb-4">
          <button
            className="btn btn-secondary me-2"
            onClick={prevPage}
            disabled={currentPage === 1}
          >
            &larr; Anterior
          </button>
          <span className="align-self-center mx-3">
            Página {currentPage} de {totalPages}
          </span>
          <button
            className="btn btn-primary ms-2"
            onClick={nextPage}
            disabled={currentPage === totalPages}
          >
            Siguiente &rarr;
          </button>
        </div>
      )}
    </div>
  );
}

export default ListaPokemon;