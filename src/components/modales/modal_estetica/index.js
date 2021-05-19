import React, { useState, useEffect, Fragment } from 'react';
import {
  showAllMaterialEsteticas,
  createConsecutivo,
  showAllMaterials,
  showAllFrecuencias,
  showAllMedios,
  showAllMetodoPago,
} from "../../../services";
import { updateConsult } from '../../../services/consultas';
import {
  updateEstetica,
  createEstetica,
} from "../../../services/esteticas";
import { Backdrop, CircularProgress, makeStyles } from '@material-ui/core';
import ModalFormEstetica from './ModalFormEstetica';
import { findProductoByServicio } from '../../../services/productos';
import { showMaterialEsteticasByProducto } from '../../../services/material_estetica';
import { showAllStatusVisibles } from '../../../services/status';
import { addZero } from '../../../utils/utils';
import { findEmployeesByRolIdAvailable } from '../../../services/empleados';

const useStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const ModalEstetica = (props) => {

  const classes = useStyles();

  const {
    open,
    onClose,
    consulta,
    empleado,
    sucursal,
    setOpenAlert,
    setMessage,
    estetica,
    loadEsteticas,
    setFilterDate,
  } = props;

  const [isLoading, setIsLoading] = useState(true);
  const [toxinasRellenos, setToxinasRellenos] = useState([]);
  const [dermatologos, setDermatologos] = useState([]);
  const [promovendedores, setPromovendedores] = useState([]);
  const [cosmetologas, setCosmetologas] = useState([]);
  const [frecuencias, setFrecuencias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [medios, setMedios] = useState([]);
  const [formasPago, setFormasPago] = useState([]);
  const [statements, setStatements] = useState([]);
  const [openModalConfirmacion, setOpenModalConfirmacion] = useState(false);
  const [previousState, setPreviousState] = useState();

  const [openModalPagos, setOpenModalPagos] = useState(false);

  const fecha_estetica = new Date(estetica.fecha_hora);
  const fecha = `${addZero(fecha_estetica.getDate())}/${addZero(Number(fecha_estetica.getMonth()) + 1)}/${addZero(fecha_estetica.getFullYear())}`;
  const hora = `${addZero(Number(fecha_estetica.getHours()))}:${addZero(fecha_estetica.getMinutes())}`;

  const [values, setValues] = useState({
    _id: estetica._id,
    fecha_hora: estetica.fecha_hora,
    fecha_actual: fecha,
    hora_actual: hora,
    consultaId: estetica.consultaId,
    consecutivo: estetica.consecutivo,
    sucursal: estetica.sucursal,
    total_aplicacion: estetica.total_aplicacion ? estetica.total_aplicacion : 0,
    total: estetica.total ? estetica.total : 0,
    precio: estetica.precio,
    servicio: estetica.servicio,
    toxinas_rellenos: estetica.toxinas_rellenos ? estetica.toxinas_rellenos : [],
    materiales: estetica.materiales ? estetica.materiales : [],
    pagado: estetica.pagado,
    paciente: estetica.paciente,
    dermatologo: estetica.dermatologo._id,
    medio: estetica.medio._id,
    promovendedor: estetica.promovendedor._id,
    tipo_cita: estetica.tipo_cita,
    cosmetologa: estetica.cosmetologa._id,
    forma_pago: estetica.forma_pago._id,
    hora_aplicacion: estetica.hora_aplicacion,
    producto: estetica.producto,
    status: estetica.status._id,
    frecuencia: estetica.frecuencia._id,
    hora: 0,
    minutos: 0,
  });

  const [materiales, setMateriales] = useState([]);

  const promovendedorRolId = process.env.REACT_APP_PROMOVENDEDOR_ROL_ID;
  const dermatologoRolId = process.env.REACT_APP_DERMATOLOGO_ROL_ID;
  const pendienteStatusId = process.env.REACT_APP_PENDIENTE_STATUS_ID;
  const asistioStatusId = process.env.REACT_APP_ASISTIO_STATUS_ID;
  const reagendoStatusId = process.env.REACT_APP_REAGENDO_STATUS_ID;
  const consultaServicioId = process.env.REACT_APP_CONSULTA_SERVICIO_ID;
  const patologoRolId = process.env.REACT_APP_PATOLOGO_ROL_ID;
  const enProcedimientoStatusId = process.env.REACT_APP_EN_PROCEDIMIENTO_STATUS_ID;
  const esteticaServicioId = process.env.REACT_APP_ESTETICA_SERVICIO_ID;
  const biopsiaServicioId = process.env.REACT_APP_BIOPSIA_SERVICIO_ID;
  const cosmetologaRolId = process.env.REACT_APP_COSMETOLOGA_ROL_ID;

  const dataComplete = values.pagado;

  const handleChangeFrecuencia = (e) => {
    const frecuencia = e.target.value;
    setValues({
      ...values,
      frecuencia: frecuencia,
    });
  }

  const handleChangePaymentMethod = (event) => {
    setValues({
      ...values,
      forma_pago: event.target.value,
    });
  }

  const handleChangeToxinasRellenos = async (items) => {
    setIsLoading(true);
    setValues({
      ...values,
      toxinas_rellenos: items
    });
    setIsLoading(false);
  }

  const handleClickGuardarEstetica = async (event, data) => {
    setIsLoading(true);
    if (data.status === asistioStatusId) {
      const dateNow = new Date();
      data.hora_aplicacion = data.hora_aplicacion ? data.hora_aplicacion : dateNow;
      data.hora_llegada = (data.hora_llegada && data.hora_llegada !== '--:--') ? data.hora_llegada : `${addZero(dateNow.getHours())}:${addZero(dateNow.getMinutes())}`;
    }
    const fecha_hora = new Date(data.fecha_hora);
    if (data.status === reagendoStatusId) {
      await updateEstetica(data._id, data, empleado.access_token);
      data.quien_agenda = empleado._id;
      data.sucursal = sucursal;
      data.status = pendienteStatusId;
      data.hora_llegada = '--:--';
      data.observaciones = `ESTÉTICA REAGENDADA ${values.fecha_actual} - ${values.hora}:${values.minutos} HRS`;
      data.fecha_hora = data.nueva_fecha_hora;
      data._id = undefined;
      const fecha_hora = new Date(data.fecha_hora);
      const response = await createEstetica(data, empleado.access_token);
      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
        setOpenAlert(true);
        setMessage('ESTÉTICA REAGENDADA CORRECTAMENTE');
        const dia = addZero(fecha_hora.getDate());
        const mes = addZero(fecha_hora.getMonth() + 1);
        const anio = fecha_hora.getFullYear();
        setFilterDate({
          fecha_show: fecha_hora,
          fecha: `${dia}/${mes}/${anio}`
        });
        await loadEsteticas(fecha_hora);
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
      await updateEstetica(data._id, data, empleado.access_token)
      await loadEsteticas(fecha_hora);
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

  const handleChangeObservaciones = e => {
    setValues({ ...values, observaciones: e.target.value.toUpperCase() });
  }

  const handleChangeTotal = e => {
    let total_aplicacion = e.target.value;
    values.toxinas_rellenos.map(item => {
      total_aplicacion -= Number(item.total);
    });
    values.materiales.map(item => {
      total_aplicacion -= Number(item.precio);
    });
    setValues({
      ...values,
      total_aplicacion: total_aplicacion,
      total: e.target.value,
    });
  };

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

  const handleChangeStatus = e => {
    setPreviousState(values.status);
    const estado = statements.find(statement => {
      return statement._id === e.target.value;
    });
    setOpenModalConfirmacion(estado.confirmacion);
    setValues({ ...values, status: e.target.value });
  }

  const handleCloseModalConfirmacion = () => {
    setOpenModalConfirmacion(false);
    setValues({ ...values, status: previousState });
  }

  const handleChangePagado = (e) => {
    //setValues({ ...values, pagado: !values.pagado });
    setOpenModalPagos(!values.pagado);
  }

  const handleChangeDermatologos = (e) => {
    setValues({ ...values, dermatologo: e.target.value });
  }

  const handleChangePromovendedor = (e) => {
    setValues({ ...values, promovendedor: e.target.value });
  }

  const handleChangeCosmetologa = (e) => {
    setValues({ ...values, cosmetologa: e.target.value });
  }

  const handleChangeMedio = (e) => {
    setValues({ ...values, medio: e.target.value });
  }

  const handleChangeItemUnidades = (e, index) => {
    const newToxinasRellenos = values.toxinas_rellenos;
    newToxinasRellenos[index].unidades = e.target.value;
    newToxinasRellenos[index].total = Number(newToxinasRellenos[index].precio) * Number(e.target.value)
    let total_aplicacion = values.total;
    newToxinasRellenos.map((item) => {
      total_aplicacion -= Number(item.precio) * Number(item.unidades);
    });
    values.materiales.map(item => {
      total_aplicacion -= Number(item.precio);
    });

    setValues({
      ...values,
      toxinas_rellenos: newToxinasRellenos,
      total_aplicacion: total_aplicacion,
    });
  }

  const handleChangeProductos = items => {
    setIsLoading(true);
    setValues({
      ...values,
      producto: items
    });
    loadToxinasRellenos(items);
    setIsLoading(false);
  }

  const handleChangeItemPrecio = (e, index) => {
    const newMateriales = values.materiales;
    newMateriales[index].precio = e.target.value;
    let total_aplicacion = Number(values.total);
    newMateriales.map((item) => {
      total_aplicacion -= Number(item.precio);
    });
    values.toxinas_rellenos.map(item => {
      total_aplicacion -= Number(item.total);
    });
    setValues({
      ...values,
      materiales: newMateriales,
      total_aplicacion: total_aplicacion,
    });
  }

  const handleChangeMateriales = async (items) => {
    setIsLoading(true);
    setValues({
      ...values,
      materiales: items
    });
    setIsLoading(false);
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

  const loadProductos = async () => {
    const response = await findProductoByServicio(esteticaServicioId);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setProductos(response.data);
    }
  }

  const loadToxinasRellenos = async (productos) => {
    const productosIds = productos.map(pro => {
      return pro._id;
    });
    if (productosIds.length > 0) {
      const response = await showMaterialEsteticasByProducto(productosIds);
      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
        setToxinasRellenos(response.data);
      }
    } else {
      setToxinasRellenos([]);
    }

  }

  const loadMateriales = async () => {
    const response = await showAllMaterials();
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setMateriales(response.data);
    }
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

  const loadCosmetologas = async () => {
    const response = await findEmployeesByRolIdAvailable(cosmetologaRolId, empleado.access_token);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setCosmetologas(response.data);
    }
  }

  const loadPromovendedores = async () => {
    const response = await findEmployeesByRolIdAvailable(promovendedorRolId, empleado.access_token);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setPromovendedores(response.data);
    }
  }

  const loadDermatologos = async () => {
    const response = await findEmployeesByRolIdAvailable(dermatologoRolId, empleado.access_token);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setDermatologos(response.data);
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
      setStatements(response.data);
    }
    setIsLoading(false);
  }

  const loadAll = async () => {
    setIsLoading(true);
    await loadToxinasRellenos(values.producto);
    await loadProductos();
    await loadMateriales();
    await loadFormasPago();
    await loadMedios();
    await loadCosmetologas();
    await loadPromovendedores();
    await loadDermatologos();
    await loadFrecuencias();
    await loadStaus();
    setIsLoading(false);
  }

  useEffect(() => {
    loadAll();
  }, []);

  return (
    <Fragment>
      {
        !isLoading ?
          <ModalFormEstetica
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={open}
            onClose={onClose}
            consulta={consulta}
            empleado={empleado}
            onClickCrearEstetica={handleClickGuardarEstetica}
            onChange={handleChange}
            onChangeTotal={handleChangeTotal}
            openModalPagos={openModalPagos}
            onCloseModalPagos={handleCloseModalPagos}
            onGuardarModalPagos={handleGuardarModalPagos}
            onChangeToxinasRellenos={(e) => handleChangeToxinasRellenos(e)}
            sucursal={sucursal}
            toxinasRellenos={toxinasRellenos}
            materiales={materiales}
            onChangeItemUnidades={handleChangeItemUnidades}
            onChangeItemPrecio={handleChangeItemPrecio}
            onChangeMateriales={handleChangeMateriales}
            values={values}
            dataComplete={dataComplete}
            productos={productos}
            onChangePagado={(e) => handleChangePagado(e)}
            onChangeProductos={(e) => handleChangeProductos(e)}
            onChangeObservaciones={handleChangeObservaciones}
            onChangeStatus={(e) => handleChangeStatus(e)}
            tipoServicioId={esteticaServicioId}
            formasPago={formasPago}
            statements={statements}
            onChangePaymentMethod={(e) => handleChangePaymentMethod(e)}
            onChangePromovendedor={(e) => handleChangePromovendedor(e)}
            onChangeCosmetologa={(e) => handleChangeCosmetologa(e)}
            dermatologos={dermatologos}
            onChangeMedio={(e) => handleChangeMedio(e)}
            onChangeDermatologos={(e) => handleChangeDermatologos(e)}
            onChangeFrecuencia={(e) => handleChangeFrecuencia(e)}
            promovendedores={promovendedores}
            cosmetologas={cosmetologas}
            frecuencias={frecuencias}
            productos={productos}
            medios={medios}
            openModalConfirmacion={openModalConfirmacion}
            onCloseModalConfirmacion={handleCloseModalConfirmacion}
            onChangeFecha={(e) => handleChangeFecha(e)}
            onChangeMotivos={handleChangeMotivos}
            onChangeHora={(e) => handleChangeHora(e)}
            onChangeMinutos={(e) => handleChangeMinutos(e)}
            estetica={estetica} />
          :
          <Backdrop className={classes.backdrop} open={isLoading} >
            <CircularProgress color="inherit" />
          </Backdrop>
      }
    </Fragment>

  );
}

export default ModalEstetica;