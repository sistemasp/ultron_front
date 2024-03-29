import React, { useState, useEffect, Fragment } from 'react';
import ModalFormBuscarRazonSocial from './ModalFormBuscarRazonSocial';
import { showAllRazonSocials } from '../../../services/razones_sociales';
import { Backdrop, CircularProgress, makeStyles } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import MuiAlert from '@material-ui/lab/Alert';
import PrintIcon from '@material-ui/icons/Print';

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

const ModalBuscarRazonSocial = (props) => {

  const classes = useStyles();

  const [razonSociales, setRazonSociales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [factura, setFactura] = useState();
  const [openModalUsoCfdi, setOpenModalUsoCfdi] = useState(false);
  const [openNuevaRazonSocial, setOpenNuevaRazonSocial] = useState(false);
  const [datosImpresion, setDatosImpresion] = useState();
  const [openModalImprimirCita, setOpenModalImprimirCita] = useState(false);

  const {
    open,
    onClose,
    pago,
    servicio,
    sucursal,
    colorBase,
  } = props;

  const columns = [
    { title: 'NOMBRE COMPLETO', field: 'nombre_completo' },
    { title: 'RFC', field: 'rfc' },
    { title: 'EMAIL', field: 'email' },
    { title: 'DOMICILIO', field: 'domicilio_completo' },
    { title: 'CÓDIGO POSTAL', field: 'codigo_postal' },
    { title: 'COLONIA', field: 'colonia' },
    { title: 'TELÉFONO', field: 'telefono' },
  ];

  const options = {
    headerStyle: {
      backgroundColor: colorBase,
      color: '#FFF',
      fontWeight: 'bolder',
      fontSize: '18px'
    },
    exportAllData: true,
    exportButton: false,
    exportDelimiter: ';'
  }

  const hanldeSelectRazonSocial = (event, rowData) => {
    const factura = {
      paciente: servicio.paciente,
      razon_social: rowData,
      sucursal: servicio.sucursal,
      tipo_servicio: servicio.servicio,
      servicio: servicio,
    }
    setFactura(factura);
    setOpenModalUsoCfdi(true);
  }

  const handleCloseImprimirConsulta = (event, rowData) => {
    setOpenModalImprimirCita(false);
  }

  const handlePrint = async (event, rowData) => {
    setDatosImpresion(rowData);
    setOpenModalImprimirCita(true);
  }

  const actions = [
    {
      icon: CheckIcon,
      tooltip: 'SELECCIONAR',
      onClick: hanldeSelectRazonSocial
    },
  ];

  const loadRazonSocial = async () => {
    const response = await showAllRazonSocials();
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      await response.data.forEach(item => {
        item.domicilio_completo = `${item.domicilio} #${item.numero_exterior} ${item.numero_interior ? '- ' + item.numero_interior : ''}`;
      });
      setRazonSociales(response.data);
    }
    setIsLoading(false);
  }

  const handleCloseUsoCfdi = () => {
    setOpenModalUsoCfdi(false);
  }

  const handleOpenNuevaRazonSocial = () => {
    setOpenNuevaRazonSocial(true);
  }

  const handleCloseNuevaRazonSocial = () => {
    setOpenNuevaRazonSocial(false);
  }

  const loadAll = async () => {
    setIsLoading(true);
    await loadRazonSocial();
    setIsLoading(false);
  }

  useEffect(() => {
    loadAll();
  }, []);

  return (
    <Fragment>
      {
        !isLoading ?
          <ModalFormBuscarRazonSocial
            open={open}
            onClose={onClose}
            razonSociales={razonSociales}
            columns={columns}
            titulo='RAZÓN SOCIAL'
            actions={actions}
            options={options}
            factura={factura}
            servicio={servicio}
            sucursal={sucursal}
            openModalUsoCfdi={openModalUsoCfdi}
            datosImpresion={datosImpresion}
            openModalImprimirCita={openModalImprimirCita}
            onCloseUsoCfdi={handleCloseUsoCfdi}
            handleOpenNuevaRazonSocial={handleOpenNuevaRazonSocial}
            handleCloseNuevaRazonSocial={handleCloseNuevaRazonSocial}
            handleCloseImprimirConsulta={handleCloseImprimirConsulta}
            openNuevaRazonSocial={openNuevaRazonSocial}
            pago={pago}
            colorBase={colorBase}
            loadRazonSocial={loadRazonSocial} /> :
          <Backdrop className={classes.backdrop} open={isLoading} >
            <CircularProgress color="inherit" />
          </Backdrop>
      }
    </Fragment>

  );
}

export default ModalBuscarRazonSocial;