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
import { dateToString, generateFolio } from '../../../utils/utils';
import ModalFormPago from './ModalFormPago';
import { findEsquemaById } from '../../../services/esquemas';
import { Backdrop, CircularProgress } from '@material-ui/core';
import myStyles from '../../../css';
import { Fragment } from 'react';
import { findTurnoActualBySucursal } from '../../../services/corte';
import { showAllSesionesAnticipadasByPaciente, updateSesionAnticipada } from '../../../services/sesiones_anticipadas';

const ModalPago = (props) => {

  const {
    open,
    onClose,
    servicio,
    empleado,
    setOpenAlert,
    setMessage,
    sucursal,
    loadPagos,
    pago,
    restante,
    tipoServicioId,
    colorBase,
  } = props;

  const classes = myStyles(colorBase)();

  const porcetanjeComision = process.env.REACT_APP_COMISION_PAGO_TARJETA;
  const enConsultorioStatusId = process.env.REACT_APP_EN_CONSULTORIO_STATUS_ID;

  const sucursalManuelAcunaId = process.env.REACT_APP_SUCURSAL_MANUEL_ACUNA_ID;
  const tipoEntradaConsultaId = process.env.REACT_APP_TIPO_ENTRADA_CONSULTA_ID;
  const tipoEntradaCirugiaId = process.env.REACT_APP_TIPO_ENTRADA_CIRUGIA_ID;
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
  const servicioCirugiaId = process.env.REACT_APP_CIRUGIA_SERVICIO_ID;
  const servicioBiopsiaId = process.env.REACT_APP_BIOPSIA_SERVICIO_ID;
  const servicioEsteticaId = process.env.REACT_APP_ESTETICA_SERVICIO_ID;
  const dermatologoDirectoId = process.env.REACT_APP_DERMATOLOGO_DIRECTO_ID;
  const tipoCitaRevisadoId = process.env.REACT_APP_TIPO_CITA_REVISADO_ID;
  const tipoCitaDerivadoId = process.env.REACT_APP_TIPO_CITA_DERIVADO_ID;
  const tipoCitaRealizadoId = process.env.REACT_APP_TIPO_CITA_REALIZADO_ID;
  const frecuenciaReconsultaId = process.env.REACT_APP_FRECUENCIA_RECONSULTA_ID;
  const formaPagoPagoAnticipadoId = process.env.REACT_APP_FORMA_PAGO_SESION_ANTICIPADA;

  const [isLoading, setIsLoading] = useState(true);
  const [bancos, setBancos] = useState([]);
  const [formasPago, setFormasPago] = useState([]);
  const [tiposTarjeta, setTiposTarjeta] = useState([]);
  const [esquema, setEsquema] = useState({});
  const [turno, setTurno] = useState({});
  const [sesionesAnticipadas, setSesionesAnticipadas] = useState([]);

  const [values, setValues] = useState({
    forma_pago: pago.forma_pago ? pago.forma_pago._id : '',
    observaciones: pago.observaciones ? pago.observaciones : '',
    cantidad: pago.cantidad ? pago.cantidad : '0',
    porcentaje_descuento_clinica: pago.porcentaje_descuento_clinica ? pago.porcentaje_descuento_clinica : '0',
    descuento_clinica: pago.descuento_clinica ? pago.descuento_clinica : '0',
    total: pago.total ? pago.total : '0',
    pago_anticipado: pago.pago_anticipado,
    has_descuento_dermatologo: pago.descuento_dermatologo && pago.descuento_dermatologo !== '0',
    descuento_dermatologo: pago.descuento_dermatologo || 0,
  });

  const tarjetaMetodoPagoId = process.env.REACT_APP_FORMA_PAGO_TARJETA;
  const consultaServicioId = process.env.REACT_APP_CONSULTA_SERVICIO_ID;
  const consultaTratamientoId = process.env.REACT_APP_CONSULTA_TRATAMIENTO_ID;

  const handleChangePaymentMethod = (event) => {
    const formaPagoId = event.target.value;
    const datos = {
      ...values,
      forma_pago: formaPagoId,
    }
    calcularTotal(datos);

  }

  const handleChangeSesionAnticipada = (event) => {
    setValues({ ...values, sesion_anicipada: event.target.value });
  }

  const handleChangeBank = (event) => {
    setValues({ ...values, banco: event.target.value });
  }

  const handleChangeCardType = (event) => {
    setValues({ ...values, tipo_tarjeta: event.target.value });
  }

  const getMayorDescuento = () => {
    let porcentajeDescuento = 0;
    switch (servicio.servicio._id) {
      case servicioCirugiaId:
        porcentajeDescuento = esquema.porcentaje_cirugias;
        break;
      case servicioConsultaId:
        porcentajeDescuento = servicio.frecuencia._id === frecuenciaReconsultaId ? esquema.porcentaje_reconsulta : esquema.porcentaje_consulta;
        break;
      case servicioEsteticaId:
        porcentajeDescuento = esquema.porcentaje_dermocosmetica;
        break;
      case servicioAparatologiaId:
        porcentajeDescuento = esquema.porcentaje_laser;
        break;
    }

    return porcentajeDescuento;
  }

  const calcularTotal = (datos) => {
    const cantidad = datos.cantidad;
    const descuento_clinica = cantidad * datos.porcentaje_descuento_clinica / 100;

    const descuento_dermatologo = datos.has_descuento_dermatologo
      ? (servicio.dermatologo._id !== dermatologoDirectoId
        ? (getMayorDescuento())
        : 0)
      : 0;
    const descuento_dermatologo_final = (descuento_dermatologo * (cantidad - descuento_clinica) / 100);
    let total = cantidad - descuento_clinica - descuento_dermatologo_final;
    setValues({
      ...values,
      forma_pago: datos.forma_pago,
      cantidad: cantidad,
      porcentaje_descuento_clinica: datos.porcentaje_descuento_clinica,
      descuento_clinica: descuento_clinica,
      descuento_dermatologo: descuento_dermatologo_final,
      has_descuento_dermatologo: datos.has_descuento_dermatologo,
      total: total,
    });
  }

  const handleChangeDescuento = (event) => {
    const datos = {
      ...values,
      porcentaje_descuento_clinica: event.target.value,
    }
    calcularTotal(datos);
  }

  const handleChangeCantidad = (event) => {
    const datos = {
      ...values,
      cantidad: Number(event.target.value) > Number(restante) ? restante : event.target.value,
    }
    calcularTotal(datos);
  }

  const handleChangeConfirmado = (event) => {
    setValues({ ...values, deposito_confirmado: !values.deposito_confirmado });
  }

  const handleChangePagoAnticipado = (event) => {
    setValues({ ...values, pago_anticipado: !values.pago_anticipado });
  }

  const handleChangDescuentoDermatologo = (event) => {
    const datos = {
      ...values,
      has_descuento_dermatologo: !values.has_descuento_dermatologo,
    }
    calcularTotal(datos);
  }

  const handleChangeObservaciones = (event) => {
    setValues({ ...values, observaciones: event.target.value.toUpperCase() });
  }

  const handleChangeDigitos = (event) => {
    setValues({ ...values, digitos: event.target.value });
  }

  const handleClickGuardarPago = async (event, rowData) => {
    setIsLoading(true);
    rowData.fecha_pago = new Date();
    rowData.paciente = servicio.paciente._id;
    rowData.dermatologo = servicio.dermatologo._id;
    rowData.tratamientos = consultaTratamientoId;
    rowData.quien_recibe_pago = empleado._id;
    rowData.sucursal = sucursal;
    rowData.servicio = servicio._id;
    rowData.tipo_servicio = tipoServicioId;
    rowData.hora_aplicacion = servicio.hora_aplicacion;
    rowData.turno = turno;

    let tipoEntrada = '';

    switch (rowData.tipo_servicio) {
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
      case servicioCirugiaId:
        tipoEntrada = tipoEntradaCirugiaId;
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

    const create_date = new Date();
    create_date.setHours(create_date.getHours());

    let response;

    servicio.forma_pago._id = rowData.forma_pago;
    if (rowData.forma_pago === formaPagoPagoAnticipadoId && rowData.sesion_anicipada) {
      rowData.pago_anticipado = true;
      rowData.has_descuento_dermatologo = false;

      servicio.forma_pago._id = formaPagoPagoAnticipadoId;
      servicio.total = 0;

      const entrada = {
        create_date: create_date,
        hora_aplicacion: servicio.hora_aplicacion,
        recepcionista: empleado._id,
        concepto: `FOLIO: ${generateFolio(servicio)}`,
        cantidad: 0,
        tipo_entrada: tipoEntrada,
        sucursal: sucursal,
        forma_pago: rowData.forma_pago,
        pago_anticipado: true,
      }

      const sesionAnticipada = sesionesAnticipadas.find((sesion) => {
        return sesion._id === rowData.sesion_anicipada;
      });
      sesionAnticipada.fecha_asistencia = new Date();

      await updateSesionAnticipada(sesionAnticipada._id, sesionAnticipada, empleado.access_token);

      if (pago.entrada) {
        response = await updateEntrada(pago.entrada, entrada);
      } else {
        response = await createEntrada(entrada);
      }

      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED
        || `${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
        const resEntrada = response.data;
        rowData.entrada = resEntrada._id;
        const res = pago._id ? await updatePago(pago._id, rowData) : await createPago(rowData);
        if (`${res.status}` === process.env.REACT_APP_RESPONSE_CODE_OK
          || `${res.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
          resEntrada.pago = res.data._id;
          await updateEntrada(resEntrada._id, resEntrada);
          setIsLoading(false);
          onClose();
          loadPagos();
        }
      }

    } else {
      const entrada = {
        create_date: create_date,
        hora_aplicacion: servicio.hora_aplicacion,
        recepcionista: empleado._id,
        concepto: `FOLIO: ${generateFolio(servicio)}`,
        cantidad: rowData.total,
        tipo_entrada: tipoEntrada,
        sucursal: sucursal,
        forma_pago: rowData.forma_pago,
        pago_anticipado: false,
      }
      //TODO: CUIDADO AQUI
      /*const resExistEntrada = await findEntradaByPago(pago._id);
      if (`${resExistEntrada.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
        const existEntrada = resExistEntrada.data;
  
        if (existEntrada) {
          response = await updateEntrada(existEntrada._id, entrada);
        } else {
          response = await createEntrada(entrada);
        }
      }*/

      if (pago.entrada) {
        response = await updateEntrada(pago.entrada, entrada);
      } else {
        response = await createEntrada(entrada);
      }

      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED
        || `${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
        const resEntrada = response.data;
        rowData.entrada = resEntrada._id;
        const res = pago._id ? await updatePago(pago._id, rowData) : await createPago(rowData);
        if (`${res.status}` === process.env.REACT_APP_RESPONSE_CODE_OK
          || `${res.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
          resEntrada.pago = res.data._id;
          await updateEntrada(resEntrada._id, resEntrada);
          setIsLoading(false);
          onClose();
          loadPagos();
        }
      }
    }

  }

  const findSesion = (sesionesAnticipadas) => {
    return sesionesAnticipadas.filter((sesionAnticipada) => {
      return !sesionAnticipada.fecha_asistencia;
    });
  }

  const findPagoAnticipado = async () => {
    const response = await showAllSesionesAnticipadasByPaciente(servicio.paciente._id, empleado.access_token);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      const sesionesAnticipadasResponse = response.data;
      const sesionesVigenes = findSesion(sesionesAnticipadasResponse);
      sesionesVigenes.map((sesionAnticipada) => {
        const producto = sesionAnticipada.tratamientos.map(tratamiento => {
          const show_areas = tratamiento.areasSeleccionadas.map(area => {
            return `${area.nombre}`;
          });
          return `►${tratamiento.nombre}(${show_areas}) `;
        });
        sesionAnticipada.descripcion = `(${dateToString(sesionAnticipada.fecha_pago)}) ${producto}`;
      });
      setSesionesAnticipadas(sesionesVigenes);
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

  const loadEsquema = async () => {
    const response = await findEsquemaById(servicio.dermatologo.esquema);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setEsquema(response.data);
    }
  }

  const getTurno = async () => {
    const response = await findTurnoActualBySucursal(sucursal);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      const corte = response.data;
      setTurno(corte.turno);
    }
  }

  const loadAll = async () => {
    setIsLoading(true);
    await findPagoAnticipado();
    await loadBancos();
    await loadMetodosPago();
    await loadTipoTarjeta();
    await loadEsquema();
    await getTurno();
    setIsLoading(false);
  }

  useEffect(() => {
    loadAll();
  }, [sucursal]);

  return (
    <Fragment>
      {
        !isLoading ?
          <ModalFormPago
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            values={values}
            isLoading={isLoading}
            open={open}
            bancos={bancos}
            formasPago={formasPago}
            tiposTarjeta={tiposTarjeta}
            onClickCancel={onClose}
            colorBase={colorBase}
            sesionesAnticipadas={sesionesAnticipadas}
            onClickGuardar={handleClickGuardarPago}
            onChangePaymentMethod={(e) => handleChangePaymentMethod(e)}
            onChangeSesionAnticipada={(e) => handleChangeSesionAnticipada(e)}
            onChangeBank={(e) => handleChangeBank(e)}
            onChangeCardType={(e) => handleChangeCardType(e)}
            onChangeCantidad={(e) => handleChangeCantidad(e)}
            onChangeConfirmado={(e) => handleChangeConfirmado(e)}
            onChangeObservaciones={(e) => handleChangeObservaciones(e)}
            onChangeDigitos={(e) => handleChangeDigitos(e)}
            onChangeDescuento={(e) => handleChangeDescuento(e)}
            onChangePagoAnticipado={(e) => handleChangePagoAnticipado(e)}
            onChangDescuentoDermatologo={(e) => handleChangDescuentoDermatologo(e)} />
          : <Backdrop className={classes.backdrop} open={isLoading} >
            <CircularProgress color="inherit" />
          </Backdrop>
      }

    </Fragment>
  );
}

export default ModalPago;