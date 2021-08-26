import React, { useState, useEffect, Fragment } from 'react';
import {
  showAllMaterials,
  createConsecutivo,
  findSchedulesBySucursalAndServicio,
  showAllMetodoPago,
  showAllMedios,
  showAllFrecuencias,
} from "../../../services";
import {
  createCirugia,
  updateCirugia,
} from "../../../services/cirugias";
import { Backdrop, CircularProgress, makeStyles } from '@material-ui/core';
import { addZero } from '../../../utils/utils';
import ModalFormCirugia from './ModalFormCirugia';
import { createBiopsia } from '../../../services/biopsias';
import { findProductoByServicio } from '../../../services/productos';
import { showAllStatusVisibles } from '../../../services/status';
import { findEmployeesByRolIdAvailable } from '../../../services/empleados';
import { createSalida, findSalidaById, updateSalida } from '../../../services/salidas';
import { findTurnoActualBySucursal } from '../../../services/corte';

const useStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const ModalCirugia = (props) => {

  const classes = useStyles();

  const {
    open,
    onClose,
    empleado,
    loadCirugias,
    sucursal,
    setOpenAlert,
    setMessage,
    setFilterDate,
    cirugia,
    colorBase,
  } = props;

  const token = empleado.access_token;

  const efectivoMetodoPagoId = process.env.REACT_APP_FORMA_PAGO_EFECTIVO;
  const promovendedorRolId = process.env.REACT_APP_PROMOVENDEDOR_ROL_ID;
  const dermatologoRolId = process.env.REACT_APP_DERMATOLOGO_ROL_ID;
  const pendienteStatusId = process.env.REACT_APP_PENDIENTE_STATUS_ID;
  const asistioStatusId = process.env.REACT_APP_ASISTIO_STATUS_ID;
  const reagendoStatusId = process.env.REACT_APP_REAGENDO_STATUS_ID;
  const enProcedimientoStatusId = process.env.REACT_APP_EN_PROCEDIMIENTO_STATUS_ID;
  const patologoRolId = process.env.REACT_APP_PATOLOGO_ROL_ID;
  const cirugiaServicioId = process.env.REACT_APP_CIRUGIA_SERVICIO_ID;
  const biopsiaServicioId = process.env.REACT_APP_BIOPSIA_SERVICIO_ID;
  const frecuenciaPrimeraVezId = process.env.REACT_APP_FRECUENCIA_PRIMERA_VEZ_ID;
  const frecuenciaReconsultaId = process.env.REACT_APP_FRECUENCIA_RECONSULTA_ID;
  const productoCirugiaId = process.env.REACT_APP_PRODUCTO_CIRUGIA_ID;
  const tipoSalidaCuracionesId = process.env.REACT_APP_TIPO_SALIDA_CURACIONES_ID;

  const [isLoading, setIsLoading] = useState(true);
  const [materiales, setMateriales] = useState([]);
  const [patologos, setPatologos] = useState([]);
  const [dermatologos, setDermatologos] = useState([]);

  const [previousState, setPreviousState] = useState();
  const [openModalPagos, setOpenModalPagos] = useState(false);
  const [horarios, setHorarios] = useState([]);
  const [formasPago, setFormasPago] = useState([]);
  const [frecuencias, setFrecuencias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [statements, setStatements] = useState([]);
  const [medios, setMedios] = useState([]);
  const [turno, setTurno] = useState({});
  const [openModalConfirmacion, setOpenModalConfirmacion] = useState(false);

  const fecha_cita = new Date(cirugia.fecha_hora);
  const fecha = `${addZero(fecha_cita.getDate())}/${addZero(Number(fecha_cita.getMonth()) + 1)}/${addZero(fecha_cita.getFullYear())}`;
  const hora = `${addZero(Number(fecha_cita.getHours()))}:${addZero(fecha_cita.getMinutes())}`;


  const [values, setValues] = useState({
    _id: cirugia._id,
    fecha_hora: cirugia.fecha_hora,
    fecha_actual: fecha,
    hora_actual: hora,
    consultaId: cirugia.consultaId,
    consecutivo: cirugia.consecutivo,
    sucursal: cirugia.sucursal,
    precio: cirugia.precio,
    total: cirugia.total,
    materiales: cirugia.materiales,
    biopsias: cirugia.biopsias,
    pagado: cirugia.pagado,
    servicio: cirugia.servicio,
    status: cirugia.status._id,
    tipo_cita: cirugia.tipo_cita,
    paciente: cirugia.paciente,
    dermatologo: cirugia.dermatologo._id,
    hasBiopsia: cirugia.hasBiopsia,
    cantidad_biopsias: cirugia.biopsias ? cirugia.biopsias.length : 0,
    costo_biopsias: cirugia.costo_biopsias ? cirugia.costo_biopsias : 0,
    hora_aplicacion: cirugia.hora_aplicacion,
    total_aplicacion: cirugia.total_aplicacion,
    frecuencia: cirugia.frecuencia._id,
    medio: cirugia.medio._id,
    forma_pago: cirugia.forma_pago._id,
    producto: cirugia.producto._id,
    observaciones: cirugia.observaciones,
    patologo: cirugia.biopsias.length > 0 ? cirugia.biopsias[0].patologo : undefined,
    hora: 0,
    minutos: 0,
  });

  const dataComplete = values.pagado;

  const handleChangeMateriales = async (items) => {
    setIsLoading(true);
    setValues({
      ...values,
      materiales: items
    });
    setIsLoading(false);
  }

  const handleClickCrearCirugia = async (event, data) => {
    setIsLoading(true);
    const fecha_actual = new Date();
    data.servicio = cirugiaServicioId;

    if (data.hasBiopsia && cirugia.biopsias.length === 0) {
      const biopsias = [];
      const idBiopsias = [];

      for (var i = 0; i < data.cantidad_biopsias; i++) {
        const biopsia = {
          fecha_realizacion: fecha_actual,
          dermatologo: data.dermatologo._id,
          paciente: data.paciente._id,
          sucursal: data.sucursal,
          patologo: data.patologo,
          tipo_servicio: biopsiaServicioId,
          hora_aplicacion: data.hora_aplicacion ? data.hora_aplicacion : new Date(),
        };
        biopsias.push(biopsia);
      }
      const resp = await createBiopsia(biopsias);
      if (`${resp.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
        resp.data.map(item => {
          idBiopsias.push(item._id);
        });
      }
      data.biopsias = data.hasBiopsia ? idBiopsias : [];
    }

    if (data.status._id !== pendienteStatusId) {
      data.quien_confirma_asistencia = empleado._id;

      if (data.status === asistioStatusId) {
        const dateNow = new Date();
        data.hora_aplicacion = data.hora_aplicacion ? data.hora_aplicacion : dateNow;
        data.hora_llegada = (data.hora_llegada && data.hora_llegada !== '--:--') ? data.hora_llegada : `${addZero(dateNow.getHours())}:${addZero(dateNow.getMinutes())}`;
      }
    }
    if (data.status === reagendoStatusId) {
      await updateCirugia(data._id, data, empleado.access_token);
      data.quien_agenda = empleado._id;
      data.sucursal = sucursal;
      data.status = pendienteStatusId;
      data.hora_llegada = '--:--';
      data.observaciones = `CIRUGíA REAGENDADA ${values.fecha_actual} - ${values.hora}:${values.minutos} HRS`;
      data.fecha_hora = data.nueva_fecha_hora;
      data._id = undefined;
      const fecha_hora = new Date(data.fecha_hora);
      const response = await createCirugia(data, empleado.access_token);
      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
        setOpenAlert(true);
        setMessage('CIRUGíA REAGENDADA CORRECTAMENTE');
        const dia = addZero(fecha_hora.getDate());
        const mes = addZero(fecha_hora.getMonth() + 1);
        const anio = fecha_hora.getFullYear();
        setFilterDate({
          fecha_show: fecha_hora,
          fecha: `${dia}/${mes}/${anio}`
        });
        await loadCirugias(fecha_hora);
      }
    } else {
      const fecha_hora = new Date(data.fecha_hora);
      const dia = addZero(fecha_hora.getDate());
      const mes = addZero(fecha_hora.getMonth() + 1);
      const anio = fecha_hora.getFullYear();
      setFilterDate({
        fecha_show: fecha_hora,
        fecha: `${dia}/${mes}/${anio}`
      });
      if (data.materiales.length > 0) {
        data.materiales.forEach(async (material) => {
          const responseSalida = await (material.salidaId ? findSalidaById(material.salidaId) : '0');

          if (responseSalida === '0' || `${responseSalida.status}` === process.env.REACT_APP_RESPONSE_CODE_OK
            || `${responseSalida.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
            const resSalida = responseSalida.data;

            const salida = {
              ...resSalida,
              create_date: new Date(),
              hora_aplicacion: data.hora_aplicacion ? data.hora_aplicacion : new Date(),
              tipo_salida: tipoSalidaCuracionesId,
              recepcionista: empleado,
              turno: turno === 'm' ? 'MATUTINO' : 'VESPERTINO',
              concepto: material.nombre,
              cantidad: material.precio,
              retencion: 0,
              sucursal: sucursal,
              forma_pago: efectivoMetodoPagoId,
            }

            const response = await (salida._id ? updateSalida(salida._id, salida, token) : createSalida(salida, token));
            if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK
              || `${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
              material.salidaId = material.salidaId ? material.salidaId : response.data._id;
              await updateCirugia(data._id, data, empleado.access_token)
              await loadCirugias(fecha_hora);
            }
          }
        });
      } else {
        await updateCirugia(data._id, data, empleado.access_token)
        await loadCirugias(fecha_hora);
      }
    }
    setIsLoading(false);
    onClose();
  }

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value
    });
  }

  const calcularTotal = (val) => {
    let total_aplicacion = Number(val.total);
    values.materiales.map(item => {
      total_aplicacion -= Number(item.precio);
    });
    total_aplicacion -= Number(val.costo_biopsias);
    setValues({
      ...values,
      precio: val.total,
      total: val.total,
      total_aplicacion: total_aplicacion,
      materiales: val.materiales,
      costo_biopsias: val.costo_biopsias,
    });
  }

  const handleChangeTotal = e => {
    const val = {
      total: e.target.value,
      total_aplicacion: values.total_aplicacion,
      materiales: values.materiales,
      costo_biopsias: values.costo_biopsias,
    }
    calcularTotal(val);
  };

  const handleChangeItemPrecio = (e, index) => {
    const newMateriales = values.materiales;
    newMateriales[index].precio = e.target.value;
    const val = {
      total: values.total,
      total_aplicacion: values.total_aplicacion,
      materiales: newMateriales,
      costo_biopsias: values.costo_biopsias,
    }
    calcularTotal(val);
  }

  const handleChangeCostoBiopsias = e => {
    const val = {
      total: values.total,
      total_aplicacion: values.total_aplicacion,
      materiales: values.materiales,
      costo_biopsias: e.target.value,
    }
    calcularTotal(val);
  }

  const handleCloseModalPagos = () => {
    setOpenModalPagos(false);
    setValues({ ...values, pagado: false });
  }

  const handleGuardarModalPagos = (pagos) => {
    setValues({
      ...values,
      pagado: true,
      pagos: pagos,
    });
    setOpenModalPagos(false);
  }

  const handleChangePagado = (e) => {
    //setValues({ ...values, pagado: !values.pagado });
    setOpenModalPagos(!values.pagado);
  }

  const handleChangeBiopsia = (e) => {
    const newValue = !values.hasBiopsia;
    if (newValue) {
      setValues({
        ...values,
        hasBiopsia: newValue,
      });
    } else {
      const val = {
        total: values.total,
        total_aplicacion: values.total_aplicacion,
        materiales: values.materiales,
        costo_biopsias: 0,
      }
      calcularTotal(val);
      setValues({
        ...values,
        hasBiopsia: newValue,
        biopsias: [],
        cantidad_biopsias: 0,
        costo_biopsias: 0,
        patologo: {},
      });

    }
  }

  const handleChangeDermatologos = (e) => {
    setValues({ ...values, dermatologo: e.target.value });
  }


  const loadHorariosByServicio = async () => {
    const response = await findSchedulesBySucursalAndServicio(cirugia.sucursal._id, cirugia.servicio._id);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      response.data.push({ hora: values.hora });
      setHorarios(response.data);
    }
  }

  const handleChangeFecha = async (date) => {
    setIsLoading(true);
    const fechaObservaciones = `${addZero(date.getDate())}/${addZero(Number(date.getMonth() + 1))}/${date.getFullYear()} - ${values.hora}:${values.minutos} HRS`;
    await setValues({
      ...values,
      nueva_fecha_hora: date,
      observaciones: fechaObservaciones,
    });
    setIsLoading(false);
  };

  const handleChangeMedio = (e) => {
    setValues({ ...values, medio: e.target.value });
  }

  const handleChangeObservaciones = e => {
    setValues({ ...values, observaciones: e.target.value.toUpperCase() });
  }

  const handleChangeProductos = (e) => {
    setValues({ ...values, producto: e.target.value });
  }

  const handleChangeMotivos = e => {
    setValues({ ...values, motivos: e.target.value.toUpperCase() });
  }

  const handleChangeHora = e => {
    setIsLoading(true);
    const hora = (e.target.value);
    const date = new Date(values.nueva_fecha_hora);
    date.setHours(Number(hora));
    date.setMinutes(Number(values.minutos));
    date.setSeconds(0);
    const fechaObservaciones = `${addZero(date.getDate())}/${addZero(Number(date.getMonth() + 1))}/${date.getFullYear()} - ${hora}:${values.minutos} HRS`;
    setValues({
      ...values,
      nueva_fecha_hora: date,
      hora: hora,
      observaciones: fechaObservaciones,
    });
    setIsLoading(false);
  };

  const handleChangeMinutos = e => {
    setIsLoading(true);
    const minutos = e.target.value;
    const date = new Date(values.nueva_fecha_hora);
    date.setHours(Number(values.hora));
    date.setMinutes(minutos);
    date.setSeconds(0);
    const fechaObservaciones = `${addZero(date.getDate())}/${addZero(Number(date.getMonth() + 1))}/${date.getFullYear()} - ${values.hora}:${minutos} HRS`;
    setValues({
      ...values,
      nueva_fecha_hora: date,
      minutos: minutos,
      observaciones: fechaObservaciones,
    });

    setIsLoading(false);
  };

  const handleChangeFrecuencia = (e) => {
    const frecuencia = e.target.value;
    setValues({
      ...values,
      frecuencia: frecuencia,
      producto: frecuencia === frecuenciaPrimeraVezId ? productoCirugiaId : values.producto,
    });
  }

  const handleChangePaymentMethod = (event) => {
    setValues({
      ...values,
      forma_pago: event.target.value,
    });
  }

  const handleChangeStatus = e => {
    setPreviousState(values.status);
    const estado = statements.find(statement => {
      return statement._id === e.target.value;
    });
    setOpenModalConfirmacion(estado.confirmacion);
    setValues({ ...values, status: e.target.value });
  }

  const loadFormasPago = async () => {
    const response = await showAllMetodoPago();
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setFormasPago(response.data);
    }
  }

  const loadMedios = async () => {
    const response = await showAllMedios();
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setMedios(response.data);
    }
  }

  const loadFrecuencias = async () => {
    const response = await showAllFrecuencias();
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setFrecuencias(response.data);
    }
  }

  const loadStaus = async () => {
    const response = await showAllStatusVisibles();
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      // SI EL DIA DE LA CITA ES A FUTURO, ELIMINA EL STATUS ASISTIO
      const resStatus = response.data.filter(item => {
        return item._id !== asistioStatusId ? true : new Date(cirugia.fecha_hora).getDate() === new Date().getDate();
      });
      setStatements(resStatus);
    }
    setIsLoading(false);
  }

  const loadProductos = async () => {
    const response = await findProductoByServicio(cirugiaServicioId);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setProductos(response.data);
    }
  }

  const loadMateriales = async () => {
    const response = await showAllMaterials();
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setMateriales(response.data);
    }
  }

  const loadDermatologos = async () => {
    const response = await findEmployeesByRolIdAvailable(dermatologoRolId, empleado.access_token);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setDermatologos(response.data);
    }
  }


  const loadPatologos = async () => {
    const response = await findEmployeesByRolIdAvailable(patologoRolId, empleado.access_token);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setPatologos(response.data);
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
    await loadMateriales();
    await loadPatologos();
    await loadHorariosByServicio();
    await loadFormasPago();
    await loadMedios();
    await loadFrecuencias();
    await loadProductos();
    await loadDermatologos();
    await loadStaus();
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
          <ModalFormCirugia
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={open}
            onClose={onClose}
            empleado={empleado}
            onClickCrearCirugia={handleClickCrearCirugia}
            onChangeFecha={(e) => handleChangeFecha(e)}
            onChange={handleChange}
            onChangeTotal={handleChangeTotal}
            openModalPagos={openModalPagos}
            onCloseModalPagos={handleCloseModalPagos}
            onGuardarModalPagos={handleGuardarModalPagos}
            onChangeMateriales={(e) => handleChangeMateriales(e)}
            sucursal={sucursal}
            materiales={materiales}
            onChangeItemPrecio={handleChangeItemPrecio}
            values={values}
            dataComplete={dataComplete}
            horarios={horarios}
            colorBase={colorBase}
            onChangePagado={(e) => handleChangePagado(e)}
            onChangeBiopsia={(e) => handleChangeBiopsia(e)}
            onChangeCostoBiopsias={handleChangeCostoBiopsias}
            onChangeFrecuencia={(e) => handleChangeFrecuencia(e)}
            frecuencias={frecuencias}
            onChangeStatus={(e) => handleChangeStatus(e)}
            statements={statements}
            onChangeProductos={(e) => handleChangeProductos(e)}
            onChangeDermatologos={(e) => handleChangeDermatologos(e)}
            onChangeObservaciones={handleChangeObservaciones}
            medios={medios}
            formasPago={formasPago}
            dermatologos={dermatologos}
            onChangeMedio={(e) => handleChangeMedio(e)}
            onChangePaymentMethod={(e) => handleChangePaymentMethod(e)}
            productos={productos}
            patologos={patologos}
            tipoServicioId={cirugiaServicioId}
            frecuenciaReconsultaId={frecuenciaReconsultaId}
            onChangeMotivos={handleChangeMotivos}
            onChangeHora={(e) => handleChangeHora(e)}
            onChangeMinutos={(e) => handleChangeMinutos(e)}
            cirugia={cirugia} />
          :
          <Backdrop className={classes.backdrop} open={isLoading} >
            <CircularProgress color="inherit" />
          </Backdrop>
      }
    </Fragment>

  );
}

export default ModalCirugia;