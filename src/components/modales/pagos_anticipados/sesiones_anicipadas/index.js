import React, { useState, useEffect, Fragment } from 'react';
import { findHistoricAparatologiaByPaciente } from "../../../../services/aparatolgia";
import SesionesAnticipadas from './SesionesAnticipadas';
import { toFormatterCurrency, addZero } from '../../../../utils/utils';
import { Backdrop, CircularProgress, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const TabSesionesAnticipadas = (props) => {

  const classes = useStyles();

  const {
    open,
    onClose,
    paciente,
    sucursal,
    pagosAnticipados,
    empleado,
    colorBase,
  } = props;

  const [sesionesAnticipadas, setSesionesAnticipadas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const columns = [
    { title: 'FECHA PAGO', field: 'fecha_show' },
    { title: 'FECHA ASISTENCIA', field: 'fecha_show' },
    { title: 'SUCURSAL', field: 'sucursal.nombre' },
    { title: 'PACIENTE', field: 'hora' },
    { title: 'SERVICIO', field: 'show_tratamientos' },
    { title: 'PRODUCTO (ÁREAS)', field: 'show_tratamientos' },
    { title: 'PRECIO', field: 'tipo_cita.nombre' },
    { title: 'TOTAL', field: 'status.nombre' },
    { title: 'OBSERVACIONES', field: 'precio_moneda' },
  ];

  const options = {
    rowStyle: rowData => {
      return {
        color: rowData.status.color,
        backgroundColor: rowData.pagado ? process.env.REACT_APP_PAGADO_COLOR : ''
      };
    },
    headerStyle: {
      backgroundColor: colorBase,
      color: '#FFF',
      fontWeight: 'bolder',
      fontSize: '18px'
    },
		exportAllData: true,
		exportButton: true,
		exportDelimiter: ';'
  }

  const loadSesionesAnticipadas = async () => {

  }

  const loadAll = async () => {
    setIsLoading(true);
    loadSesionesAnticipadas();
    setIsLoading(false);
  }

  useEffect(() => {
    loadAll();
  }, []);

  return (
    <Fragment>
      {
        !isLoading ?
          <SesionesAnticipadas
            open={open}
            onClickCancel={onClose}
            sesionesAnticipadas={sesionesAnticipadas}
            columns={columns}
            options={options}
            sucursal={sucursal}
            titulo={''} /> :
          <Backdrop className={classes.backdrop} open={isLoading} >
            <CircularProgress color="inherit" />
          </Backdrop>
      }
    </Fragment>
  );
}

export default TabSesionesAnticipadas;