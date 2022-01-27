import React, { useState, useEffect, Fragment } from 'react';
import {
  getAllSchedules,
  findScheduleByDateAndSucursalAndService,
  showAllTipoCitas,
  createConsecutivo,
  showAllMaterials,
  showAllFrecuencias,
  showAllMedios,
  showAllMetodoPago,
} from "../../../services";
import {
  updateEntrada,
  deleteEntrada,
  findEntradaById,
} from "../../../services/entradas";
import ModalFormDermapen from './ModalFormDermapen';
import { Backdrop, CircularProgress, makeStyles } from '@material-ui/core';
import { addZero } from '../../../utils/utils';
import { createDermapen, updateDermapen } from '../../../services/dermapens';
import { showAllStatusVisibles } from '../../../services/status';
import { findAreasByTreatmentServicio } from '../../../services/areas';
import { findEmployeesByRolIdAvailable } from '../../../services/empleados';
import { deletePago, updatePago } from '../../../services/pagos';
import { createSalida, findSalidaById, updateSalida } from '../../../services/salidas';
import { formaPagoEfectivoId, tipoSalidaCuracionesId } from '../../../utils/constants';

const useStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const ModalDermapen = (props) => {

  const classes = useStyles();

  const {
    open,
    onClose,
    dermapen,
    empleado,
    loadDermapens,
    sucursal,
    setOpenAlert,
    setMessage,
    setFilterDate,
    colorBase,
  } = props;

  const token = empleado.access_token;

  const promovendedorRolId = process.env.REACT_APP_PROMOVENDEDOR_ROL_ID;
  const cosmetologaRolId = process.env.REACT_APP_COSMETOLOGA_ROL_ID;
  const dermatologoRolId = process.env.REACT_APP_DERMATOLOGO_ROL_ID;
  const pendienteStatusId = process.env.REACT_APP_PENDIENTE_STATUS_ID;
  const asistioStatusId = process.env.REACT_APP_ASISTIO_STATUS_ID;
  const reagendoStatusId = process.env.REACT_APP_REAGENDO_STATUS_ID;
  const canceloCPStatusId = process.env.REACT_APP_CANCELO_CP_STATUS_ID;
  const canceloSPStatusId = process.env.REACT_APP_CANCELO_SP_STATUS_ID;
  const dermapenServicioId = process.env.REACT_APP_DERMAPEN_SERVICIO_ID;
  const dermapenTratamientoId = process.env.REACT_APP_DERMAPEN_TRATAMIENTO_ID;

  const [isLoading, setIsLoading] = useState(true);
  const [horarios, setHorarios] = useState([]);
  const [frecuencias, setFrecuencias] = useState([]);
  const [dermatologos, setDermatologos] = useState([]);
  const [tipoCitas, setTipoCitas] = useState([]);
  const [statements, setStatements] = useState([]);
  const [materiales, setMateriales] = useState([]);
  const [areas, setAreas] = useState([]);
  const [medios, setMedios] = useState([]);
  const [formasPago, setFormasPago] = useState([]);
  const [promovendedores, setPromovendedores] = useState([]);
  const [cosmetologas, setCosmetologas] = useState([]);
  const [previousState, setPreviousState] = useState();

  const [openModalPagos, setOpenModalPagos] = useState(false);
  const [openModalConfirmacion, setOpenModalConfirmacion] = useState(false);

  const fecha_dermapen = new Date(dermapen.fecha_hora);
  const fecha = `${addZero(fecha_dermapen.getDate())}/${addZero(Number(fecha_dermapen.getMonth()) + 1)}/${addZero(fecha_dermapen.getFullYear())}`;
  const hora = `${addZero(Number(fecha_dermapen.getHours()))}:${addZero(fecha_dermapen.getMinutes())}`;

  const [values, setValues] = useState({
    fecha_hora: dermapen.fecha_hora,
    fecha_show: fecha_dermapen,
    materiales: dermapen.materiales,
    fecha: fecha,
    hora: hora,
    fecha_actual: fecha,
    hora_actual: hora,
    paciente: dermapen.paciente,
    paciente_nombre: `${dermapen.paciente.nombres} ${dermapen.paciente.apellidos}`,
    telefono: dermapen.paciente.telefono,
    servicio: dermapen.servicio,
    tratamientos: dermapen.tratamientos,
    areas: dermapen.tratamientos[0].areasSeleccionadas,
    numero_sesion: dermapen.numero_sesion,
    quien_agenda: dermapen.quien_agenda,
    tipo_cita: dermapen.tipo_cita,
    confirmo: dermapen.confirmo,
    quien_confirma: dermapen.quien_confirma,
    promovendedor: dermapen.promovendedor ? dermapen.promovendedor._id : '',
    cosmetologa: dermapen.cosmetologa ? dermapen.cosmetologa._id : '',
    status: dermapen.status ? dermapen.status._id : '',
    precio: dermapen.precio,
    total: dermapen.total,
    motivos: dermapen.motivos,
    observaciones: dermapen.observaciones,
    dermatologo: dermapen.dermatologo ? dermapen.dermatologo._id : '',
    tiempo: dermapen.tiempo,
    pagado: dermapen.pagado,
    pagos: dermapen.pagos,
    hora_llegada: dermapen.hora_llegada,
    hora_aplicacion: dermapen.hora_aplicacion,
    total_aplicacion: dermapen.total_aplicacion,
    frecuencia: dermapen.frecuencia._id,
    medio: dermapen.medio._id,
    forma_pago: dermapen.forma_pago._id,
    producto: dermapen.producto,
  });

  const loadHorarios = async () => {
    const response = await getAllSchedules();
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setHorarios(response.data);
    }
  }

  const handleChangeFecha = async (date) => {
    setIsLoading(true);
    const fechaObservaciones = `${addZero(date.getDate())}/${addZero(Number(date.getMonth() + 1))}/${date.getFullYear()} - ${values.hora} HRS`;
    await setValues({
      ...values,
      nueva_fecha_hora: date,
      observaciones: fechaObservaciones,
    });
    await loadHorarios(date);
    setIsLoading(false);
  };

  const handleChangeHora = e => {
    setIsLoading(true);
    const hora = (e.target.value).split(':');
    const date = new Date(values.nueva_fecha_hora);
    date.setHours(Number(hora[0]));
    date.setMinutes(hora[1]);
    date.setSeconds(0);
    const fechaObservaciones = `${addZero(date.getDate())}/${addZero(Number(date.getMonth() + 1))}/${date.getFullYear()} - ${e.target.value} HRS`;
    setValues({
      ...values,
      nueva_fecha_hora: date,
      hora: e.target.value,
      observaciones: fechaObservaciones,
    });
    setIsLoading(false);
  };

  const handleChangeTipoCita = e => {
    setValues({ ...values, tipo_cita: e.target.value });
  }

  const handleChangePromovendedor = e => {
    setValues({ ...values, promovendedor: e.target.value });
  }

  const handleChangeCosmetologa = e => {
    setValues({ ...values, cosmetologa: e.target.value });
  }

  const handleChangeStatus = e => {
    setPreviousState(values.status);
    const estado = statements.find(statement => {
      return statement._id === e.target.value;
    });
    setOpenModalConfirmacion(estado.confirmacion);
    setValues({ ...values, status: e.target.value });
  }

  const handleChangeObservaciones = e => {
    setValues({ ...values, observaciones: e.target.value.toUpperCase() });
  }

  const handleOnClickActualizarDermapen = async (event, rowData) => {
    setIsLoading(true);
    if (rowData.pagado) {
      if (rowData.status === canceloCPStatusId) {
        rowData.pagos.forEach(async (pago) => {
          pago.pago_anticipado = true;
          const entrada = await findEntradaById(pago.entrada);
          if (`${entrada.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
            const updateEntradaData = entrada.data;
            updateEntradaData.pago_anticipado = true;
            await updateEntrada(updateEntradaData._id, updateEntradaData);
            await updatePago(pago._id, pago);
          }
        });
      } else if (rowData.status === canceloSPStatusId) {
        rowData.pagos.forEach(async (pago) => {
          await deleteEntrada(pago.entrada);
          await deletePago(pago._id);
        });
        rowData.pagado = false;
      }
    }
    if (rowData.status._id !== pendienteStatusId) {
      rowData.quien_confirma_asistencia = empleado._id;
      if (rowData.status === asistioStatusId) {
        const dateNow = new Date();
        rowData.hora_aplicacion = rowData.hora_aplicacion ? rowData.hora_aplicacion : dateNow;
        rowData.hora_llegada = (rowData.hora_llegada && rowData.hora_llegada !== '--:--') ? rowData.hora_llegada : `${addZero(dateNow.getHours())}:${addZero(dateNow.getMinutes())}`;
      }
    }

    if (rowData.status === reagendoStatusId) {
      await updateDermapen(dermapen._id, rowData, token);
      rowData.quien_agenda = empleado._id;
      rowData.sucursal = sucursal;
      rowData.status = pendienteStatusId;
      rowData.hora_llegada = '--:--';
      rowData.hora_atencion = '--:--';
      rowData.hora_salida = '--:--';
      rowData.observaciones = `DERMAPEN REAGENDADO ${values.fecha_actual} - ${values.hora_actual} HRS`;
      rowData.fecha_hora = rowData.nueva_fecha_hora;
      const response = await createDermapen(rowData, token);

      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
        setOpenAlert(true);
        setMessage('DERMAPEN REAGENDADO CORRECTAMENTE');
      }
      const dia = addZero(rowData.fecha_hora.getDate());
      const mes = addZero(rowData.fecha_hora.getMonth());
      const anio = rowData.fecha_hora.getFullYear();
      setFilterDate({
        fecha_show: rowData.fecha_hora,
        fecha: `${dia}/${mes}/${anio}`
      });
      await loadDermapens(rowData.fecha_hora);

    } else {
      const dia = addZero(rowData.fecha_show.getDate());
      const mes = addZero(rowData.fecha_show.getMonth());
      const anio = rowData.fecha_show.getFullYear();
      setFilterDate({
        fecha_show: rowData.fecha_show,
        fecha: `${dia}/${mes}/${anio}`
      });
      if (rowData.materiales.length > 0) {
        rowData.materiales.forEach(async (material) => {
          const responseSalida = await (material.salidaId ? findSalidaById(material.salidaId) : '0');

          if (responseSalida === '0' || `${responseSalida.status}` === process.env.REACT_APP_RESPONSE_CODE_OK
            || `${responseSalida.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
            const resSalida = responseSalida.data;

            const salida = {
              ...resSalida,
              create_date: new Date(),
              hora_aplicacion: rowData.hora_aplicacion ? rowData.hora_aplicacion : new Date(),
              tipo_salida: tipoSalidaCuracionesId,
              recepcionista: empleado,
              turno: rowData.turno === 'M' ? 'MATUTINO' : 'VESPERTINO',
              descripcion: "DERMAPEN",
              concepto: material.nombre,
              cantidad: material.precio,
              retencion: 0,
              sucursal: sucursal,
              forma_pago: formaPagoEfectivoId,
            }

            const response = await (salida._id ? updateSalida(salida._id, salida, token) : createSalida(salida, token));
            if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK
              || `${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
              material.salidaId = material.salidaId ? material.salidaId : response.data._id;
              await updateDermapen(dermapen._id, rowData, token)
              await loadDermapens(rowData.fecha_show);
            }
          }
        });
      } else {
        await updateDermapen(dermapen._id, rowData, token);
        await loadDermapens(rowData.fecha_show);
      }

      setOpenAlert(true);
      setMessage('DERMAPEN ACTUALIZADO');
    }
    setIsLoading(false);
    onClose();
  }

  const handleChangeSesion = e => {
    setValues({ ...values, numero_sesion: e.target.value });
  };

  const handleChangePrecio = e => {
    setValues({ ...values, precio: e.target.value });
  };

  const handleChangeMotivos = e => {
    setValues({ ...values, motivos: e.target.value.toUpperCase() });
  }

  const handleChangeDermatologo = (e) => {
    setValues({ ...values, dermatologo: e.target.value });
  }

  const handleChangeTiempo = e => {
    setValues({ ...values, tiempo: e.target.value });
  };

  const handleChangePagado = (e) => {
    setValues({ ...values, pagado: !values.pagado });
    setOpenModalPagos(!values.pagado);
  }

  const handleCloseModalPagos = () => {
    setOpenModalPagos(false);
    setValues({ ...values, pagado: false });
  }

  const handleChangeMedio = (e) => {
    setValues({ ...values, medio: e.target.value });
  }

  const handleChangePaymentMethod = (event) => {
    setValues({
      ...values,
      forma_pago: event.target.value,
    });
  }

  const handleCloseModalConfirmacion = () => {
    setOpenModalConfirmacion(false);
    setValues({ ...values, status: previousState });
  }

  const handleConfirmModalConfirmacion = () => {
    setOpenModalConfirmacion(false);
  }

  const handleGuardarModalPagos = (pagos) => {
    setValues({
      ...values,
      pagos: pagos,
    });
    setOpenModalPagos(false);
  }

  const handleChangeMateriales = async (items) => {
    setIsLoading(true);
    setValues({
      ...values,
      materiales: items
    });
    setIsLoading(false);
  }

  const handleChangeTotal = (event) => {
    const precio = event.target.value;
    let total_aplicacion = precio;
    values.materiales.map((item) => {
      total_aplicacion -= Number(item.precio);
    });
    setValues({
      ...values,
      precio: precio,
      total: precio,
      total_aplicacion: total_aplicacion,
    })

  }

  const handleChangeAreas = async (items) => {
    setIsLoading(true);
    setValues({
      ...values,
      tratamientos: [
        {
          _id: dermapenTratamientoId,
          nombre: "DERMAPEN",
          areasSeleccionadas: items,
          servicio: dermapenServicioId,
        }
      ],
      fecha_hora: '',
    });
    setIsLoading(false);
  }

  const handleChangeItemPrecio = (e, index) => {
    const newMateriales = values.materiales;
    newMateriales[index].precio = e.target.value;
    let total_aplicacion = Number(values.precio);
    newMateriales.map((item) => {
      total_aplicacion -= Number(item.precio);
    });
    setValues({
      ...values,
      materiales: newMateriales,
      total_aplicacion: total_aplicacion,
    });
  }

  const loadAreas = async () => {
    const response = await findAreasByTreatmentServicio(dermapenServicioId, dermapenTratamientoId);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setAreas(response.data);
    }
  }

  const handleChangeFrecuencia = (e) => {
    const frecuencia = e.target.value;
    setValues({
      ...values,
      frecuencia: frecuencia,
    });
  }

  const loadMedios = async () => {
    const response = await showAllMedios();
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setMedios(response.data);
    }
  }

  const loadPromovendedores = async () => {
    const response = await findEmployeesByRolIdAvailable(promovendedorRolId, token);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setPromovendedores(response.data);
    }
  }

  const loadCosmetologas = async () => {
    const response = await findEmployeesByRolIdAvailable(cosmetologaRolId, token);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setCosmetologas(response.data);
    }
  }

  const loadDermatologos = async () => {
    const response = await findEmployeesByRolIdAvailable(dermatologoRolId, token);
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

  const loadHorariosByServicio = async () => {
    const date = new Date(dermapen.fecha_hora);
    const response = await findScheduleByDateAndSucursalAndService(date.getDate(), Number(date.getMonth()), date.getFullYear(), dermapen.sucursal._id, dermapen.servicio._id);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      response.data.push({ hora: values.hora });
      setHorarios(response.data);
    }
  }

  const loadTipoCitas = async () => {
    const response = await showAllTipoCitas();
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setTipoCitas(response.data);
    }
    setIsLoading(false);
  }

  const loadStaus = async () => {
    const response = await showAllStatusVisibles();
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      // SI EL DIA DE LA CITA ES A FUTURO, ELIMINA EL STATUS ASISTIO
      const resStatus = response.data.filter(item => {
        return item._id !== asistioStatusId ? true : new Date(dermapen.fecha_hora).getDate() === new Date().getDate();
      });
      setStatements(resStatus);
    }
    setIsLoading(false);
  }

  const loadAll = async () => {
    setIsLoading(true);
    await loadMateriales();
    await loadHorariosByServicio();
    await loadTipoCitas();
    await loadStaus();
    await loadFrecuencias()
    await loadAreas();
    await loadMedios();
    await loadPromovendedores();
    await loadCosmetologas();
    await loadDermatologos();
    await loadFormasPago();
    setIsLoading(false);
  }

  useEffect(() => {
    loadAll();
  }, []);

  return (
    <Fragment>
      {
        !isLoading ?
          <ModalFormDermapen
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={open}
            onClickCancel={onClose}
            dermapen={dermapen}
            values={values}
            onClickActualizarDermapen={handleOnClickActualizarDermapen}
            onChangeFecha={(e) => handleChangeFecha(e)}
            onChangeHora={(e) => handleChangeHora(e)}
            onChangeTipoCita={(e) => handleChangeTipoCita(e)}
            onChangeStatus={(e) => handleChangeStatus(e)}
            onChangeDermatologo={(e) => handleChangeDermatologo(e)}
            onChangeTiempo={(e) => handleChangeTiempo(e)}
            onChangeAreas={(e) => handleChangeAreas(e)}
            onChangeMedio={(e) => handleChangeMedio(e)}
            onChangePaymentMethod={(e) => handleChangePaymentMethod(e)}
            horarios={horarios}
            dermatologos={dermatologos}
            frecuencias={frecuencias}
            tipoCitas={tipoCitas}
            statements={statements}
            areas={areas}
            promovendedores={promovendedores}
            cosmetologas={cosmetologas}
            medios={medios}
            materiales={materiales}
            formasPago={formasPago}
            onChangeSesion={handleChangeSesion}
            onChangePrecio={handleChangePrecio}
            onChangeMotivos={handleChangeMotivos}
            onChangeObservaciones={handleChangeObservaciones}
            onChangePagado={(e) => handleChangePagado(e)}
            onChangeFrecuencia={(e) => handleChangeFrecuencia(e)}
            openModalPagos={openModalPagos}
            onCloseModalPagos={handleCloseModalPagos}
            onGuardarModalPagos={handleGuardarModalPagos}
            sucursal={sucursal}
            empleado={empleado}
            colorBase={colorBase}
            openModalConfirmacion={openModalConfirmacion}
            onCloseModalConfirmacion={handleCloseModalConfirmacion}
            onConfirmModalConfirmacion={handleConfirmModalConfirmacion}
            onChangeMateriales={(e) => handleChangeMateriales(e)}
            onChangePromovendedor={(e) => handleChangePromovendedor(e)}
            onChangeCosmetologa={(e) => handleChangeCosmetologa(e)}
            onChangeItemPrecio={handleChangeItemPrecio}
            onChangeTotal={handleChangeTotal} />
          : <Backdrop className={classes.backdrop} open={isLoading} >
            <CircularProgress color="inherit" />
          </Backdrop>
      }
    </Fragment>

  );
}

export default ModalDermapen;