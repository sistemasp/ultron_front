import React, { useState, useEffect, Fragment } from "react";
import { Backdrop, CircularProgress, FormControl, MenuItem, Select } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import myStyles from "../../../../../css";
import { TraspasosContainer } from "./traspasos";
import { dateToString } from "../../../../../utils/utils";
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import { responseCodeCreate } from "../../../../../utils/constants";
import { sucursalToAlmacen } from "../../../../../utils/centinela_utils";
import { createTraspaso, deleteTraspaso, findTraspasosByAlmacenDestino, findTraspasosByAlmacenOrigen } from "../../../../../services/centinela/traspasos";
import { deleteRegistroTraspaso } from "../../../../../services/centinela/registrotraspasos";
import { centinelaBackgroundColorEnProceso, centinelaBackgroundColorEnviado, centinelaBackgroundColorOk, centinelaStatusEnProcesoId, centinelaStatusEnviadoId, centinelaStatusFinalizadoId, centinelaStatusPendienteId, centinelaTextColorEnProceso, centinelaTextColorEnviado, centinelaTextColorOK } from "../../../../../utils/centinela_constants";
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import VisibilityIcon from '@mui/icons-material/Visibility';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Traspasos = (props) => {

  const classes = myStyles();

  const [solicitudesEnviadas, setSolicitudesEnviadas] = useState([]);
  const [solicitudesRecibidas, setSolicitudesRecibidas] = useState([]);
  const [traspaso, setTraspaso] = useState({});
  const [open, setOpen] = useState(false);
  const [openAsignar, setOpenAsignar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');
  const [openAlert, setOpenAlert] = useState(false);

  const {
    empleado,
    colorBase,
    sucursal,
  } = props;

  const almacen = sucursalToAlmacen(sucursal._id);

  const columnsEnviadas = [
    { title: 'FECHA', field: 'fecha_show' },
    { title: 'ALMACEN', field: 'almacen_origen.descripcion' },
    { title: 'STATUS', field: 'status.descripcion' },
  ];

  const columnsRecibidas = [
    { title: 'FECHA', field: 'fecha_show' },
    { title: 'ALMACEN', field: 'almacen_destino.descripcion' },
    { title: 'STATUS', field: 'status.descripcion' },
  ];

  const options = {
    rowStyle: rowData => {
      return {
        color: rowData.status.id == centinelaStatusEnviadoId ? centinelaTextColorEnviado :
          (rowData.status.id == centinelaStatusFinalizadoId ? centinelaTextColorOK :
            (rowData.status.id == centinelaStatusEnProcesoId ? centinelaTextColorEnProceso : '')),
        backgroundColor: rowData.status.id == centinelaStatusEnviadoId ? centinelaBackgroundColorEnviado :
          (rowData.status.id == centinelaStatusFinalizadoId ? centinelaBackgroundColorOk :
            (rowData.status.id == centinelaStatusEnProcesoId ? centinelaBackgroundColorEnProceso : ''))
      };
    },
    headerStyle: {
      backgroundColor: colorBase,
      color: '#FFF',
      fontWeight: 'bolder',
      fontSize: '18px',
      textAlign: 'center',
    },
    cellStyle: {
      fontWeight: 'bolder',
      fontSize: '16px',
      padding: '5px',
      textAlign: 'center',
    },
    exportAllData: true,
    exportButton: empleado.super_admin,
    exportDelimiter: ';',
  }

  const handleOnClickEditar = (event, rowData) => {
    setTraspaso(rowData);
    setOpen(true);
  }

  const handleOnClickRevisado = async (event, rowData) => {
    const newTraspaso = {
      ...rowData,
      status: centinelaStatusFinalizadoId,
    };
    const response = await createTraspaso(newTraspaso);
    if (`${response.status}` === responseCodeCreate) {
      loadAll();
    }
  }

  const handleOnClickAsignar = async (event, rowData) => {
    setTraspaso(rowData);
    const newTraspaso = {
      ...rowData,
      status: centinelaStatusEnProcesoId,
    };
    const response = await createTraspaso(newTraspaso);
    if (`${response.status}` === responseCodeCreate) {
      setOpenAsignar(true);
    }
  }

  const handleOnClickEliminar = async (event, rowData) => {
    setIsLoading(true);
    rowData.registros.map(async (registro) => {
      await deleteRegistroTraspaso(registro.id);
    });
    await deleteTraspaso(rowData.id);
    loadSolicitudesEnviadas();
    setIsLoading(false);
  }

  const actionsEnviados = [
    {
      icon: VisibilityIcon,
      tooltip: 'VER',
      onClick: handleOnClickEditar
    },
    rowData => {
      return rowData.status.id == centinelaStatusPendienteId ?
        {
          icon: EditIcon,
          tooltip: 'EDITAR',
          onClick: handleOnClickEditar
        } : ''
    },
    rowData => {
      return rowData.status.id == centinelaStatusPendienteId ? {
        icon: DeleteForeverIcon,
        tooltip: 'ELIMINAR',
        onClick: handleOnClickEliminar
      } : ''
    },
    rowData => {
      return rowData.status.id == centinelaStatusEnviadoId ? {
        icon: CheckBoxIcon,
        tooltip: 'REVISAR',
        onClick: handleOnClickRevisado
      } : ''
    },
  ];

  const actionsRecibidos = [
    {
      icon: VisibilityIcon,
      tooltip: 'VER',
      onClick: handleOnClickEditar
    },
    rowData => {
      return rowData.status.id == centinelaStatusPendienteId || rowData.status.id == centinelaStatusEnProcesoId ?
        {
          icon: AssignmentTurnedInIcon,
          tooltip: 'ASIGNAR',
          onClick: handleOnClickAsignar
        } : ''
    },
  ];

  const handleOpen = async () => {
    const traspaso = {
      almacen_origen: almacen,
      almacen_destino: almacen,
      status: centinelaStatusPendienteId,
      total: 0,
      fecha: new Date(),
      registros: []
    };
    const response = await createTraspaso(traspaso);
    if (`${response.status}` === responseCodeCreate) {
      setTraspaso(response.data);
      setOpen(true);
    }
  }

  const handleClose = () => {
    setOpen(false);
    setOpenAsignar(false);
  }

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  const loadSolicitudesEnviadas = async () => {
    const response = await findTraspasosByAlmacenDestino(almacen);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      const resSolicitudesEnviadas = response.data.forEach(item => {
        item.fecha_show = dateToString(item.fecha);
      });
      setSolicitudesEnviadas(response.data);
    }
  };

  const loadSolicitudesRecibidas = async () => {
    const response = await findTraspasosByAlmacenOrigen(almacen);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      const resSolicitudesResibidas = response.data.forEach(item => {
        item.fecha_show = dateToString(item.fecha);
      });
      setSolicitudesRecibidas(response.data);
    }
  };

  const loadAll = async () => {
    setIsLoading(true);
    await loadSolicitudesEnviadas();
    await loadSolicitudesRecibidas();
    setIsLoading(false);
  }

  useEffect(() => {
    loadAll();
  }, []);

  return (
    <Fragment>
      {
        !isLoading ?
          <TraspasosContainer
            empleado={empleado}
            columnsEnviadas={columnsEnviadas}
            columnsRecibidas={columnsRecibidas}
            tituloEnviados='SOLICITUDES ENVIADAS'
            tituloRecibidos='SOLICITUDES RECIBIDAS'
            solicitudesEnviadas={solicitudesEnviadas}
            solicitudesRecibidas={solicitudesRecibidas}
            traspaso={traspaso}
            options={options}
            actionsEnviados={actionsEnviados}
            actionsRecibidos={actionsRecibidos}
            setMessage={setMessage}
            setSeverity={setSeverity}
            setOpenAlert={setOpenAlert}
            handleOpen={handleOpen}
            handleClose={handleClose}
            loadSolicitudesEnviadas={loadSolicitudesEnviadas}
            loadSolicitudesRecibidas={loadSolicitudesRecibidas}
            open={open}
            openAsignar={openAsignar}
            sucursal={sucursal}
            almacen={almacen}
            colorBase={colorBase} /> :
          <Backdrop className={classes.backdrop} open={isLoading} >
            <CircularProgress color="inherit" />
          </Backdrop>
      }
      <Snackbar open={openAlert} autoHideDuration={5000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
    </Fragment>
  );
}

export default Traspasos;