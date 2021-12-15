import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from "./containers/basicos/login/index";
import MenuMainRecepcion from "./containers/recepcion/main/index";
import './App.css';
import MenuMainDermatologos from './containers/dermatologos/main';
import MenuMainCosmetologas from './containers/cosmetologas/main';
import MenuMainAdministracion from './containers/administracion/main';
import ImprimirPagoDermatologo from './containers/imprimir/pago_dermatologo';
import ImprimirPagoPatologo from './containers/imprimir/pago_patologo';
import ImprimirCorte from './containers/imprimir/corte';

const App = () => {

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            exact path="/"
            element={<LoginForm />} />
          <Route
            exact path="/administracion"
            element={<MenuMainAdministracion />} />
          <Route
            exact path="/cabinas"
            element={<MenuMainCosmetologas />} />
          <Route
            exact path="/dermatologos"
            element={<MenuMainDermatologos />} />
          <Route
            exact path="/recepcion"
            element={<MenuMainRecepcion />} />
          <Route
            exact path="/imprimir/pagodermatologo"
            element={<ImprimirPagoDermatologo />} />
          <Route
            exact path="/imprimir/pagopatologo"
            element={<ImprimirPagoPatologo />} />
          <Route
            exact path="/imprimir/corte"
            element={<ImprimirCorte />} />
        </Routes>

      </div>
    </Router>
  );
}

export default App;
