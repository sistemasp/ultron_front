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
import { generateFolio, toFormatterCurrency } from '../../../utils/utils';
import { findEsquemaById } from '../../../services/esquemas';
import { Backdrop, CircularProgress, TablePagination } from '@material-ui/core';
import myStyles from '../../../css';
import { Fragment } from 'react';
import { findTurnoActualBySucursal } from '../../../services/corte';
import FormAgregarPagosAnticipados from './FormAgregarPagosAnticipados';
import { getAllServices } from '../../../services/servicios';
import { findTreatmentByServicio } from '../../../services/tratamientos';
import { findAreasByTreatmentServicio } from '../../../services/areas';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import TablePaginationActions from '@material-ui/core/TablePagination/TablePaginationActions';
import { useSelect } from 'react-select-search';
import { createSesionAnticipada, deleteSesionAnticipada, showAllSesionesAnticipadasByPaciente } from '../../../services/sesiones_anticipadas';

const AgregarPagosAnticipados = (props) => {

  const {
    open,
    onClose,
    servicio,
    empleado,
    paciente,
    setOpenAlert,
    setMessage,
    sucursal,
    colorBase,
    token,
  } = props;

  const classes = myStyles(colorBase)();

  const porcetanjeComision = process.env.REACT_APP_COMISION_PAGO_TARJETA;
  const enConsultorioStatusId = process.env.REACT_APP_EN_CONSULTORIO_STATUS_ID;

  const sucursalManuelAcunaId = process.env.REACT_APP_SUCURSAL_MANUEL_ACUNA_ID;
  const sucursalOcciId = process.env.REACT_APP_SUCURSAL_OCCI_ID;
  const sucursalFedeId = process.env.REACT_APP_SUCURSAL_FEDE_ID;
  const sucursalRubenDarioId = process.env.REACT_APP_SUCURSAL_RUBEN_DARIO_ID;
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

  const [sesionesAnticipadas, setSesionesAnticipadas] = useState([]);
  const [totalPagar, setTotalPagar] = useState([]);
  const [precioPagar, setPrecioPagar] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [tratamientos, setTratamientos] = useState([]);
  const [selectedAreas, setSelectedAreas] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [bancos, setBancos] = useState([]);
  const [formasPago, setFormasPago] = useState([]);
  const [tiposTarjeta, setTiposTarjeta] = useState([]);
  const [esquema, setEsquema] = useState({});
  const [turno, setTurno] = useState({});
  const [openModalPagosMultiservicios, setOpenModalPagosMultiservicios] = useState(false);
  const [pagoAnticipado, setPagoAnticipado] = useState({});

  const [values, setValues] = useState({
    porcentaje_descuento_clinica: 0,
  });

  const columns = [
    { title: 'SERVICIO', field: 'servicio.nombre' },
    { title: 'PRODUCTO', field: 'producto' },
    { title: 'PRECIO', field: 'precio_moneda' },
    { title: 'DESCUENTO PORCENTAJE', field: 'descuento_porcentaje' },
    { title: 'DESCUENTO CANTIDAD', field: 'descuento_moneda' },
    { title: 'TOTAL', field: 'total_moneda' },
    { title: 'OBSERVACIONES', field: 'observaciones' },
  ];

  const handleEliminarSesionAnticipada = async (event, value) => {
    setIsLoading(true);
    const response = await deleteSesionAnticipada(value._id, token);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      await loadSesionesAnticipadas();
    }
    setIsLoading(false);
  }

  const actions = [
    {
      icon: DeleteForeverIcon,
      tooltip: 'ELIMINAR',
      onClick: handleEliminarSesionAnticipada
    },
  ];

  const options = {
    headerStyle: {
      backgroundColor: colorBase,
      color: '#FFF',
      fontWeight: 'bolder',
      fontSize: '18px'
    },
    cellStyle: {
      fontWeight: 'bolder',
      fontSize: '16px',
      padding: '5px',
      textAlign: 'center',
    },
    paging: false,
  }

  const components = {
    Pagination: props => {
      return <TablePagination
        {...props}
        rowsPerPageOptions={[5, 10, 20, 30, sesionesAnticipadas.length]}
      />
    },
  }

  const loadTratamientos = async (servicioId) => {
    const response = await findTreatmentByServicio(servicioId);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setTratamientos(response.data);
    }
  }

  const handleChangeTratamientos = (e) => {
    setSelectedAreas(false);
    e.map(async (tratamiento) => {
      setIsLoading(true);
      const response = await findAreasByTreatmentServicio(tratamiento.servicio, tratamiento._id);
      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
        tratamiento.areas = response.data;
        setIsLoading(false);
        setValues({
          ...values,
          precio: 0,
          tratamientos: e,
        });
      }
    });
  };

  const calcularTotal = (datos) => {
    const precio = Number(datos.precio);
    const descuento_clinica = precio * Number(datos.porcentaje_descuento_clinica) / 100;

    let total = precio - descuento_clinica;

    setValues({
      ...values,
      precio: precio,
      descuento_clinica: descuento_clinica,
      porcentaje_descuento_clinica: datos.porcentaje_descuento_clinica,
      total: total,
    });
  }

  const handleChangeAreas = async (items, tratamiento) => {
    setSelectedAreas(items.length > 0);
    tratamiento.areasSeleccionadas = items;
    setIsLoading(true);
    let precio = 0;

    values.tratamientos.forEach(tratam => {
      if (tratam.areasSeleccionadas) {
        tratam.areasSeleccionadas.map((item) => {
          const itemPrecio =
            sucursal === sucursalManuelAcunaId ? item.precio_ma // PRECIO MANUEL ACUÑA
              : (sucursal === sucursalOcciId ? item.precio_oc // PRECIO OCCIDENTAL
                : (sucursal === sucursalFedeId ? item.precio_fe // PRECIO FEDERALISMO
                  : (sucursal === sucursalRubenDarioId ? item.precio_rd // PRECIO RUBEN DARIO
                    : 0))); // ERROR
          precio = Number(precio) + Number(itemPrecio);
          item.precio_real = itemPrecio;
        });
      }
    });

    const datos = {
      ...values,
      precio: precio,
    }
    calcularTotal(datos);

    setIsLoading(false);
  }

  const handleChangeDescuento = (event) => {
    const datos = {
      ...values,
      porcentaje_descuento_clinica: event.target.value,
    }
    calcularTotal(datos);
  }

  const handleClickAgregarSesion = async (event, value) => {
    setIsLoading(true);
    value.fecha_pago = new Date();
    value.sucursal = sucursal;
    value.paciente = paciente._id;
    value.tratamientos.map((tratamiento) => {
      tratamiento.areas = [];
    });
    const response = await createSesionAnticipada(value, token);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
      await loadSesionesAnticipadas();
    }
    setIsLoading(false);
  }

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value.toUpperCase()
    });
  }

  const handleClickGuardarPago = async () => {

  }

  const handleChangeServicio = async (event) => {
    const servicio = event.target.value;
    await loadTratamientos(servicio._id);
    setValues({
      ...values,
      servicio: servicio,
      tratamientos: [],
    });
  }

  const handleClickPagosMultiservicios = (event, rowData) => {
    setPagoAnticipado({
      fecha_pago: "",
      sucursal: sucursal,
      paciente: paciente,
      sesionesAnticipadas: sesionesAnticipadas,
      total: totalPagar,
      precio: precioPagar,
      observaciones: "",
    });
    setOpenModalPagosMultiservicios(true);
  }

  const handleClosePagosMultiservicios = (event, rowData) => {
    setOpenModalPagosMultiservicios(false);
  }

  const loadSesionesAnticipadas = async () => {
    const response = await showAllSesionesAnticipadasByPaciente(paciente._id, token);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      const sesionesAnticipadasResponse = response.data;
      let totalPago = 0;
      let precioPago = 0;
      sesionesAnticipadasResponse.map((item) => {
        totalPago += Number(item.total);
        precioPago += Number(item.precio);
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
      setTotalPagar(totalPago);
      setPrecioPagar(precioPago);
      setSesionesAnticipadas(sesionesAnticipadasResponse);
    }
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
    const response = await findTurnoActualBySucursal(sucursal);
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
    await loadSesionesAnticipadas();
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
          <FormAgregarPagosAnticipados
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            values={values}
            titulo="SESIONES ANTICIPADAS"
            columns={columns}
            sesionesAnticipadas={sesionesAnticipadas}
            totalPagar={totalPagar}
            actions={actions}
            options={options}
            components={components}
            servicios={servicios}
            tratamientos={tratamientos}
            isLoading={isLoading}
            open={open}
            bancos={bancos}
            formasPago={formasPago}
            tiposTarjeta={tiposTarjeta}
            onClickCancel={onClose}
            pagoAnticipado={pagoAnticipado}
            openModalPagosMultiservicios={openModalPagosMultiservicios}
            onChangeServicio={(e) => handleChangeServicio(e)}
            onChangeTratamientos={(e) => handleChangeTratamientos(e)}
            onChangeAreas={handleChangeAreas}
            onChangeDescuento={(e) => handleChangeDescuento(e)}
            onClickAgregarSesion={handleClickAgregarSesion}
            onChange={handleChange}
            onClickPagosMultiservicios={(e) => handleClickPagosMultiservicios(e)}
            onClosePagosMultiservicios={handleClosePagosMultiservicios}
            colorBase={colorBase}
            selectedAreas={selectedAreas}
            onClickGuardar={handleClickGuardarPago} />
          : <Backdrop className={classes.backdrop} open={isLoading} >
            <CircularProgress color="inherit" />
          </Backdrop>
      }

    </Fragment>
  );
}

export default AgregarPagosAnticipados;