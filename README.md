# 📱 Pokédex App

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)
![Sass](https://img.shields.io/badge/Sass-CC6699?style=for-the-badge&logo=sass&logoColor=white)

Una aplicación web moderna y responsiva que simula una Pokédex, permitiendo a los usuarios explorar el mundo Pokémon con una interfaz elegante y funcional. Este proyecto consume la [PokeAPI](https://pokeapi.co/) para mostrar información detallada, evoluciones y estadísticas.

🔗 **[Ver Demo en Vivo](https://gnsrock.github.io/pokedex02/)**

## ✨ Características Principales

-   **🔍 Búsqueda Inteligente:** Busca Pokémon por su nombre o número de Pokédex nacional.
-   **🏷️ Filtrado por Tipos:** Filtra resultados fácilmente seleccionando tipos específicos (Fuego, Agua, Planta, etc.).
-   **🌗 Modo Oscuro/Claro:** Interfaz adaptable con soporte completo para tema oscuro, ideal para navegar de noche.
-   **📈 Detalles Completos:** Visualiza estadísticas base, habilidades, tipos y descripciones.
-   **🧬 Cadenas de Evolución:** Explora las evoluciones de cada Pokémon con una vista intuitiva.
-   **📱 Diseño Responsivo:** Totalmente optimizado para dispositivos móviles, tablets y escritorio.

## 🛠️ Tecnologías Utilizadas

Este proyecto demuestra el uso de tecnologías modernas de desarrollo frontend:

-   **React.js**: Librería principal para la construcción de la interfaz.
-   **React Bootstrap & Bootstrap 5**: Para un sistema de rejilla robusto y componentes estilizados.
-   **Sass (SCSS)**: Para estilos modulares y avanzados.
-   **React Router**: Manejo de navegación SPA (Single Page Application).
-   **PokeAPI**: API RESTful de terceros para obtener los datos.
-   **Context API**: Manejo del estado global para funcionalidades como el Modo Oscuro.

## 🚀 Instalación y Ejecución Local

Si deseas correr este proyecto en tu máquina local, sigue estos pasos:

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/gnsrock/pokedex02.git
    cd pokedex02
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    # o si usas yarn
    yarn install
    ```

3.  **Iniciar el servidor de desarrollo:**
    ```bash
    npm start
    # o
    yarn start
    ```

    La aplicación correrá en `http://localhost:3000`.

## 📂 Estructura del Proyecto

```
pokedex02/
├── public/          # Archivos estáticos
├── src/
│   ├── components/  # Componentes reutilizables (Cards, Header, etc.)
│   ├── pages/       # Vistas principales (Home, Details)
│   ├── styles/      # Archivos SCSS globales y módulos
│   ├── utils/       # Funciones auxiliares y constantes
│   └── App.js       # Componente raíz y configuración de rutas
└── package.json     # Dependencias y scripts
```

## 📬 Contacto

Si tienes alguna pregunta o sugerencia sobre este proyecto, no dudes en contactarme.

---
*Desarrollado con ❤️ por [Gabriel](https://github.com/gnsrock)*
