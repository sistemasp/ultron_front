import React, { useState, Fragment, useEffect } from 'react';
import { Backdrop, CircularProgress, makeStyles } from '@material-ui/core';
import { culcularEdad } from '../../../utils/utils';
import { findConsultById } from '../../../services/consultas';
import myStyles from '../../../css';
import FormImprimirEstudios from './FormImprimirEstudios';
import { useLocation, useNavigate } from 'react-router-dom';

const ImprimirEstudios = (props) => {

  const navigate = useNavigate();

  const location = useLocation();

  const {
    sucursal,
    colorBase,
    productos,
    consultorio,
    receta,
  } = location.state;
  
  const classes = myStyles(colorBase)();

  const [show, setShow] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

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

  const handleReturn = () => {
    navigate(-1);
  }

  useEffect(() => {
    findConsulta();
  }, []);

  return (
    <Fragment>
      {
        !isLoading ?
          <FormImprimirEstudios
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            consultorio={consultorio}
            receta={receta}
            edad={edad}
            onReturn={handleReturn}
            sucursal={sucursal}
            onClickImprimir={handleClickImprimir}
            productos={productos}
            show={show}
             /> :
          <Backdrop className={classes.backdrop} open={isLoading} >
            <CircularProgress color="inherit" />
          </Backdrop>
      }

    </Fragment>

  );

}

export default ImprimirEstudios;