import React, { useState, useEffect, Fragment } from 'react';
import { findHistoricAparatologiaByPaciente } from "./../../../../services/aparatolgia";
import Aparatologia from './Aparatologia';
import { toFormatterCurrency, addZero } from '../../../../utils/utils';
import { Backdrop, CircularProgress, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const TabAparatologia = (props) => {

  const classes = useStyles();

  const {
    open,
    onClose,
    paciente,
    sucursal,
    servicio,
    empleado,
  } = props;

  const [historial, setHistorial] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const columns = [
    { title: 'FECHA', field: 'fecha_show' },
    { title: 'HORA', field: 'hora' },
    { title: 'PRODUCTO (ÁREAS)', field: 'show_tratamientos' },
    { title: 'TIPO CITA', field: 'tipo_cita.nombre' },
    { title: 'ESTADO', field: 'status.nombre' },
    { title: 'SUCURSAL', field: 'sucursal.nombre' },
    { title: 'PRECIO', field: 'precio_moneda' },
  ];

  const options = {
    rowStyle: rowData => {
      return {
        color: rowData.status.color,
        backgroundColor: rowData.pagado ? process.env.REACT_APP_PAGADO_COLOR : ''
      };
    },
    headerStyle: {
      backgroundColor: process.env.REACT_APP_TOP_BAR_COLOR,
      color: '#FFF',
      fontWeight: 'bolder',
      fontSize: '18px'
    },
		exportAllData: true,
		exportButton: true,
		exportDelimiter: ';'
  }

  useEffect(() => {
    const loadHistorial = async () => {
      if (servicio) {
        const response = await findHistoricAparatologiaByPaciente(paciente._id, empleado.access_token);
        if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
          response.data.forEach(item => {
            item.precio_moneda = toFormatterCurrency(item.precio);
            item.show_tratamientos = item.tratamientos ? item.tratamientos.map(tratamiento => {
              const show_areas = tratamiento.areasSeleccionadas ? tratamiento.areasSeleccionadas.map(area => {
                return `${area.nombre}`;
              }) : '';
              return `►${tratamiento.nombre}(${show_areas}) `;
            }) : '';
            const date = new Date(item.fecha_hora);
            const dia = addZero(date.getDate());
            const mes = addZero(date.getMonth() + 1);
            const anio = date.getFullYear();
            const hora = Number(date.getHours());
            const minutos = date.getMinutes();
            item.fecha_show = `${dia}/${mes}/${anio}`;
            item.hora = `${addZero(hora)}:${addZero(minutos)}`;
          });
          setHistorial(response.data);
        }
      }
      setIsLoading(false);
    }

    loadHistorial();
  }, [paciente, servicio]);

  return (
    <Fragment>
      {
        !isLoading ?
          <Aparatologia
            open={open}
            onClickCancel={onClose}
            historial={historial}
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

export default TabAparatologia;