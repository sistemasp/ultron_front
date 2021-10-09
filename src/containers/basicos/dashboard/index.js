import React, { Fragment, useEffect, useState } from "react";
import { Formik } from "formik";
import io from 'socket.io-client';
import socketIOClient from "socket.io-client";
import { showAllOffices } from "../../../services";
import withStyles from "@material-ui/core/styles/withStyles";
import { DashboardContainer } from "./dashboard";
import { withRouter } from 'react-router-dom';
import * as Yup from "yup";
import { Snackbar, Grid, Backdrop, CircularProgress } from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';
import bannerMePiel from './../../../bannerMePiel.PNG';
import { login } from "../../../services/empleados";
import { addZero } from "../../../utils/utils";
import { findEntradasByRangeDateAndSucursal } from "../../../services/pagos";
import { showActivesTipoEntradas } from "../../../services/tipo_entradas";
import { findPaysByRangeDateAndSucursal } from "../../../services/pagos";
import { getAllServices } from "../../../services/servicios";

const styles = theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: `${theme.spacing(5)}px ${theme.spacing(5)}px ${theme.spacing(5)}px`
  },
  container: {
    maxWidth: "200px"
  },
  title: {
    color: "#2BA6C6"
  }
});

const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const validationSchema = Yup.object({
  employee_number: Yup.string("Ingresa tu numero de empleado")
    .required("El numero de empleado es requerido"),
});


const DashboardForm = (props) => {

  const {
    sucursal,
    empleado,
    history,
    colorBase,
  } = props;

  const classes = props;

  const token = empleado.access_token;

  const [sucursales, setSucursales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDirecto, setIsDirecto] = useState(false);

  const [openAlert, setOpenAlert] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');

  const rolPromovendedorId = process.env.REACT_APP_PROMOVENDEDOR_ROL_ID;
  const rolCosmetologaId = process.env.REACT_APP_COSMETOLOGA_ROL_ID;
  const rolDermatologoId = process.env.REACT_APP_DERMATOLOGO_ROL_ID;
  const rolPatologoId = process.env.REACT_APP_PATOLOGO_ROL_ID;
  const rolDirectorId = process.env.REACT_APP_DIRECTOR_ROL_ID;
  const rolEncargadoSucursalId = process.env.REACT_APP_ENCARGADO_SUCURSAL_ROL_ID;
  const rolEncargadoCosmetologasId = process.env.REACT_APP_ENCARGADO_COSMETOLOGAS_ROL_ID;
  const rolRecepcionistaId = process.env.REACT_APP_RECEPCIONISTA_ROL_ID;
  const rolEnfermeraId = process.env.REACT_APP_ENFERMERA_ROL_ID;
  const rolAdministacionId = process.env.REACT_APP_ADMINISTRACION_ROL_ID;
  const rolDiosSupremoId = process.env.REACT_APP_DIOS_SUPREMO_ROL_ID;
  const rolMasterId = process.env.REACT_APP_MASTER_ROL_ID;
  const rolSistemasId = process.env.REACT_APP_SISTEMAS_ROL_ID;
  const rolSupervisorId = process.env.REACT_APP_SUPERVISOR_ROL_ID;
  const rolAuxiliarAdministrativoId = process.env.REACT_APP_AUXILIAR_ADMINISTRATIVO_ROL_ID;
  const dermatologoDirectoId = process.env.REACT_APP_DERMATOLOGO_DIRECTO_ID;

  const date = new Date();
  const dia = addZero(date.getDate());
  const mes = addZero(date.getMonth() + 1);
  const anio = date.getFullYear();

  const [startDate, setStartDate] = useState({
    fecha_show: date,
    fecha: `${dia}/${mes}/${anio}`,
  });

  const [endDate, setEndDate] = useState({
    fecha_show: date,
    fecha: `${dia}/${mes}/${anio}`,
  });

  const procesarSucursales = async (resSucursales, tipoServicios) => {
    const sd = startDate.fecha_show;
    const ed = endDate.fecha_show;

    await resSucursales.map(async (sucursal) => {
      sucursal.pagos = [];
      let totalEntradas = 0;
      const response = await findPaysByRangeDateAndSucursal(sd.getDate(), sd.getMonth(), sd.getFullYear(),
        ed.getDate(), ed.getMonth(), ed.getFullYear(), sucursal._id, token);
      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
        const pagos = response.data;
        tipoServicios.forEach((tipoServicio, index) => {

          let totalEntrada = 0;
          const fiterEntradas = pagos.filter(pago => {
            return (isDirecto ? pago.dermatologo._id === dermatologoDirectoId : true) && pago.tipo_servicio === tipoServicio._id;
          });
          fiterEntradas.forEach(pago => {
            totalEntrada += Number(pago.cantidad);
          });
          totalEntradas += Number(totalEntrada);
          const pago = {
            nombre: tipoServicio.nombre,
            total_pago: totalEntrada,
          };
          sucursal.pagos.push(pago);
        });
      }
      sucursal.total_pagos = totalEntradas;
    });

    setSucursales(resSucursales);
    setTimeout(async () => {
      setIsLoading(false);
    }, 1000);
  }

  const loadSucursales = async (tipoServicios) => {
    const response = await showAllOffices();
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      await procesarSucursales(response.data, tipoServicios);
    }
  }

  const loadTipoServicios = async () => {
    const response = await getAllServices();
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      await loadSucursales(response.data);
    }
  }

  const handleChangeDirecto = () => {
    setIsDirecto(!isDirecto);
  }

  const handleChangeStartDate = async (date) => {
    setIsLoading(true);
    const dia = addZero(date.getDate());
    const mes = addZero(date.getMonth() + 1);
    const anio = date.getFullYear();
    setStartDate({
      fecha_show: date,
      fecha: `${dia}/${mes}/${anio}`
    });
    setIsLoading(false);
  };

  const handleChangeEndDate = async (date) => {
    setIsLoading(true);
    const dia = addZero(date.getDate());
    const mes = addZero(date.getMonth() + 1);
    const anio = date.getFullYear();
    setEndDate({
      fecha_show: date,
      fecha: `${dia}/${mes}/${anio}`
    });

    setIsLoading(false);
  };

  const handleReportes = async () => {
    setIsLoading(true);
    await loadTipoServicios();
  }

  const loadAll = async () => {
    setIsLoading(true);
    await loadTipoServicios();
  }

  useEffect(() => {
    loadAll();
  }, []);

  return (
    <Fragment>
      {
        !isLoading ?
          <DashboardContainer
            onChangeStartDate={(e) => handleChangeStartDate(e)}
            onChangeEndDate={(e) => handleChangeEndDate(e)}
            startDate={startDate.fecha_show}
            endDate={endDate.fecha_show}
            sucursales={sucursales}
            colorBase={colorBase}
            onClickReportes={handleReportes}
            isDirecto={isDirecto}
            onChangeDirecto={handleChangeDirecto}
            {...props} />
          : <Backdrop className={classes.backdrop} open={isLoading} >
            <CircularProgress color="inherit" />
          </Backdrop>
      }
    </Fragment>
  );
}

export default withRouter(withStyles(styles)(DashboardForm));
