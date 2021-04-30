import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import LoginForm from "./containers/login/index";
import MenuMainRecepcion from "./containers/recepcion/main/index";
import './App.css';
import MenuMainDermatologos from './containers/dermatologos/main';
//import MenuMainCallCenter from './containers/call_center/main';
import MenuMainCosmetologas from './containers/cosmetologas/main';

const App = () => {

  return (
    <Router>
      <div className="App">
        <Route
          exact path="/"
          component={LoginForm} />
        <Route
          exact path="/call_center"
          component={/*MenuMainCallCenter*/MenuMainCosmetologas} />
        <Route
          exact path="/cabinas"
          component={MenuMainCosmetologas} />
        <Route
          exact path="/dermatologos"
          component={MenuMainDermatologos} />
        <Route
          exact path="/recepcion"
          component={MenuMainRecepcion} />
      </div>
    </Router>
  );
}

export default App;
