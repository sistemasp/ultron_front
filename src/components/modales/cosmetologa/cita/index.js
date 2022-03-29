import React, { useState, useEffect, Fragment } from 'react';
import ModalFormCita from './ModalFormCita';
import { Backdrop, CircularProgress, makeStyles } from '@material-ui/core';
import { findEmployeesByRolIdAvailable } from '../../../../services/empleados';
import { responseCodeOK, rolCosmetologaId, servicioAparatologiaId, servicioFacialId } from '../../../../utils/constants';
import { findAparatologiaById, updateAparatologia } from '../../../../services/aparatolgia';
import { findFacialById, updateFacial } from '../../../../services/faciales';
import { addZero } from '../../../../utils/utils';

const useStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const ModalCita = (props) => {

  const classes = useStyles();

  const {
    open,
    onClose,
    cita,
    empleado,
    sucursal,
    setOpenAlert,
    setMessage,
    setSeverity,
    setFilterDate,
    tratamientos,
    loadAparatologias,
    loadFaciales,
    colorBase,
  } = props;

  const token = empleado.access_token;

  const [isLoading, setIsLoading] = useState(true);
  const [cosmetologas, setCosmetologas] = useState([]);

  const [values, setValues] = useState({
  });

  const handleChangeQuienRealiza = e => {
    setValues({ ...values, quien_realiza: e.target.value });
  }

  const handleChangeObservaciones = e => {
    setValues({ ...values, observaciones: e.target.value.toUpperCase() });
  }

  const handleChangeTiempo = e => {
    setValues({ ...values, tiempo: e.target.value });
  };

  const handleChangeDisparos = e => {
    setValues({ ...values, disparos: e.target.value });
  };

  const loadCosmetologas = async () => {
    const response = await findEmployeesByRolIdAvailable(rolCosmetologaId, token);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setCosmetologas(response.data);
    }
  }

  const handleOnClickActualizarCita = async (event, rowData) => {
    setIsLoading(true);
    const dateRowData = new Date(rowData.fecha_hora);
    const dia = addZero(dateRowData.getDate());
    const mes = addZero(dateRowData.getMonth());
    const anio = dateRowData.getFullYear();
    setFilterDate({
      fecha_show: dateRowData,
      fecha: `${dia}/${mes}/${anio}`
    });

    switch (cita.servicio._id) {
      case servicioAparatologiaId:
        await updateAparatologia(cita._id, rowData, token);
        await loadAparatologias(dateRowData);
        break;
      case servicioFacialId:
        await updateFacial(cita._id, rowData, token);
        await loadFaciales(dateRowData);
        break;
    }

    setIsLoading(false);
    onClose();

  }


  const findCita = async () => {
    let response;
    switch (cita.servicio._id) {
      case servicioAparatologiaId:
        response = await findAparatologiaById(cita._id, token);
        break;
      case servicioFacialId:
        response = await findFacialById(cita._id, token);
        break;
    }
    if (`${response.status}` === responseCodeOK) {
      const resCita = response.data;
      setValues(resCita);
    }
  }

  const loadAll = async () => {
    setIsLoading(true);
    await findCita();
    await loadCosmetologas();
    setIsLoading(false);
  }

  useEffect(() => {
    loadAll();
  }, []);

  return (
    <Fragment>
      {
        !isLoading ?
          <ModalFormCita
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={open}
            onClickCancel={onClose}
            values={values}
            onChangeQuienRealiza={(e) => handleChangeQuienRealiza(e)}
            onChangeTiempo={(e) => handleChangeTiempo(e)}
            onChangeDisparos={(e) => handleChangeDisparos(e)}
            tratamientos={tratamientos}
            cosmetologas={cosmetologas}
            colorBase={colorBase}
            onChangeObservaciones={handleChangeObservaciones}
            onClickActualizarCita={handleOnClickActualizarCita}
            sucursal={sucursal}
            empleado={empleado}
            setOpenAlert={setOpenAlert}
            setMessage={setMessage}
            setSeverity={setSeverity} />
          : <Backdrop className={classes.backdrop} open={isLoading} >
            <CircularProgress color="inherit" />
          </Backdrop>
      }
    </Fragment>

  );
}

export default ModalCita;