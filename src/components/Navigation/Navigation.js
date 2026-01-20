import React from 'react';
import { Navbar, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png'; // RUTA CORREGIDA
import Buscar from '../../pages/Buscar';

function Navigation({ onSearch, darkMode, toggleTheme, isShiny, toggleShiny }) {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false); // Estado para controlar el menú
  // Usar archivo local en 'public' para evitar bloqueos
  const audioRef = React.useRef(new Audio(process.env.PUBLIC_URL + "/pokemon-center.mp3"));

  React.useEffect(() => {
    audioRef.current.volume = 0.1; // Volumen muy bajo (10%)
    audioRef.current.loop = true;

    // Log para depuración
    audioRef.current.onerror = (e) => console.error("Audio: Error de carga local", e);

    return () => {
      audioRef.current.pause();
    };
  }, []);

  const toggleMusic = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log("Error al reproducir audio:", error);
        });
      }
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <Navbar
      expanded={expanded} // Controlado por estado
      expand="lg"
      className="pokedex-navbar"
      sticky="top"
      variant={darkMode ? 'dark' : 'light'}
      style={{ padding: '0.5rem 1rem', minHeight: '60px' }}
    >
      <Container fluid>
        <Link
          to="/"
          className="navbar-brand d-flex flex-column align-items-center"
          style={{ lineHeight: '1', padding: '2px 0', textDecoration: 'none', color: 'inherit' }}
          onClick={() => setExpanded(false)} // Cerrar menú al hacer clic en Home
        >
          <img
            src={logo}
            alt="Pokedex Logo"
            style={{ height: '40px' }}
            className="d-block"
          />
          <span style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '4px' }}>Pokedex</span>
        </Link>

        {/* Toggle controla el estado expanded */}
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          style={{ border: 'none', padding: '0.25rem 0.5rem' }}
          onClick={() => setExpanded(expanded ? false : "expanded")}
        />

        <Navbar.Collapse id="basic-navbar-nav">
          <div className="d-flex flex-column flex-lg-row align-items-center justify-content-between w-100 mt-3 mt-lg-0">

            {/* Barra de Búsqueda - Centrada en Desktop, Full en Móvil */}
            <div className="search-bar-container mx-lg-auto mb-3 mb-lg-0" style={{ width: '100%', maxWidth: '400px' }}>
              <Buscar onSearchChange={onSearch} />
            </div>

            {/* Grupo de Herramientas: Shiny, Música, Tema */}
            <div className="d-flex flex-row align-items-center justify-content-center gap-3 gap-lg-4">

              {/* Switch Shiny */}
              <div
                className={`shiny-switch ${isShiny ? 'active' : ''}`}
                onClick={toggleShiny}
                title={isShiny ? "Ver Normales" : "Ver Shinies"}
                style={{ margin: 0 }}
              >
                <span className="shiny-switch-slider"></span>
                <span className="shiny-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={isShiny ? "#FFBC00" : "none"} stroke={isShiny ? "#FFBC00" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                </span>
              </div>

              {/* Botón Música */}
              <button
                onClick={toggleMusic}
                className="btn btn-link p-0 d-flex align-items-center justify-content-center"
                title={isPlaying ? "Pausar Música" : "Reproducir Música"}
                style={{
                  textDecoration: 'none',
                  color: darkMode ? '#fff' : '#333',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
                }}
              >
                {isPlaying ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <line x1="23" y1="9" x2="17" y2="15"></line>
                    <line x1="17" y1="9" x2="23" y2="15"></line>
                  </svg>
                )}
              </button>

              {/* Switch Tema */}
              <div
                className={`theme-switch ${darkMode ? 'dark' : ''}`}
                onClick={toggleTheme}
                title={darkMode ? "Modo Claro" : "Modo Oscuro"}
                style={{ margin: 0 }}
              >
                <span className="theme-switch-slider"></span>
                <span className="theme-icon sun">
                  {!darkMode && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="5"></circle>
                      <line x1="12" y1="1" x2="12" y2="3"></line>
                      <line x1="12" y1="21" x2="12" y2="23"></line>
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                      <line x1="1" y1="12" x2="3" y2="12"></line>
                      <line x1="21" y1="12" x2="23" y2="12"></line>
                      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                    </svg>
                  )}
                </span>
                <span className="theme-icon moon">
                  {darkMode && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                    </svg>
                  )}
                </span>
              </div>

            </div>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar >
  );
}

export default Navigation;