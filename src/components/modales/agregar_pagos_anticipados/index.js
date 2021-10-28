import React, { useState, useEffect } from 'react';
import * as Yup from "yup";
import { Formik } from 'formik';
import {
  showAllBanco,
  showAllMetodoPago,
  showAllTipoTarjeta,
  showAllTipoCitas,
  showAllFrecuencias,
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
import { createSesionAnticipada, deleteSesionAnticipada, showAllSesionesAnticipadasByPaciente, showAllSesionesAnticipadasByPacienteToday, updateSesionAnticipada } from '../../../services/sesiones_anticipadas';
import { findEmployeesByRolIdAvailable } from '../../../services/empleados';
import SesionesAnticipadas from '../pagos_anticipados/sesiones_anticipadas/SesionesAnticipadas';
import { createPagoAnticipado, deletePagoAnticipado, updatePagoAnticipado } from '../../../services/pagos_anticipados';
import { createFactura } from '../../../services/facturas';
import { createPago } from '../../../services/pagos';

const AgregarPagosAnticipados = (props) => {

  const {
    open,
    onClose,
    servicio,
    empleado,
    paciente,
    onClickGuardar,
    setOpenAlert,
    setMessage,
    sucursal,
    colorBase,
    token,
  } = props;

  const classes = myStyles(colorBase)();

  const date = new Date();

  const porcetanjeComision = process.env.REACT_APP_COMISION_PAGO_TARJETA;
  const enConsultorioStatusId = process.env.REACT_APP_EN_CONSULTORIO_STATUS_ID;

  const sucursalManuelAcunaId = process.env.REACT_APP_SUCURSAL_MANUEL_ACUNA_ID;
  const sucursalOcciId = process.env.REACT_APP_SUCURSAL_OCCI_ID;
  const sucursalFedeId = process.env.REACT_APP_SUCURSAL_FEDE_ID;
  const sucursalRubenDarioId = process.env.REACT_APP_SUCURSAL_RUBEN_DARIO_ID;
  const dermatologoRolId = process.env.REACT_APP_DERMATOLOGO_ROL_ID;
  const directoTipoCitaId = process.env.REACT_APP_TIPO_CITA_DIRECTO_ID;
  const tipoEntradaConsultaId = process.env.REACT_APP_TIPO_ENTRADA_CONSULTA_ID;
  const tipoEntradaCuracionId = process.env.REACT_APP_TIPO_ENTRADA_CURACION_ID;
  const tipoEntradaFacialesId = process.env.REACT_APP_TIPO_ENTRADA_FACIALES_ID;
  const tipoEntradaEsteticaId = process.env.REACT_APP_TIPO_ENTRADA_ESTETICA_ID;
  const tipoEntradaAparatologiaId = process.env.REACT_APP_TIPO_ENTRADA_APARATOLOGIA_ID;
  const tipoEntradaLaserId = process.env.REACT_APP_TIPO_ENTRADA_LASER_ID;
  const tipoEntradaDermapenId = process.env.REACT_APP_TIPO_ENTRADA_DERMAPEN_ID;
  const tipoEntradaOtrosId = process.env.REACT_APP_TIPO_ENTRADA_OTROS_ID;
  const servicioFacialId = process.env.REACT_APP_FACIAL_SERVICIO_ID;
  const servicioDermapenlId = process.env.REACT_APP_DERMAPEN_SERVICIO_ID;
  const servicioLaserId = process.env.REACT_APP_LASER_SERVICIO_ID;
  const servicioAparatologiaId = process.env.REACT_APP_APARATOLOGIA_SERVICIO_ID;
  const servicioConsultaId = process.env.REACT_APP_CONSULTA_SERVICIO_ID;
  const servicioCuracionId = process.env.REACT_APP_CURACION_SERVICIO_ID;
  const servicioBiopsiaId = process.env.REACT_APP_BIOPSIA_SERVICIO_ID;
  const servicioEsteticaId = process.env.REACT_APP_ESTETICA_SERVICIO_ID;
  const dermatologoDirectoId = process.env.REACT_APP_DERMATOLOGO_DIRECTO_ID;
  const tipoCitaRevisadoId = process.env.REACT_APP_TIPO_CITA_REVISADO_ID;
  const tipoCitaDerivadoId = process.env.REACT_APP_TIPO_CITA_DERIVADO_ID;
  const tipoCitaRealizadoId = process.env.REACT_APP_TIPO_CITA_REALIZADO_ID;
  const servicioPagoAnticipado = process.env.REACT_APP_PAGO_ANTICIPADO_SERVICIO_ID;
  const frecuenciaPrimeraVezId = process.env.REACT_APP_FRECUENCIA_PRIMERA_VEZ_ID;
  const frecuenciaReconsultaId = process.env.REACT_APP_FRECUENCIA_RECONSULTA_ID;

  const [sesionesAnticipadas, setSesionesAnticipadas] = useState([]);
  const [totalPagar, setTotalPagar] = useState([]);
  const [precioPagar, setPrecioPagar] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [tratamientos, setTratamientos] = useState([]);
  const [frecuencias, setFrecuencias] = useState([]);
  const [dermatologos, setDermatologos] = useState([]);
  const [tipoCitas, setTipoCitas] = useState([]);
  const [selectedAreas, setSelectedAreas] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [bancos, setBancos] = useState([]);
  const [formasPago, setFormasPago] = useState([]);
  const [tiposTarjeta, setTiposTarjeta] = useState([]);
  const [esquema, setEsquema] = useState({});
  const [turno, setTurno] = useState({});
  const [openModalPagosMultiservicios, setOpenModalPagosMultiservicios] = useState(false);
  const [pagoAnticipado, setPagoAnticipado] = useState({});
  const [isHoliDay, setIsHoliDay] = useState(false);
  const [cambioTurno, setCambioTurno] = useState(false);

  const [values, setValues] = useState({
    porcentaje_descuento_clinica: 0,
    dermatologo: dermatologoDirectoId,
    tipo_cita: directoTipoCitaId,
    frecuencia: frecuenciaPrimeraVezId,
    servicio: {},
  });

  const columns = [
    { title: 'SERVICIO', field: 'servicio.nombre' },
    { title: 'PRODUCTO', field: 'producto' },
    { title: 'PRECIO', field: 'precio_moneda' },
    { title: 'DESCUENTO PORCENTAJE', field: 'descuento_porcentaje' },
    { title: 'DESCUENTO CANTIDAD', field: 'descuento_moneda' },
    { title: 'TOTAL', field: 'total_moneda' },
    { title: 'NÚMERO SESIÓN', field: 'numero_sesion' },
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
      ...datos,
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
            sucursal._id === sucursalManuelAcunaId ? item.precio_ma // PRECIO MANUEL ACUÑA
              : (sucursal._id === sucursalOcciId ? item.precio_oc // PRECIO OCCIDENTAL
                : (sucursal._id === sucursalFedeId ? item.precio_fe // PRECIO FEDERALISMO
                  : (sucursal._id === sucursalRubenDarioId ? item.precio_rd // PRECIO RUBEN DARIO
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
      porcentaje_descuento_clinica: event.target.value ? event.target.value : 0,
    }
    calcularTotal(datos);
  }

  const handleChangePrecio = (event) => {
    const datos = {
      ...values,
      precio: event.target.value,
    };
    calcularTotal(datos);
  }

  const handleClickAgregarSesion = async (event, value) => {
    setIsLoading(true);
    value.fecha_pago = new Date();
    value.sucursal = sucursal._id;
    value.recepcionista = empleado._id;
    value.paciente = paciente._id;
    value.numero_sesion = sesionesAnticipadas.length + 1;
    if (value.tratamientos) {
      value.tratamientos.map((tratamiento) => {
        tratamiento.areas = [];
      });
    }
    const response = await createSesionAnticipada(value, token);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
      await loadSesionesAnticipadas();
    }
    setValues({
      ...values,
      frecuencia: frecuenciaReconsultaId,
    });
    setIsLoading(false);
  }

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value.toUpperCase()
    });
  }

  const handleChangeIds = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value
    });
  }


  const handleClickGuardarPago = async () => {

  }

  const handleChangeHoliDay = (e) => {
    const datos = {
      ...values,
      precio: !isHoliDay ? sucursal.precio_festivo : // DIA FESTIVO
        date.getDay() === 6 ? (date.getHours() >= 13 ? sucursal.precio_sabado_vespertino : sucursal.precio_sabado_matutino) // SABADO
          : (date.getHours() >= 14 ? sucursal.precio_vespertino : sucursal.precio_matutino), // L-V
    }
    calcularTotal(datos);
    setIsHoliDay(!isHoliDay);
  }

  const handleChangeServicio = async (event) => {
    const servicio = event.target.value;
    setValues({
      ...values,
      servicio: servicio,
      tratamientos: [],
    });
    if (servicio._id === servicioConsultaId) {
      const datos = {
        ...values,
        servicio: servicio,
        precio: isHoliDay ? sucursal.precio_festivo : // Dia Festivo
          date.getDay() === 6 ? (date.getHours() >= 13 ? sucursal.precio_sabado_vespertino : sucursal.precio_sabado_matutino) // SABADO
            : (date.getHours() >= 14 ? sucursal.precio_vespertino : sucursal.precio_matutino), // L-V
      }
      calcularTotal(datos);
    } else {
      await loadTratamientos(servicio._id);

    }
  }

  const handleClickPagosMultiservicios = async (event, rowData) => {
    const pagoAnticipado = {
      fecha_pago: new Date(),
      sucursal: sucursal._id,
      paciente: paciente,
      dermatologo: sesionesAnticipadas[0].dermatologo,
      tipo_cita: sesionesAnticipadas[0].tipo_cita,
      servicio: servicioPagoAnticipado,
      sesiones_anticipadas: sesionesAnticipadas,
      total: totalPagar,
      precio: precioPagar,
      observaciones: "",
    };
    const response = await createPagoAnticipado(pagoAnticipado, token);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
      setPagoAnticipado(response.data);
      setOpenModalPagosMultiservicios(true);
    }
  }

  const handleClosePagosMultiservicios = async (event, rowData) => {
    setIsLoading(true);
    const response = await deletePagoAnticipado(pagoAnticipado._id, token);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      await loadSesionesAnticipadas();
      setOpenModalPagosMultiservicios(false);
    }
    setIsLoading(false);
  }

  const handleChangeCambioTurno = (e) => {
    setIsHoliDay(false);
    const precio = date.getDay() === 6 ? (values.precio === sucursal.precio_sabado_matutino ? sucursal.precio_sabado_vespertino : sucursal.precio_sabado_matutino) // SABADO
      : (values.precio === sucursal.precio_matutino ? sucursal.precio_vespertino : sucursal.precio_matutino); // L-V

    setValues({
      ...values,
      precio: precio,
      total: precio,
    });

    setCambioTurno(!cambioTurno);
  }

  const loadSesionesAnticipadas = async () => {
    const response = await showAllSesionesAnticipadasByPacienteToday(paciente._id, token);
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

  const handleGuardarModalPagosMultiservicios = async (servicio) => {
    servicio.pagado = servicio.pagos.length > 0;
    servicio.fecha_pago = new Date();
    let ind = 0;

    if (servicio.factura) {

      const factura = {
        fecha_hora: new Date(),
        paciente: servicio.factura.paciente._id,
        razon_social: servicio.factura.razon_social._id,
        servicio: servicio.factura.servicio._id,
        tipo_servicio: servicio.factura.tipo_servicio._id,
        sucursal: servicio.factura.sucursal._id,
        uso_cfdi: servicio.factura.uso_cfdi._id,
      };

      const response = await createFactura(factura, token);

      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
        servicio.factura = response.data;

        servicio.sesiones_anticipadas.map(async (sesionAnticipada, index) => {
          sesionAnticipada.pagado = true;
          sesionAnticipada.factura = servicio.factura;
          let sesionTotal = Number(sesionAnticipada.total);
          const pagos = [];

          let tipoEntrada;
          switch (sesionAnticipada.servicio) {
            case servicioFacialId:
              tipoEntrada = tipoEntradaFacialesId;
              break;
            case servicioDermapenlId:
              tipoEntrada = tipoEntradaDermapenId;
              break;
            case servicioLaserId:
              tipoEntrada = tipoEntradaLaserId;
              break;
            case servicioAparatologiaId:
              tipoEntrada = tipoEntradaAparatologiaId;
              break;
            case servicioConsultaId:
              tipoEntrada = tipoEntradaConsultaId;
              break;
            case servicioCuracionId:
              tipoEntrada = tipoEntradaCuracionId;
              break;
            case servicioBiopsiaId:
              tipoEntrada = tipoEntradaOtrosId;
              break;
            case servicioEsteticaId:
              tipoEntrada = tipoEntradaEsteticaId;
              break
            default:
              tipoEntrada = tipoEntradaOtrosId;
              break;
          }

          servicio.pagos[ind].total = Number(servicio.pagos[ind].total);
          while (sesionTotal > 0 && servicio.pagos[ind].total !== 0) {
            let total = 0;
            if (servicio.pagos[ind].total > sesionTotal) {
              total = sesionTotal;
              servicio.pagos[ind].total -= sesionTotal;
              sesionTotal = 0;
            } else if (servicio.pagos[ind].total < sesionTotal) {
              total = servicio.pagos[ind].total;
              sesionTotal -= servicio.pagos[ind].total;
              servicio.pagos[ind].total = 0;
            } else {
              total = sesionTotal;
              sesionTotal = 0;
              servicio.pagos[ind].total = 0;
            }

            const newPago = {
              ...servicio.pagos[ind],
              total: total
            }

            delete newPago._id;

            const entrada = {
              create_date: new Date(),
              hora_aplicacion: new Date(),
              recepcionista: empleado._id,
              concepto: `SA: ${sesionAnticipada.numero_sesion}`,
              cantidad: total,
              tipo_entrada: tipoEntrada,
              sucursal: sucursal._id,
              forma_pago: newPago.forma_pago,
              pago_anticipado: true,
            }

            if (servicio.pagos[ind] && servicio.pagos[ind].total === 0 && index < (servicio.sesiones_anticipadas.length - 1)) { ind++ }

            const responsEntrada = await createEntrada(entrada);

            if (`${responsEntrada.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
              const resEntrada = responsEntrada.data;
              newPago.entrada = resEntrada._id;
              const response = await createPago(newPago, token);
              if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
                pagos.push(response.data);
              }
            }

          }

          if (sesionAnticipada.porcentaje_descuento_clinica === '100') {
            const newPago = {
              ...servicio.pagos[ind],
              total: 0
            }

            delete newPago._id;

            const entrada = {
              create_date: new Date(),
              hora_aplicacion: new Date(),
              recepcionista: empleado._id,
              concepto: `SA 100%: ${sesionAnticipada.numero_sesion}`,
              cantidad: 0,
              tipo_entrada: tipoEntrada,
              sucursal: sucursal._id,
              forma_pago: newPago.forma_pago,
              pago_anticipado: true,
            }

            const responsEntrada = await createEntrada(entrada);

            if (`${responsEntrada.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
              const resEntrada = responsEntrada.data;
              newPago.entrada = resEntrada._id;
              const response = await createPago(newPago, token);
              if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
                pagos.push(response.data);
              }
            }

          }

          sesionAnticipada.pagos = pagos;

          await updateSesionAnticipada(sesionAnticipada._id, sesionAnticipada, token);
        });
        await updatePagoAnticipado(servicio._id, servicio, token);
        await loadSesionesAnticipadas();

      }
    } else {
      servicio.sesiones_anticipadas.map(async (sesionAnticipada, index) => {
        sesionAnticipada.numero_sesion = index + 1;
        sesionAnticipada.pagado = true;
        let sesionTotal = Number(sesionAnticipada.total);
        const pagos = [];

        let tipoEntrada;
        switch (sesionAnticipada.servicio) {
          case servicioFacialId:
            tipoEntrada = tipoEntradaFacialesId;
            break;
          case servicioDermapenlId:
            tipoEntrada = tipoEntradaDermapenId;
            break;
          case servicioLaserId:
            tipoEntrada = tipoEntradaLaserId;
            break;
          case servicioAparatologiaId:
            tipoEntrada = tipoEntradaAparatologiaId;
            break;
          case servicioConsultaId:
            tipoEntrada = tipoEntradaConsultaId;
            break;
          case servicioCuracionId:
            tipoEntrada = tipoEntradaCuracionId;
            break;
          case servicioBiopsiaId:
            tipoEntrada = tipoEntradaOtrosId;
            break;
          case servicioEsteticaId:
            tipoEntrada = tipoEntradaEsteticaId;
            break
          default:
            tipoEntrada = tipoEntradaOtrosId;
            break;
        }

        servicio.pagos[ind].total = Number(servicio.pagos[ind].total);
        while (sesionTotal > 0 && servicio.pagos[ind].total !== 0) {
          let total = 0;
          if (servicio.pagos[ind].total > sesionTotal) {
            total = sesionTotal;
            servicio.pagos[ind].total -= sesionTotal;
            sesionTotal = 0;
          } else if (servicio.pagos[ind].total < sesionTotal) {
            total = servicio.pagos[ind].total;
            sesionTotal -= servicio.pagos[ind].total;
            servicio.pagos[ind].total = 0;
          } else {
            total = sesionTotal;
            sesionTotal = 0;
            servicio.pagos[ind].total = 0;
          }

          const newPago = {
            ...servicio.pagos[ind],
            total: total
          }

          delete newPago._id;

          const entrada = {
            create_date: new Date(),
            hora_aplicacion: new Date(),
            recepcionista: empleado._id,
            concepto: `SA: ${sesionAnticipada.numero_sesion}`,
            cantidad: total,
            tipo_entrada: tipoEntrada,
            sucursal: sucursal._id,
            forma_pago: newPago.forma_pago,
            pago_anticipado: true,
          }

          if (servicio.pagos[ind] && servicio.pagos[ind + 1] && servicio.pagos[ind].total === 0 && index < (servicio.sesiones_anticipadas.length - 1)) { ind++ }

          const responsEntrada = await createEntrada(entrada);

          if (`${responsEntrada.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
            const resEntrada = responsEntrada.data;
            newPago.entrada = resEntrada._id;
            const response = await createPago(newPago, token);
            if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
              pagos.push(response.data);
            }
          }
        }

        if (sesionAnticipada.porcentaje_descuento_clinica === '100') {
          const newPago = {
            ...servicio.pagos[ind],
            total: 0
          }

          delete newPago._id;

          const entrada = {
            create_date: new Date(),
            hora_aplicacion: new Date(),
            recepcionista: empleado._id,
            concepto: `SA 100%: ${sesionAnticipada.numero_sesion}`,
            cantidad: 0,
            tipo_entrada: tipoEntrada,
            sucursal: sucursal._id,
            forma_pago: newPago.forma_pago,
            pago_anticipado: true,
          }

          const responsEntrada = await createEntrada(entrada);

          if (`${responsEntrada.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
            const resEntrada = responsEntrada.data;
            newPago.entrada = resEntrada._id;
            const response = await createPago(newPago, token);
            if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
              pagos.push(response.data);
            }
          }

        }

        sesionAnticipada.pagos = pagos;

        await updateSesionAnticipada(sesionAnticipada._id, sesionAnticipada, token);
      });
      await updatePagoAnticipado(servicio._id, servicio, token);
      await loadSesionesAnticipadas();
    }

    setOpenModalPagosMultiservicios(false);
    onClickGuardar();
  }

  const loadBancos = async () => {
    const response = await showAllBanco();
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setBancos(response.data);
    }
  }

  const loadFrecuencias = async () => {
    const response = await showAllFrecuencias();
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setFrecuencias(response.data);
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

  const loadDermatologos = async () => {
    const response = await findEmployeesByRolIdAvailable(dermatologoRolId, token);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setDermatologos(response.data);
    }
  }

  const loadTipoCitas = async () => {
    const response = await showAllTipoCitas();
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setTipoCitas(response.data);
    }
  }

  const loadAll = async () => {
    setIsLoading(true);
    await loadSesionesAnticipadas();
    await loadFrecuencias();
    await loadDermatologos();
    await loadTipoCitas();
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
            frecuencias={frecuencias}
            totalPagar={totalPagar}
            actions={actions}
            sucursal={sucursal._id}
            options={options}
            components={components}
            empleado={empleado}
            dermatologos={dermatologos}
            dermatologoDirectoId={dermatologoDirectoId}
            tipoCitas={tipoCitas}
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
            isHoliDay={isHoliDay}
            onChangeHoliDay={(e) => handleChangeHoliDay(e)}
            onChangeServicio={(e) => handleChangeServicio(e)}
            onChangeTratamientos={(e) => handleChangeTratamientos(e)}
            onChangeAreas={handleChangeAreas}
            onChangeDescuento={(e) => handleChangeDescuento(e)}
            onChangePrecio={(e) => handleChangePrecio(e)}
            onClickAgregarSesion={handleClickAgregarSesion}
            onChange={handleChange}
            onChangeIds={handleChangeIds}
            onClickPagosMultiservicios={(e) => handleClickPagosMultiservicios(e)}
            onClosePagosMultiservicios={handleClosePagosMultiservicios}
            colorBase={colorBase}
            cambioTurno={cambioTurno}
            onChangeCambioTurno={(e) => handleChangeCambioTurno(e)}
            selectedAreas={selectedAreas}
            onGuardarModalPagosMultiservicios={handleGuardarModalPagosMultiservicios} />
          : <Backdrop className={classes.backdrop} open={isLoading} >
            <CircularProgress color="inherit" />
          </Backdrop>
      }

    </Fragment>
  );
}

export default AgregarPagosAnticipados;