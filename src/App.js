import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
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
        <Route
          exact path="/"
          component={LoginForm} />
        <Route
          exact path="/administracion"
          component={MenuMainAdministracion} />
        <Route
          exact path="/cabinas"
          component={MenuMainCosmetologas} />
        <Route
          exact path="/dermatologos"
          component={MenuMainDermatologos} />
        <Route
          exact path="/recepcion"
          component={MenuMainRecepcion} />
        <Route
          exact path="/imprimir/pagodermatologo"
          component={ImprimirPagoDermatologo} />
        <Route
          exact path="/imprimir/pagopatologo"
          component={ImprimirPagoPatologo} />
        <Route
          exact path="/imprimir/corte"
          component={ImprimirCorte} />
      </div>
    </Router>
  );
}

export default App;
