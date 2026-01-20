import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Navigation from "./components/Navigation";
import ListaPokemon from "./pages/ListaPokemon";

import "./App.css";

function App() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [darkMode, setDarkMode] = React.useState(false);
  const [isShiny, setIsShiny] = React.useState(false);

  React.useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);
  const toggleShiny = () => setIsShiny(!isShiny);

  return (
    <React.Fragment>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Navigation
          onSearch={setSearchTerm}
          darkMode={darkMode}
          toggleTheme={toggleTheme}
          isShiny={isShiny}
          toggleShiny={toggleShiny}
        />
        <div className="container-fluid" >
          <Switch >
            <Route
              exact={true}
              path="/"
              render={(props) => (
                <ListaPokemon
                  {...props}
                  globalSearchTerm={searchTerm}
                  isShiny={isShiny}
                />
              )}
            />
          </Switch>
        </div>
      </BrowserRouter>
    </React.Fragment>
  );
}

export default App;