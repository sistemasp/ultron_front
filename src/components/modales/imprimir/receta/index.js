import React, { useState, Fragment, useEffect } from 'react';
import { Backdrop, CircularProgress, makeStyles } from '@material-ui/core';
import ModalFormImprimirReceta from './ModalFormImprimirReceta';
import { culcularEdad } from '../../../../utils/utils';
import { findConsultById } from '../../../../services/consultas';
import myStyles from '../../../../css';

const ModalImprimirReceta = (props) => {

  const classes = myStyles(colorBase)();

  const {
    open,
    onClose,
    sucursal,
    consultorio,
    receta,
    colorBase,
  } = props;

  const [show, setShow] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const today = new Date();
  const edad = culcularEdad(consultorio.paciente.fecha_nacimiento);

  const handleClickImprimir = (e) => {
    setShow(false);
    setTimeout(() => {
      window.print();
    }, 0);
    setTimeout(() => { setShow(true); }, 15);
  }

  const findConsulta = async () => {
    setIsLoading(true);
    const response = await findConsultById(consultorio.consultaId);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      consultorio.consulta = response.data;
    }
    setIsLoading(false);
  }

  useEffect(() => {
    findConsulta();
  }, []);

  return (
    <Fragment>
      {
        !isLoading ?
          <ModalFormImprimirReceta
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            consultorio={consultorio}
            receta={receta}
            today={today}
            edad={edad}
            open={open}
            onClose={onClose}
            sucursal={sucursal}
            onClickImprimir={handleClickImprimir}
            show={show} /> :
          <Backdrop className={classes.backdrop} open={isLoading} >
            <CircularProgress color="inherit" />
          </Backdrop>
      }

    </Fragment>

  );
}

export default ModalImprimirReceta;