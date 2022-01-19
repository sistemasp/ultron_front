import React, { useState, useEffect, Fragment } from 'react';
import { findHistoricAparatologiaByPaciente } from "../../../../services/aparatolgia";
import SesionesAnticipadas from './SesionesAnticipadas';
import { toFormatterCurrency, addZero, dateToString } from '../../../../utils/utils';
import { Backdrop, CircularProgress, makeStyles } from '@material-ui/core';
import { showAllPagoAnticipadosByPaciente } from '../../../../services/pagos_anticipados';
import { showAllSesionesAnticipadasByPaciente } from '../../../../services/sesiones_anticipadas';
import { date } from 'yup';

const useStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const TabSesionesAnticipadas = (props) => {

  const classes = useStyles();

  const [openModalAgregarSesionesAnticipadas, setOpenModalAgregarSesionesAnticipadas] = useState(false);

  const {
    open,
    onClose,
    paciente,
    sucursal,
    pagosAnticipados,
    empleado,
    colorBase,
    token,
  } = props;

  const [sesionesAnticipadas, setSesionesAnticipadas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const columns = [
    { title: 'FECHA PAGO', field: 'fecha_pago_show' },
    { title: 'FECHA ASISTENCIA', field: 'fecha_asistencia_show' },
    { title: 'NÚMERO DE SESIÓN', field: 'numero_sesion' },
    { title: 'SUCURSAL', field: 'sucursal.nombre' },
    { title: 'SERVICIO', field: 'servicio.nombre' },
    { title: 'PRODUCTO (ÁREAS)', field: 'producto' },
    { title: 'PRECIO', field: 'precio_moneda' },
    { title: 'DESCUENTO PORCENTAJE', field: 'descuento_porcentaje' },
    { title: 'DESCUENTO CANTIDAD', field: 'descuento_moneda' },
    { title: 'TOTAL', field: 'total_moneda' },
    { title: 'OBSERVACIONES', field: 'observaciones' },
  ];

  const options = {
    rowStyle: rowData => {
      return {
        color: rowData.fecha_asistencia ? '#FF0000' : '#000000',
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

  const handleClickAgregarSesionesAnticipadas = (event, rowData) => {
    setOpenModalAgregarSesionesAnticipadas(true);
  }

  const handleCerrarAgregarSesionesAnticipadas = (event, rowData) => {
    setOpenModalAgregarSesionesAnticipadas(false);
  }

  const handleClickAgregarPagosAnticipados = (event, rowData) => {
    setOpenModalAgregarSesionesAnticipadas(false);
    loadSesionesAnticipadas();
  }

  const loadSesionesAnticipadas = async () => {
    const response = await showAllSesionesAnticipadasByPaciente(paciente._id, token);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      const sesionesAnticipadasResponse = response.data;
      sesionesAnticipadasResponse.map((item) => {
        item.fecha_pago_show = dateToString(item.fecha_pago);
        item.fecha_asistencia_show = item.fecha_asistencia ? dateToString(item.fecha_asistencia) : 'PENDIENTE';
        item.precio_moneda = toFormatterCurrency(item.precio);
        item.descuento_porcentaje = `${item.porcentaje_descuento_clinica} %`;
        item.descuento_moneda = toFormatterCurrency(item.descuento_clinica);
        item.total_moneda = toFormatterCurrency(item.total);
        item.producto = item.tratamientos.map(tratamiento => {
          const show_areas = tratamiento.areasSeleccionadas.map(area => {
            return `${area.nombre}`;
          });
          return `►${tratamiento.nombre}(${show_areas}) `;
        });
      });
      setSesionesAnticipadas(sesionesAnticipadasResponse);
    }
  }

  const loadAll = async () => {
    setIsLoading(true);
    await loadSesionesAnticipadas();
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
            paciente={paciente}
            columns={columns}
            options={options}
            sucursal={sucursal}
            colorBase={colorBase}
            token={token}
            empleado={empleado}
            onClickAgregarSesionesAnticipadas={handleClickAgregarSesionesAnticipadas}
            onCerrarAgregarSesionesAnticipadas={handleCerrarAgregarSesionesAnticipadas}
            openModalAgregarSesionesAnticipadas={openModalAgregarSesionesAnticipadas}
            onClickAgregarPagosAnticipados={handleClickAgregarPagosAnticipados}
            titulo={''} /> :
          <Backdrop className={classes.backdrop} open={isLoading} >
            <CircularProgress color="inherit" />
          </Backdrop>
      }
    </Fragment>
  );
}

export default TabSesionesAnticipadas;