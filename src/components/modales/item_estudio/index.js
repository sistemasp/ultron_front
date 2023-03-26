import React, { useState, useEffect } from 'react';
import FormItemEstudio from './FormItemEstudio';
import {
  showAllSexos,
} from "../../../services";
import { createLaboratorio, showAllLaboratorios, updateLaboratorio } from '../../../services/laboratorios';
import { Fragment } from 'react';
import { Backdrop, CircularProgress } from '@material-ui/core';
import myStyles from '../../../css';
import { showAllProductoComercials, showProductoComercialByLaboratorioId, updateProductoComercial } from '../../../services/productos_comerciales';
import { showAllAnalisisMedico } from '../../../services/analisis_medicos';

const ModalItemEstudio = (props) => {

  const {
    open,
    onClose,
    onClickAgregarEstudios,
    colorBase,
  } = props;

  const classes = myStyles(colorBase)();

  const [isLoading, setIsLoading] = useState(true);
  const [analisismedicos, setAnalisisMedicos] = useState({})
  const [values, setValues] = useState({})

  const handleChangeAnalisisMedicos = (e) => {
    setValues({
      ...values,
      analisismedicos: e
    })
  }

  const loadAnalisisMedicos = async() => {
    const response = await showAllAnalisisMedico()
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      const analisisMedicosRes = response.data
      setAnalisisMedicos(analisisMedicosRes)
    }
  }

  const loadAll = async () => {
    setIsLoading(true);
    await loadAnalisisMedicos()
    setIsLoading(false);
  }

  useEffect(() => {
    loadAll();
  }, []);

  return (
    <Fragment>
      {
        !isLoading ?
          <FormItemEstudio
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={open}
            onClickCancel={onClose}
            values={values}
            analisismedicos={analisismedicos}
            onClickAgregarEstudios={onClickAgregarEstudios}
            onChangeAnalisisMedicos={(e) => handleChangeAnalisisMedicos(e)}
          />
          : <Backdrop className={classes.backdrop} open={isLoading} >
            <CircularProgress color="inherit" />
          </Backdrop>
      }
    </Fragment>


  );
}

export default ModalItemEstudio;