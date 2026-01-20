import React, { useState, useEffect, useCallback, useRef } from "react";
import { Card, Spinner } from "react-bootstrap";
import TypeColors from "../../theme/TypeColors";
import ColorPokemon from "../../theme/ColorPokemon";
import { getEvolutionChain } from "../../services/pokemon";
import TypeTranslations from "../../theme/TypeTranslations";
import "./CardPokemon.scss";

// Función auxiliar recursiva para procesar la cadena de evolución (maneja ramificaciones)
const processEvolutionChain = (chainNode, currentSpeciesName) => {
  const evolutions = [];
  let belongsToChain = false;

  const traverse = (node) => {
    if (!node) return;

    const urlParts = node.species.url.split('/');
    const id = urlParts[urlParts.length - 2];
    const name = node.species.name;

    if (name === currentSpeciesName) {
      belongsToChain = true;
    }

    evolutions.push({
      id: id,
      name: name,
      // Usar el ID para construir la URL de la imagen (más confiable para evoluciones estándar)
      img: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
    });

    // Procesar todas las posibles evoluciones (ramificaciones)
    if (node.evolves_to && node.evolves_to.length > 0) {
      node.evolves_to.forEach(evolution => traverse(evolution));
    }
  };

  traverse(chainNode);
  // Solo devolvemos la cadena si el Pokémon actual realmente pertenece a ella
  return belongsToChain ? evolutions : [];
};

function CardPokemon({ pokemon, goToPokemon, onTypeClick, isShiny }) {
  const [pokemonDetails, setPokemonDetails] = useState(null);
  const [evolutionData, setEvolutionData] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [animate, setAnimate] = useState(false);

  const [varietiesData, setVarietiesData] = useState([]);
  const [showVarieties, setShowVarieties] = useState(false);

  const evoScrollRef = useRef(null);
  const varScrollRef = useRef(null);

  // Función para manejar el scroll con la rueda del ratón (Vertical -> Horizontal)
  const handleWheel = (e) => {
    if (e.deltaY === 0) return;
    e.currentTarget.scrollLeft += e.deltaY;
  };

  // Lógica de "Arrastrar para hacer scroll" (Drag to scroll)
  const handleMouseDown = (e) => {
    const slider = e.currentTarget;
    slider.isDown = true;
    slider.classList.add('grabbing');
    slider.startX = e.pageX - slider.offsetLeft;
    slider.scrollLeftStart = slider.scrollLeft;
  };

  const handleMouseLeave = (e) => {
    const slider = e.currentTarget;
    slider.isDown = false;
    slider.classList.remove('grabbing');
  };

  const handleMouseUp = (e) => {
    const slider = e.currentTarget;
    slider.isDown = false;
    slider.classList.remove('grabbing');
  };

  const handleMouseMove = (e) => {
    const slider = e.currentTarget;
    if (!slider.isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - slider.startX) * 2; // Velocidad de scroll
    slider.scrollLeft = slider.scrollLeftStart - walk;
  };

  const fetchDetails = useCallback(async () => {
    try {
      const res = await fetch(pokemon.url);
      return await res.json();
    } catch (error) {
      console.error("Error al obtener detalles del Pokémon:", pokemon.name, error);
      return null;
    }
  }, [pokemon.url, pokemon.name]);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      if (!isMounted) return;
      setLoadingDetails(true);
      setAnimate(false);

      const details = await fetchDetails();
      if (!isMounted || !details) return;

      // Obtenemos cadena de evolución Y variedades
      const evolutionInfo = await getEvolutionChain(details.species.url);

      let processedEvolutions = [];
      let varieties = [];

      if (evolutionInfo && isMounted) {
        processedEvolutions = processEvolutionChain(evolutionInfo.chain, details.species.name);

        // Procesar variedades (filtrar la actual y ASEGURAR que sean del mismo Pokemon base)
        varieties = await Promise.all(evolutionInfo.varieties
          .filter(v => {
            const nameLower = v.pokemon.name.toLowerCase();
            const baseNameLower = details.species.name.toLowerCase();
            return nameLower !== details.name.toLowerCase() &&
              (nameLower.includes(baseNameLower) || nameLower.includes("mega") || nameLower.includes("gmax") || nameLower.includes("alola") || nameLower.includes("galar") || nameLower.includes("hisui") || nameLower.includes("paldea"));
          })
          .map(async (v) => {
            const urlParts = v.pokemon.url.split('/');
            const id = urlParts[urlParts.length - 2];

            let sprite = isShiny
              ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${id}.png`
              : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

            try {
              const varRes = await fetch(v.pokemon.url);
              const varData = await varRes.json();
              if (varData.sprites) {
                const shinySprite = varData.sprites.front_shiny;
                const defaultSprite = varData.sprites.front_default;
                if (isShiny && shinySprite) {
                  sprite = shinySprite;
                } else if (defaultSprite) {
                  sprite = defaultSprite;
                }
              }
            } catch (e) {
              console.warn("No se pudo cargar sprite específico para variedad", v.pokemon.name);
            }

            return { id, name: v.pokemon.name, img: sprite };
          }));
      }

      if (isMounted) {
        setPokemonDetails(details);
        setEvolutionData(processedEvolutions);
        setVarietiesData(varieties);
        setShowVarieties(false);
        setLoadingDetails(false);
        setTimeout(() => isMounted && setAnimate(true), 100);
      }
    }

    loadData();
    return () => { isMounted = false; };
  }, [fetchDetails, isShiny]);


  if (loadingDetails || !pokemonDetails) {
    return (
      <div className="my-2 card-pokemon d-flex justify-content-center align-items-center" style={{ width: "19rem", height: "225px" }}>
        <Spinner animation="border" size="sm" />
      </div>
    );
  }

  const p = pokemonDetails;

  // Manejador para imágenes que no cargan
  const handleImageError = (e) => {
    e.target.src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png"; // Placeholder (PokeBall silueta o similar)
    e.target.style.opacity = "0.5";
  };

  return (
    <Card
      className={`my-2 card-pokemon border-0 ${showVarieties ? 'expanded' : ''}`}
      style={{ backgroundColor: ColorPokemon[p.types?.[0]?.type?.name] || '#ccc' }}
    >
      <Card.Body>
        <Card.Title className="text-uppercase text-center">{p.name || 'Desconocido'}</Card.Title>
        <Card.Img
          style={{ width: "150px" }}
          variant="top"
          src={isShiny
            ? (p.sprites?.front_shiny || p.sprites?.front_default || "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png")
            : (p.sprites?.front_default || "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png")
          }
          alt={p.name}
          onError={handleImageError}
        />

        {/* 1. Datos básicos: Peso, Altura, Habilidad */}
        <Card.Text className="text-center"> N# : {p.id} </Card.Text>
        <Card.Text className="text-center"> Peso : {p.weight / 10} {""} Kg. </Card.Text>
        <Card.Text className="text-center"> Altura : {p.height / 10} m </Card.Text>
        <Card.Text className="text-center"> Habilidad : {p.abilities && p.abilities.length > 0 ? p.abilities[0].ability.name : 'Ninguna'} </Card.Text>

        {/* 2. BARRAS DE ESTADÍSTICAS */}
        <div className="stats-container mt-2">
          <h6 className="stats-title text-center" style={{ color: '#fff', textShadow: '1px 1px 2px #000' }}>Estadísticas</h6>
          {p.stats?.slice(0, 6).map((statInfo, index) => {
            const statNames = {
              hp: 'PS',
              attack: 'ATQ',
              defense: 'DEF',
              'special-attack': 'ATK. S',
              'special-defense': 'DEF. S',
              speed: 'VEL'
            };
            const sName = statNames[statInfo.stat?.name] || statInfo.stat?.name;

            return (
              <div key={index} className="stat-item d-flex align-items-center">
                <span className="stat-name text-uppercase">
                  {sName}
                </span>
                <div className="stat-bar-wrapper flex-grow-1">
                  <div
                    className="stat-bar"
                    style={{
                      width: animate ? `${Math.min(statInfo.base_stat, 200) / 2}%` : '0%',
                      backgroundColor: index % 2 === 0 ? '#00e5ff' : '#9500ff' // Cian Eléctrico y Púrpura Neón
                    }}
                  >
                    <small className="stat-value">{statInfo.base_stat}</small>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 3. Bloque de Tipos */}
        <div className="tipo-pokemon mt-1" >
          {p.types?.map((typeInfo, index) => (
            <button
              style={{ backgroundColor: TypeColors[typeInfo.type?.name] || '#777', cursor: 'pointer' }}
              key={index}
              className="text-capitalize"
              onClick={(e) => {
                e.stopPropagation();
                if (onTypeClick) onTypeClick(typeInfo.type?.name);
              }}
              title={`Filtrar por tipo ${typeInfo.type?.name}`}
            >
              {TypeTranslations[typeInfo.type?.name] || typeInfo.type?.name}
            </button>
          ))}
        </div>

        {/* Contenedor de evoluciones y variedades - EMPUJA AL FINAL */}
        <div className="mt-auto">
          {/* 4. CADENA EVOLUTIVA */}
          {evolutionData.length > 0 && (
            <div className="evolution-container mt-0 pt-1 border-top" style={{ borderColor: 'rgba(255,255,255,0.1) !important' }}>
              <h6 className="text-center" style={{ color: '#fff', textShadow: '1px 1px 2px #000', fontSize: '12px', marginBottom: '4px' }}>Evolución</h6>
              <div
                className="evolution-scroll-wrapper"
                ref={evoScrollRef}
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
              >
                <ul className="evolution-list px-0 list-unstyled mb-0">
                  {evolutionData.map((ev) => (
                    ev.id !== p.species.url.split('/').slice(-2, -1)[0] && (
                      <li key={ev.id} className="evolution-item">
                        <img
                          onClick={() => goToPokemon(ev.id)}
                          loading="lazy"
                          src={isShiny
                            ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${ev.id}.png`
                            : ev.img
                          }
                          alt={ev.name}
                          title={`Ir a ${ev.name}`}
                          onError={handleImageError}
                        />
                        <small className="evolution-name text-capitalize">
                          {ev.name}
                        </small>
                      </li>
                    )
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* 5. VARIEDADES (Mega, G-Max, etc) */}
          {varietiesData.length > 0 && (
            <div className="varieties-collapsible mt-1 pt-1 border-top" style={{ borderColor: 'rgba(255,255,255,0.2) !important' }}>
              <button
                className="varieties-toggle-btn d-flex align-items-center justify-content-center w-100"
                onClick={() => setShowVarieties(!showVarieties)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  textShadow: '1px 1px 2px #000',
                  padding: '5px 0'
                }}
              >
                {showVarieties ? 'Ocultar Formas' : `Ver Formas / Variedades (${varietiesData.length})`}
                <span className={`ml-2 transform-transition ${showVarieties ? 'rotate-180' : ''}`} style={{ fontSize: '14px' }}>
                  ▾
                </span>
              </button>

              {showVarieties && (
                <div
                  className="varieties-scroll-wrapper anime-fade-in"
                  ref={varScrollRef}
                  onWheel={handleWheel}
                  onMouseDown={handleMouseDown}
                  onMouseLeave={handleMouseLeave}
                  onMouseUp={handleMouseUp}
                  onMouseMove={handleMouseMove}
                >
                  <ul className="varieties-list px-0 list-unstyled mb-0">
                    {varietiesData.map((v) => (
                      <li key={v.id} className="variety-item">
                        <img
                          onClick={() => goToPokemon(v.id)}
                          loading="lazy"
                          src={isShiny
                            ? (v.img.includes('shiny') ? v.img : v.img.replace('/pokemon/', '/pokemon/shiny/'))
                            : v.img
                          }
                          alt={v.name}
                          title={`Ver forma ${v.name}`}
                          onError={handleImageError}
                        />
                        <small className="variety-name text-capitalize">
                          {v.name.replace(p.name + '-', '')}
                        </small>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}

export default CardPokemon;