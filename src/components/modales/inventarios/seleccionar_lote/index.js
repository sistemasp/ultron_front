import React, { useEffect, useState } from 'react';
import { Backdrop, CircularProgress } from '@material-ui/core';
import { Fragment } from 'react';
import FormSeleccionarLote from './FormSeleccionarLote';
import myStyles from '../../../../css';

const ModalSeleccionarLote = (props) => {

  const {
    open,
    onClose,
    colorBase,
    traspaso,
  } = props;

  console.log("KAOZ se abre");
  const titulo = "INSUMOS";

  const [isLoading, setIsLoading] = useState(false);
  const [values, setValues] = useState({
    ...traspaso,
  });
  const [registro, setRegistro] = useState({});

  const classes = myStyles(colorBase)();

  const handleChange = (e) => {
    setRegistro({
      ...registro,
      [e.target.name]: e.target.value.toUpperCase()
    });
  }

  const loadAll = async () => {
    setIsLoading(true);
    setIsLoading(false);
  }

  useEffect(() => {
    loadAll();
  }, []);

  return (
    <Fragment>
      {
        !isLoading ?
          <FormSeleccionarLote
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            values={values}
            open={open}
            onClickCancel={onClose}
            onChange={handleChange}
            isLoading={isLoading}
            titulo={titulo}
            registro={registro}
            colorBase={colorBase} />
          : <Backdrop className={classes.backdrop} open={isLoading} >
            <CircularProgress color="inherit" />
          </Backdrop>
      }

    </Fragment>
  );
}

export default ModalSeleccionarLote;