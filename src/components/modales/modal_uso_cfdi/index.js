import React, { useState, useEffect, Fragment } from 'react';
import ModalFormUsoCfdi from './ModalFormUsoCfdi';
import { showAllUsoCfdis } from '../../../services';
import { Formik } from 'formik';
import { Backdrop, CircularProgress, makeStyles } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { updateFacial } from '../../../services/faciales';
import { updateDermapen } from '../../../services/dermapens';
import { updateAparatologia } from '../../../services/aparatolgia';
import { updateConsult } from '../../../services/consultas';
import { updateCirugia } from '../../../services/cirugias';
import { updateEstetica } from '../../../services/esteticas';
import { createFactura } from '../../../services/facturas';

const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  }
}));

const ModalUsoCfdi = (props) => {

  const classes = useStyles();

  const [usoCfdis, setUsoCfdis] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const {
    open,
    onClose,
    factura,
    //pago,
    servicio,
    closeRazonSocial,
  } = props;

  const servicioFacialId = process.env.REACT_APP_FACIAL_SERVICIO_ID;
  const servicioDermapenlId = process.env.REACT_APP_DERMAPEN_SERVICIO_ID;
  const servicioAparatologiaId = process.env.REACT_APP_APARATOLOGIA_SERVICIO_ID;
  const servicioConsultaId = process.env.REACT_APP_CONSULTA_SERVICIO_ID;
  const servicioCirugiaId = process.env.REACT_APP_CIRUGIA_SERVICIO_ID;
  const servicioEsteticaId = process.env.REACT_APP_ESTETICA_SERVICIO_ID;

  const [values, setValues] = useState({
    paciente: factura.paciente,
    razon_social: factura.razon_social,
    servicio: factura.servicio,
    tipo_servicio: factura.tipo_servicio,
    sucursal: factura.sucursal,
    uso_cfdi: process.env.REACT_APP_POR_DEFINIR_USO_CFDI_ID
  });

  console.log("KAOZ", values);

  const handleGenerarFactura = async (event, rowData) => {
    rowData.fecha_hora = new Date();
    const response = await createFactura(rowData);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
      servicio.factura = response.data;
      switch (servicio.servicio._id) {
        case servicioFacialId:
          await updateFacial(servicio._id, servicio);
          break;
        case servicioDermapenlId:
          await updateDermapen(servicio._id, servicio);
          break;
        case servicioAparatologiaId:
          await updateAparatologia(servicio._id, servicio);
          break;
        case servicioConsultaId:
          await updateConsult(servicio._id, servicio);
          break;
        case servicioCirugiaId:
          await updateCirugia(servicio._id, servicio);
          break;
        case servicioEsteticaId:
          await updateEstetica(servicio._id, servicio);
          break
      }
    }
    onClose();
    closeRazonSocial(true);
  }

  useEffect(() => {
    const loadUsoCfdi = async () => {
      const response = await showAllUsoCfdis();
      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
        setUsoCfdis(response.data);
      }
      setIsLoading(false);
    }

    loadUsoCfdi();
    setIsLoading(false);
  }, []);

  const handleChangeUsoCfdi = (event) => {
    setValues({
      ...values,
      uso_cfdi: event.target.value
    });
  }

  return (
    <Fragment>
      {
        !isLoading ?
          <ModalFormUsoCfdi
            open={open}
            onClose={onClose}
            usoCfdis={usoCfdis}
            values={values}
            onChangeUsoCfdi={(event) => handleChangeUsoCfdi(event)}
            onGenerarFactura={handleGenerarFactura} />
          :
          <Backdrop className={classes.backdrop} open={isLoading} >
            <CircularProgress color="inherit" />
          </Backdrop>
      }
    </Fragment>

  );
}

export default ModalUsoCfdi;