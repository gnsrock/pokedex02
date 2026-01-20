// src/pages/Buscar.js

import React, { useState } from 'react';
import { Form, FormControl, Button } from 'react-bootstrap';
import './Buscar.css'; // Crearemos este archivo después

// Recibe la función onSearchChange del padre (ListaPokemon)
function Buscar({ onSearchChange }) {
    const [searchTerm, setSearchTerm] = useState('');

    const handleChange = (event) => {
        const value = event.target.value.toLowerCase();
        setSearchTerm(value);
        // Llama a la función del padre inmediatamente para filtrar
        onSearchChange(value);
    };

    // Usamos el Form.Group para tener un buen estilo Bootstrap
    return (
        <div className="search-bar-container w-100">
            <Form inline className="justify-content-center justify-content-lg-end">
                <FormControl
                    type="text"
                    placeholder="Buscar..."
                    className="search-input my-1"
                    value={searchTerm}
                    onChange={handleChange}
                    style={{ width: '100%' }}
                />
            </Form>
        </div>
    );
}

export default Buscar;