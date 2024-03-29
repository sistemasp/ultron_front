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
import ImprimirConsulta from './containers/imprimir/consulta';
import ImprimirTratamiento from './containers/imprimir/tratamiento';
import ImprimirCuracion from './containers/imprimir/curacion';
import ImprimirDermapen from './containers/imprimir/dermapen';
import MenuMainEnfermeria from './containers/enfermeria';
import ImprimirReceta from './containers/imprimir/receta';
import ImprimirEstudios from './containers/imprimir/estudios';

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
            exact path="/enfermeria"
            element={<MenuMainEnfermeria />} />
          <Route
            exact path="/imprimir/pagodermatologo"
            element={<ImprimirPagoDermatologo />} />
          <Route
            exact path="/imprimir/pagopatologo"
            element={<ImprimirPagoPatologo />} />
          <Route
            exact path="/imprimir/corte"
            element={<ImprimirCorte />} />
          <Route
            exact path="/imprimir/ticket/consulta"
            element={<ImprimirConsulta />} />
          <Route
            exact path="/imprimir/ticket/curacion"
            element={<ImprimirCuracion />} />
          <Route
            exact path="/imprimir/ticket/dermapen"
            element={<ImprimirDermapen />} />
          <Route
            exact path="/imprimir/ticket/estetica"
            element={<ImprimirTratamiento />} />
          <Route
            exact path="/imprimir/ticket/tratamiento"
            element={<ImprimirTratamiento />} />
          <Route
            exact path="/imprimir/receta/normal"
            element={<ImprimirReceta />} />
          <Route
            exact path="/imprimir/receta/antibioticos"
            element={<ImprimirReceta />} />
          <Route
            exact path="/imprimir/receta/controlados"
            element={<ImprimirReceta />} />
          <Route
            exact path="/imprimir/estudios"
            element={<ImprimirEstudios />} />
        </Routes>

      </div>
    </Router>
  );
}

export default App;
