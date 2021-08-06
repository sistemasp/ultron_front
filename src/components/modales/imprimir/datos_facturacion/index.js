import React, { useState, Fragment } from 'react';
import { makeStyles } from '@material-ui/core';
import FormImprimirDatosFacturacion from './FormImprimirDatosFacturacion';
import myStyles from '../../../../css';

const ImprimirDatosFacturacion = (props) => {

  const {
    open,
    onClose,
    datos,
    sucursal,
    servicio,
    colorBase,
  } = props;

  const classes = myStyles(colorBase)();


  const [show, setShow] = useState(true);

  const handleClickImprimir = (e) => {

    setShow(false);
    setTimeout(() => {
      window.print();
    }, 0);
    setTimeout(() => { setShow(true); }, 15);
  }

  return (
    <Fragment>
      <FormImprimirDatosFacturacion
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClose={onClose}
        datos={datos}
        servicio={servicio}
        sucursal={sucursal}
        onClickImprimir={handleClickImprimir}
        colorBase={colorBase}
        show={show} />
    </Fragment>

  );
}

export default ImprimirDatosFacturacion;