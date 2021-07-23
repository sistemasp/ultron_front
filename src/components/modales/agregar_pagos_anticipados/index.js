import React, { useState, useEffect } from 'react';
import * as Yup from "yup";
import { Formik } from 'formik';
import {
  showAllBanco,
  showAllMetodoPago,
  showAllTipoTarjeta,
  createPago,
  updatePago,
} from '../../../services';
import {
  createEntrada, /*findEntradaByPago,*/ updateEntrada,
} from '../../../services/entradas';
import { generateFolio } from '../../../utils/utils';
import { findEsquemaById } from '../../../services/esquemas';
import { Backdrop, CircularProgress } from '@material-ui/core';
import myStyles from '../../../css';
import { Fragment } from 'react';
import { findTurnoActualBySucursal } from '../../../services/corte';
import FormPagosAnticipados from './FormAgregarPagosAnticipados';
import { getAllServices } from '../../../services/servicios';
import { findTreatmentByServicio } from '../../../services/tratamientos';

const AgregarPagosAnticipados = (props) => {

  const {
    open,
    onClose,
    servicio,
    empleado,
    setOpenAlert,
    setMessage,
    sucursal,
    colorBase,
  } = props;

  const classes = myStyles(colorBase)();

  const porcetanjeComision = process.env.REACT_APP_COMISION_PAGO_TARJETA;
  const enConsultorioStatusId = process.env.REACT_APP_EN_CONSULTORIO_STATUS_ID;

  const sucursalManuelAcunaId = process.env.REACT_APP_SUCURSAL_MANUEL_ACUNA_ID;
  const tipoEntradaConsultaId = process.env.REACT_APP_TIPO_INGRESO_CONSULTA_ID;
  const tipoEntradaCirugiaId = process.env.REACT_APP_TIPO_INGRESO_CIRUGIA_ID;
  const tipoEntradaFacialesId = process.env.REACT_APP_TIPO_INGRESO_FACIALES_ID;
  const tipoEntradaEsteticaId = process.env.REACT_APP_TIPO_INGRESO_ESTETICA_ID;
  const tipoEntradaAparatologiaId = process.env.REACT_APP_TIPO_INGRESO_APARATOLOGIA_ID;
  const tipoEntradaLaserId = process.env.REACT_APP_TIPO_INGRESO_LASER_ID;
  const tipoEntradaDermapenId = process.env.REACT_APP_TIPO_INGRESO_DERMAPEN_ID;
  const tipoEntradaOtrosId = process.env.REACT_APP_TIPO_INGRESO_OTROS_ID;
  const servicioFacialId = process.env.REACT_APP_FACIAL_SERVICIO_ID;
  const servicioDermapenlId = process.env.REACT_APP_DERMAPEN_SERVICIO_ID;
  const servicioLaserId = process.env.REACT_APP_LASER_SERVICIO_ID;
  const servicioAparatologiaId = process.env.REACT_APP_APARATOLOGIA_SERVICIO_ID;
  const servicioConsultaId = process.env.REACT_APP_CONSULTA_SERVICIO_ID;
  const servicioCirugiaId = process.env.REACT_APP_CIRUGIA_SERVICIO_ID;
  const servicioBiopsiaId = process.env.REACT_APP_BIOPSIA_SERVICIO_ID;
  const servicioEsteticaId = process.env.REACT_APP_ESTETICA_SERVICIO_ID;
  const dermatologoDirectoId = process.env.REACT_APP_DERMATOLOGO_DIRECTO_ID;
  const tipoCitaRevisadoId = process.env.REACT_APP_TIPO_CITA_REVISADO_ID;
  const tipoCitaDerivadoId = process.env.REACT_APP_TIPO_CITA_DERIVADO_ID;
  const tipoCitaRealizadoId = process.env.REACT_APP_TIPO_CITA_REALIZADO_ID;
  const frecuenciaReconsultaId = process.env.REACT_APP_FRECUENCIA_RECONSULTA_ID;

  const [servicios, setServicios] = useState([]);
  const [tratamientos, setTratamientos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bancos, setBancos] = useState([]);
  const [formasPago, setFormasPago] = useState([]);
  const [tiposTarjeta, setTiposTarjeta] = useState([]);
  const [esquema, setEsquema] = useState({});
  const [turno, setTurno] = useState({});

  const [values, setValues] = useState({

  });

  console.log("KAOZ", tratamientos.length);

  const loadTratamientos = async (servicioId) => {
    const response = await findTreatmentByServicio(servicioId);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setTratamientos(response.data);
    }
  }

  const handleChangeTratamientos = (e) => {
    // setSelectedAreas(false);
    // e.map(async (tratamiento) => {
    //   setIsLoading(true);
    //   const response = await findAreasByTreatmentServicio(tratamiento.servicio, tratamiento._id);
    //   if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
    //     tratamiento.areas = response.data;
    //     setIsLoading(false);
    //     setValues({
    //       ...values,
    //       precio: 0,
    //       tratamientos: e,
    //     });
    //   }
    // });
  };

  const handleClickGuardarPago = async () => {

  }

  const handleChangeServicio = async (event) => {
    const servicioId = event.target.value;
    await loadTratamientos(servicioId);
    setValues({
      ...values,
      servicio: servicioId,
    });
  }

  const loadBancos = async () => {
    const response = await showAllBanco();
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setBancos(response.data);
    }
  }

  const loadMetodosPago = async () => {
    const response = await showAllMetodoPago();
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setFormasPago(response.data);
    }
  }

  const loadTipoTarjeta = async () => {
    const response = await showAllTipoTarjeta();
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setTiposTarjeta(response.data);
    }
  }

  const getTurno = async () => {
    const response = await findTurnoActualBySucursal(sucursal._id);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      const corte = response.data;
      setTurno(corte.turno);
    }
  }

  const loadServicios = async () => {
    const response = await getAllServices();
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setServicios(response.data);
    }
  }

  const loadAll = async () => {
    setIsLoading(true);
    await loadServicios();
    await loadBancos();
    await loadMetodosPago();
    await loadTipoTarjeta();
    await getTurno();
    setIsLoading(false);
  }

  useEffect(() => {
    loadAll();
  }, []);

  return (
    <Fragment>
      {
        !isLoading ?
          <FormPagosAnticipados
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            values={values}
            servicios={servicios}
            tratamientos={tratamientos}
            isLoading={isLoading}
            open={open}
            bancos={bancos}
            formasPago={formasPago}
            tiposTarjeta={tiposTarjeta}
            onClickCancel={onClose}
            onChangeServicio={(e) => handleChangeServicio(e)}
            onChangeTratamientos={(e) => handleChangeTratamientos(e)}
            colorBase={colorBase}
            onClickGuardar={handleClickGuardarPago} />
          : <Backdrop className={classes.backdrop} open={isLoading} >
            <CircularProgress color="inherit" />
          </Backdrop>
      }

    </Fragment>
  );
}

export default AgregarPagosAnticipados;