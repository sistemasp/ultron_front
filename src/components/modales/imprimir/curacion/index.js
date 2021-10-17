import React, { useState, Fragment } from 'react';
import { makeStyles } from '@material-ui/core';
import ModalFormImprimirCuracion from './ModalFormImprimirCuracion';

const useStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const ModalImprimirCuracion = (props) => {

  const classes = useStyles();

  const {
    open,
    onClose,
    datos,
    sucursal,
    servicio,
    colorBase,
  } = props;

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
      <ModalFormImprimirCuracion
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

export default ModalImprimirCuracion;