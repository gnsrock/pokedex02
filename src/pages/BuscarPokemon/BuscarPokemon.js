import React, { useState } from "react";
import { Form, Button, Spinner } from "react-bootstrap";
import CardPokemon from "../../components/CardPokemon";
import { getPokemonByColor } from "../../services/pokemon";
import "./BuscarPokemon.scss";

export default function BuscarPokemon() {
  const [color, setColor] = useState("");
  const [filtraPoke, setFiltraPoke] = useState([]);
  const [loading, setLoading] = useState(false);

  const buscarPoke = async (ev) => {
    ev.preventDefault();
    if (!color || color === "Selecciona Color") return;

    setLoading(true);
    try {
      const results = await getPokemonByColor(color);
      setFiltraPoke(results);
    } catch (error) {
      console.error("Error al buscar por color:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="buscar-pokemon container mt-4">
      <h2 className="text-center mb-4" style={{ color: '#fff', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
        Explorar por Colores
      </h2>

      <div className="row justify-content-center mb-5">
        <div className="col-md-6 col-lg-4">
          <div className="search-card p-4" style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '15px', backdropFilter: 'blur(10px)' }}>
            <Form onSubmit={buscarPoke}>
              <Form.Group controlId="pokemonColor">
                <Form.Label className="text-white">Selecciona un color para filtrar:</Form.Label>
                <Form.Control
                  as="select"
                  onChange={(e) => setColor(e.target.value)}
                  className="custom-select"
                >
                  <option>Selecciona Color</option>
                  <option value="green">Verde</option>
                  <option value="red">Rojo</option>
                  <option value="blue">Azul</option>
                  <option value="brown">Marrón</option>
                  <option value="purple">Púrpura</option>
                  <option value="yellow">Amarillo</option>
                  <option value="gray">Gris</option>
                  <option value="pink">Rosado</option>
                  <option value="white">Blanco</option>
                  <option value="black">Negro</option>
                </Form.Control>
              </Form.Group>
              <Button variant="primary" type="submit" block className="mt-3" disabled={loading}>
                {loading ? <Spinner animation="border" size="sm" /> : "Buscar Pokémon"}
              </Button>
            </Form>
          </div>
        </div>
      </div>

      <div className="row justify-content-center">
        {filtraPoke.length > 0 ? (
          filtraPoke.map((p) => (
            <div key={p.name} className="col-md-6 col-lg-4 d-flex justify-content-center mb-4">
              <CardPokemon pokemon={p} />
            </div>
          ))
        ) : (
          !loading && color && (
            <div className="text-center text-white mt-5">
              <p>No se encontraron resultados para este color.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
