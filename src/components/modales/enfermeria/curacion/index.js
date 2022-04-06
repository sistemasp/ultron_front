import React, { useState, useEffect, Fragment } from 'react';

import {
  findCuracionById, updateCuracion,
} from "../../../../services/curaciones";
import { showAllCuracionMotivos } from '../../../../services/curacion_motivos';
import { showAllCuracionNombres } from '../../../../services/curacion_nombre';
import { showAllCuracionTipos } from '../../../../services/curacion_tipo';
import { showAllCuracionAreas } from '../../../../services/curacion_area';
import { Backdrop, CircularProgress, makeStyles } from '@material-ui/core';
import FormCuracion from './FormCuracion';
import { responseCodeOK } from '../../../../utils/constants';

const useStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const ModalCuracion = (props) => {

  const classes = useStyles();

  const {
    open,
    onClose,
    enfermera,
    curacion,
  } = props;

  const token = enfermera.access_token;

  const [isLoading, setIsLoading] = useState(true);
  const [motivos, setMotivos] = useState([]);
  const [curacionNombres, setCuracionNombres] = useState([]);
  const [curacionTipos, setCuracionTipos] = useState([]);
  const [areas, setAreas] = useState([]);

  const [values, setValues] = useState({});
  
  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value.toUpperCase()
    });
  }

  const handleChangeMotivos = (e, newValue) => {
    setIsLoading(true);
    setValues({
      ...values,
      curacion_motivo: newValue,
    });
    setIsLoading(false);
  };

  const handleChangeNombre = (e, newValue) => {
    setIsLoading(true);
    setValues({
      ...values,
      curacion_nombre: newValue,
    });
    setIsLoading(false);
  };

  const handleChangeTipo = (e, newValue) => {
    setIsLoading(true);
    setValues({
      ...values,
      curacion_tipo: newValue,
    });
    setIsLoading(false);
  };

  const handleChangeArea = (e, newValue) => {
    setIsLoading(true);
    setValues({
      ...values,
      curacion_area: newValue,
    });
    setIsLoading(false);
  };

  const handleClickGurardar = async (data) => {
    const response = await updateCuracion(data._id, data, token);
    if (`${response.status}` === responseCodeOK) {
      onClose();
    }
  }

  const findCuracion = async () => {
    const response = await findCuracionById(curacion._id, token);
    if (`${response.status}` === responseCodeOK) {
      setValues(response.data);
    }
  }

  const findAllCuracionMotivos = async () => {
    const response = await showAllCuracionMotivos(token);
    if (`${response.status}` === responseCodeOK) {
      setMotivos(response.data);
    }
  }

  const findAllCuracionNombres = async () => {
    const response = await showAllCuracionNombres(token);
    if (`${response.status}` === responseCodeOK) {
      setCuracionNombres(response.data);
    }
  }

  const findAllCuracionTipos = async () => {
    const response = await showAllCuracionTipos(token);
    if (`${response.status}` === responseCodeOK) {
      setCuracionTipos(response.data);
    }
  }

  const findAllCuracionAreas = async () => {
    const response = await showAllCuracionAreas(token);
    if (`${response.status}` === responseCodeOK) {
      setAreas(response.data);
    }
  }

  const loadAll = async () => {
    setIsLoading(true);
    await findCuracion();
    await findAllCuracionMotivos();
    await findAllCuracionNombres();
    await findAllCuracionTipos();
    await findAllCuracionAreas();
    setIsLoading(false);
  }

  useEffect(() => {
    loadAll();
  }, []);

  return (
    <Fragment>
      {
        !isLoading ?
          <FormCuracion
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={open}
            onClose={onClose}
            curacion={curacion}
            values={values}
            motivos={motivos}
            curacionNombres={curacionNombres}
            curacionTipos={curacionTipos}
            areas={areas}
            onClickGurardar={handleClickGurardar}
            onChange={handleChange}
            onChangeMotivos={handleChangeMotivos}
            onChangeNombre={handleChangeNombre}
            onChangeTipo={handleChangeTipo}
            onChangeArea={handleChangeArea} />
          :
          <Backdrop className={classes.backdrop} open={isLoading} >
            <CircularProgress color="inherit" />
          </Backdrop>
      }
    </Fragment>

  );
}

export default ModalCuracion;