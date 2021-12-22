import React, { useState, Fragment } from 'react';
import { useLocation, useNavigate } from 'react-router';
import FormEstetica from './FormEstetica';

const ImprimirEstetica = (props) => {

  const location = useLocation();
  const navigate = useNavigate();

  const {
    empleado,
    sucursal,
    datos,
    servicio,
    colorBase,
  } = location.state;

  const [show, setShow] = useState(true);

  const handleClickImprimir = (e) => {

    setShow(false);
    setTimeout(() => {
      window.print();
    }, 0);
    setTimeout(() => { setShow(true); }, 15);
  }

  const hadleClickBack = () => {
    navigate(-1);
  }

  return (
    <Fragment>
      <FormEstetica
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        datos={datos}
        servicio={servicio}
        sucursal={sucursal}
        onClickImprimir={handleClickImprimir}
        hadleClickBack={hadleClickBack}
        colorBase={colorBase}
        show={show} />
    </Fragment>

  );
}

export default ImprimirEstetica;