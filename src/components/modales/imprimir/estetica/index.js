import React, { useState, Fragment } from 'react';
import { makeStyles } from '@material-ui/core';
import ModalFormImprimirEstetica from './ModalFormImprimirEstetica';

const useStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const ModalImprimirEstetica = (props) => {

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
      <ModalFormImprimirEstetica
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

export default ModalImprimirEstetica;