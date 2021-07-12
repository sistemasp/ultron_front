import React, { useState, useEffect, Fragment } from 'react';
import {
  getAllSchedules,
  findScheduleByDateAndSucursalAndService,
  showAllTipoCitas,
  updatePago,
  deletePago,
  createConsecutivo,
  showAllFrecuencias,
  showAllMedios,
  showAllMetodoPago,
} from "../../../services";
import {
  updateEntrada,
  deleteEntrada,
  findEntradaById,
} from "../../../services/entradas";
import {
  findAreasByTreatmentServicio,
} from "../../../services/areas";
import * as Yup from "yup";
import ModalFormCita from './ModalFormCita';
import { Formik } from 'formik';
import { Backdrop, CircularProgress, makeStyles } from '@material-ui/core';
import { addZero } from '../../../utils/utils';
import { createAparatologia, updateAparatologia } from '../../../services/aparatolgia';
import { createFacial, updateFacial } from '../../../services/faciales';
import { showAllStatusVisibles } from '../../../services/status';
import { findEmployeesByRolIdAvailable } from '../../../services/empleados';

const validationSchema = Yup.object({
  fecha: Yup.string("Ingresa los nombres")
    .required("Los nombres del pacientes son requeridos"),
  hora: Yup.string("Ingresa los apellidos")
    .required("Los nombres del pacientes son requeridos"),
  paciente: Yup.string("Ingresa la fecha de nacimiento")
    .required("Los nombres del pacientes son requeridos"),
  servicio: Yup.string("Ingresa la domicilio")
    .required("Los nombres del pacientes son requeridos"),
  tratamiento: Yup.string("Ingresa el telefono")
    .required("Los nombres del pacientes son requeridos"),
  numero_sesion: Yup.string("Ingresa los nombres")
    .required("Los nombres del pacientes son requeridos"),
  recepcionista: Yup.string("Ingresa los apellidos")
    .required("Los nombres del pacientes son requeridos"),
  confirmo: Yup.string("Ingresa la fecha de nacimiento")
    .required("Los nombres del pacientes son requeridos"),
  quien_confirma: Yup.string("Ingresa la domicilio")
    .required("Los nombres del pacientes son requeridos"),
  asistio: Yup.string("Ingresa el telefono")
    .required("Los nombres del pacientes son requeridos"),
  precio: Yup.string("Ingresa el telefono")
    .required("Los nombres del pacientes son requeridos"),
});

const useStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const ModalCita = (props) => {

  const classes = useStyles();

  const {
    open,
    onClose,
    cita,
    empleado,
    loadCitas,
    loadAparatologias,
    loadFaciales,
    loadLaser,
    sucursal,
    setOpenAlert,
    setMessage,
    setSeverity,
    setFilterDate,
    tratamientos,
    colorBase,
  } = props;

  const promovendedorRolId = process.env.REACT_APP_PROMOVENDEDOR_ROL_ID;
  const cosmetologaRolId = process.env.REACT_APP_COSMETOLOGA_ROL_ID;
  const dermatologoRolId = process.env.REACT_APP_DERMATOLOGO_ROL_ID;
  const pendienteStatusId = process.env.REACT_APP_PENDIENTE_STATUS_ID;
  const confirmadoStatusId = process.env.REACT_APP_CONFIRMADO_STATUS_ID;
  const asistioStatusId = process.env.REACT_APP_ASISTIO_STATUS_ID;
  const reagendoStatusId = process.env.REACT_APP_REAGENDO_STATUS_ID;
  const canceloCPStatusId = process.env.REACT_APP_CANCELO_CP_STATUS_ID;
  const canceloSPStatusId = process.env.REACT_APP_CANCELO_SP_STATUS_ID;
  const servicioAparatologiaId = process.env.REACT_APP_APARATOLOGIA_SERVICIO_ID;
  const servicioFacialId = process.env.REACT_APP_FACIAL_SERVICIO_ID;
  const servicioLaserId = process.env.REACT_APP_LASER_SERVICIO_ID;
  const sucursalManuelAcunaId = process.env.REACT_APP_SUCURSAL_MANUEL_ACUNA_ID;
  const sucursalOcciId = process.env.REACT_APP_SUCURSAL_OCCI_ID;
  const sucursalFedeId = process.env.REACT_APP_SUCURSAL_FEDE_ID;
  const sucursalRubenDarioId = process.env.REACT_APP_SUCURSAL_RUBEN_DARIO_ID;
  const rolCallCenterId = process.env.REACT_APP_CALL_CENTER_ROL_ID;

  const [isLoading, setIsLoading] = useState(true);
  const [areas, setAreas] = useState([]);
  const [frecuencias, setFrecuencias] = useState([]);
  const [formasPago, setFormasPago] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [promovendedores, setPromovendedores] = useState([]);
  const [cosmetologas, setCosmetologas] = useState([]);
  const [doctores, setDoctores] = useState([]);
  const [tipoCitas, setTipoCitas] = useState([]);
  const [statements, setStatements] = useState([]);
  const [previousState, setPreviousState] = useState();
  const [medios, setMedios] = useState([]);
  const [selectedAreas, setSelectedAreas] = useState(true);

  const [openModalPagos, setOpenModalPagos] = useState(false);
  const [openModalConfirmacion, setOpenModalConfirmacion] = useState(false);

  const fecha_cita = new Date(cita.fecha_hora);
  const fecha = `${addZero(fecha_cita.getDate())}/${addZero(Number(fecha_cita.getMonth()) + 1)}/${addZero(fecha_cita.getFullYear())}`;
  const hora = `${addZero(Number(fecha_cita.getHours()))}:${addZero(fecha_cita.getMinutes())}`;

  const [values, setValues] = useState({
    fecha_hora: cita.fecha_hora,
    fecha_show: fecha_cita,
    fecha: fecha,
    hora: hora,
    fecha_actual: fecha,
    hora_actual: hora,
    paciente: cita.paciente,
    paciente_nombre: `${cita.paciente.nombres} ${cita.paciente.apellidos}`,
    telefono: cita.paciente.telefono,
    servicio: cita.servicio,
    tratamientos: cita.tratamientos,
    areas: cita.areas,
    numero_sesion: cita.numero_sesion,
    quien_agenda: cita.quien_agenda,
    tipo_cita: cita.tipo_cita._id,
    confirmo: cita.confirmo,
    quien_confirma: cita.quien_confirma,
    promovendedor: cita.promovendedor ? cita.promovendedor._id : '',
    cosmetologa: cita.cosmetologa ? cita.cosmetologa._id : '',
    status: cita.status._id,
    precio: cita.precio,
    total: cita.total,
    motivos: cita.motivos,
    observaciones: cita.observaciones,
    dermatologo: cita.dermatologo ? cita.dermatologo._id : '',
    tiempo: cita.tiempo,
    pagado: cita.pagado,
    pagos: cita.pagos,
    hora_llegada: cita.hora_llegada,
    hora_aplicacion: cita.hora_aplicacion,
    tratamientos: cita.tratamientos,
    areas: cita.areas,
    frecuencia: cita.frecuencia._id,
    forma_pago: cita.forma_pago._id,
    medio: cita.medio._id,
  });

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

  const loadFormasPago = async () => {
		const response = await showAllMetodoPago();
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			setFormasPago(response.data);
		}
	}

  const loadHorarios = async (date) => {
    const dia = date ? date.getDate() : values.fecha_hora.getDate();
    const mes = Number(date ? date.getMonth() : values.fecha_hora.getMonth());
    const anio = date ? date.getFullYear() : values.fecha_hora.getFullYear();
    const response = await findScheduleByDateAndSucursalAndService(dia, mes, anio, sucursal, values.servicio._id);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setHorarios(response.data);
    }
  }

  const loadAreas = () => {
    cita.tratamientos.map(async (tratamiento) => {
      const response = await findAreasByTreatmentServicio(tratamiento.servicio, tratamiento._id);
      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
        tratamiento.areas = response.data;
      }
    });
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

  const handleChangeMedio = (e) => {
		setValues({ ...values, medio: e.target.value });
	}

  const handleChangePaymentMethod = (event) => {
		setValues({
			...values,
			forma_pago: event.target.value,
		});
	}

  const handleChangeFecha = async (date) => {
    setIsLoading(true);
    if (values.nueva_fecha_hora) {
      date.setHours(values.nueva_fecha_hora.getHours());
      date.setMinutes(values.nueva_fecha_hora.getMinutes());
      date.setSeconds(0);
    }
    const fechaObservaciones = `${addZero(date.getDate())}/${addZero(Number(date.getMonth() + 1))}/${date.getFullYear()} - ${values.hora} HRS`;
    await setValues({
      ...values,
      nueva_fecha_hora: date,
      hora: '',
      observaciones: fechaObservaciones,
    });
    loadHorarios(date);
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

  const getTimeToTratamiento = (tratamientos) => {
    tratamientos.sort((a, b) => {
      if (a.tiempo < b.tiempo) return 1;
      if (a.tiempo > b.tiempo) return -1;
      return 0;
    });
    let tiempo = 0;
    tratamientos.forEach((item, index) => {
      tiempo += Number(index === 0 ? item.tiempo : (item.tiempo - 20));
    });
    return tiempo;
  }

  const handleOnClickActualizarCita = async (event, rowData) => {
    setIsLoading(true);
    rowData.tratamientos.forEach(tratamiento => {
      tratamiento.areas = undefined;
    });
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
      if (empleado.rol._id === rolCallCenterId) {
        rowData.quien_confirma_llamada = empleado._id;
      } else {
        rowData.quien_confirma_asistencia = empleado._id;
      }

      if (rowData.status === asistioStatusId) {
        const dateNow = new Date();
        rowData.hora_aplicacion = rowData.hora_aplicacion ? rowData.hora_aplicacion : dateNow;
        rowData.hora_llegada = (rowData.hora_llegada && rowData.hora_llegada !== '--:--') ? rowData.hora_llegada : `${addZero(dateNow.getHours())}:${addZero(dateNow.getMinutes())}`;
      }
    }

    //rowData.tiempo = getTimeToTratamiento(rowData.tratamientos);
    if (rowData.status === reagendoStatusId) {
      switch (cita.servicio._id) {
        case servicioAparatologiaId:
          await updateAparatologia(cita._id, rowData, empleado.access_token);
          break;
        case servicioFacialId:
          await updateFacial(cita._id, rowData, empleado.access_token);
          break;
      }
      rowData.quien_agenda = empleado._id;
      rowData.sucursal = sucursal;
      rowData.status = pendienteStatusId;
      rowData.hora_llegada = '--:--';
      rowData.hora_atencion = '--:--';
      rowData.hora_salida = '--:--';
      rowData.observaciones = `TRATAMIENTO REAGENDADO ${values.fecha_actual} - ${values.hora_actual} HRS`;
      rowData.fecha_hora = rowData.nueva_fecha_hora;
      let response;
      switch (cita.servicio._id) {
        case servicioAparatologiaId:
          response = await createAparatologia(rowData, empleado.access_token);
          break;
        case servicioFacialId:
          response = await createFacial(rowData, empleado.access_token);
          break;
      }
      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
        const consecutivo = {
          consecutivo: response.data.consecutivo,
          tipo_servicio: cita.servicio._id,
          servicio: response.data._id,
          sucursal: sucursal,
          fecha_hora: new Date(),
          status: response.data.status,
        }
        const responseConsecutivo = await createConsecutivo(consecutivo);
        if (`${responseConsecutivo.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
          setOpenAlert(true);
          setMessage('TRATAMIENTO REAGENDADO CORRECTAMENTE');
        }
      }
      const dia = addZero(rowData.fecha_hora.getDate());
      const mes = addZero(rowData.fecha_hora.getMonth());
      const anio = rowData.fecha_hora.getFullYear();
      setFilterDate({
        fecha_show: rowData.fecha_hora,
        fecha: `${dia}/${mes}/${anio}`
      });
      switch (cita.servicio._id) {
        case servicioAparatologiaId:
          await loadAparatologias(rowData.fecha_hora);
          break;
        case servicioFacialId:
          await loadFaciales(rowData.fecha_hora);
          break;
        case servicioLaserId:
          await loadLaser(rowData.fecha_hora);
          break;
      }
    } else {
      const dia = addZero(rowData.fecha_show.getDate());
      const mes = addZero(rowData.fecha_show.getMonth());
      const anio = rowData.fecha_show.getFullYear();
      setFilterDate({
        fecha_show: rowData.fecha_show,
        fecha: `${dia}/${mes}/${anio}`
      });

      switch (cita.servicio._id) {
        case servicioAparatologiaId:
          await updateAparatologia(cita._id, rowData, empleado.access_token);
          await loadAparatologias(rowData.fecha_show);
          break;
        case servicioFacialId:
          await updateFacial(cita._id, rowData, empleado.access_token);
          await loadFaciales(rowData.fecha_show);
          break;
      }
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

  const handleCloseModalConfirmacion = () => {
    setOpenModalConfirmacion(false);
    setValues({ ...values, status: previousState });
  }

  const handleConfirmModalConfirmacion = () => {
    setOpenModalConfirmacion(false);
  }

  const handleChangeFrecuencia = (e) => {
		setValues({
			...values,
			frecuencia: e.target.value,
		});
	}

  const handleGuardarModalPagos = (pagos) => {
    setValues({
      ...values,
      pagos: pagos,
    });
    setOpenModalPagos(false);
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
        });
      }
    });
    setValues({
      ...values,
      precio: precio,
      total: precio,
    });
    setIsLoading(false);
  }

  const loadPromovendedores = async () => {
    const response = await findEmployeesByRolIdAvailable(promovendedorRolId, empleado.access_token);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setPromovendedores(response.data);
    }
  }

  const loadCosmetologas = async () => {
    const response = await findEmployeesByRolIdAvailable(cosmetologaRolId, empleado.access_token);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setCosmetologas(response.data);
    }
  }

  const loadDoctores = async () => {
    const response = await findEmployeesByRolIdAvailable(dermatologoRolId, empleado.access_token);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setDoctores(response.data);
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
        return item._id !== asistioStatusId ? true : (new Date(cita.fecha_hora).getDate() === new Date().getDate() && cita.status._id === confirmadoStatusId);
      });
      setStatements(resStatus);
    }
    setIsLoading(false);
  }

  const loadAll = async () => {
    setIsLoading(true);
    await loadAreas(cita);
    await loadHorarios(new Date());
    await loadPromovendedores();
    await loadCosmetologas();
    await loadDoctores();
    await loadTipoCitas();
    await loadStaus();
    await loadFrecuencias();
    await loadMedios();
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
          <Formik
            enableReinitialize
            initialValues={values}
            validationSchema={validationSchema} >
            {
              props => <ModalFormCita
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={open}
                onClickCancel={onClose}
                cita={cita}
                onClickActualizarCita={handleOnClickActualizarCita}
                onChangeTratamientos={(e) => handleChangeTratamientos(e)}
                onChangeAreas={handleChangeAreas}
                onChangeFecha={(e) => handleChangeFecha(e)}
                onChangeHora={(e) => handleChangeHora(e)}
                onChangeTipoCita={(e) => handleChangeTipoCita(e)}
                onChangeStatus={(e) => handleChangeStatus(e)}
                onChangePromovendedor={(e) => handleChangePromovendedor(e)}
                onChangeCosmetologa={(e) => handleChangeCosmetologa(e)}
                onChangeDermatologo={(e) => handleChangeDermatologo(e)}
                onChangeTiempo={(e) => handleChangeTiempo(e)}
                frecuencias={frecuencias}
								onChangeFrecuencia={(e) => handleChangeFrecuencia(e)}
                tratamientos={tratamientos}
                areas={areas}
                medios={medios}
                horarios={horarios}
                promovendedores={promovendedores}
                cosmetologas={cosmetologas}
                doctores={doctores}
                tipoCitas={tipoCitas}
                formasPago={formasPago}
                statements={statements}
                colorBase={colorBase}
                onChangeSesion={handleChangeSesion}
                onChangePrecio={handleChangePrecio}
                onChangeMotivos={handleChangeMotivos}
                onChangeObservaciones={handleChangeObservaciones}
                onChangeMedio={(e) => handleChangeMedio(e)}
                onChangePaymentMethod={(e) => handleChangePaymentMethod(e)}
                onChangePagado={(e) => handleChangePagado(e)}
                openModalPagos={openModalPagos}
                onCloseModalPagos={handleCloseModalPagos}
                onGuardarModalPagos={handleGuardarModalPagos}
                sucursal={sucursal}
                empleado={empleado}
                openModalConfirmacion={openModalConfirmacion}
                onCloseModalConfirmacion={handleCloseModalConfirmacion}
                onConfirmModalConfirmacion={handleConfirmModalConfirmacion}
                setOpenAlert={setOpenAlert}
                setMessage={setMessage}
                setSeverity={setSeverity}
                selectedAreas={selectedAreas}
                {...props} />
            }
          </Formik> :
          <Backdrop className={classes.backdrop} open={isLoading} >
            <CircularProgress color="inherit" />
          </Backdrop>
      }
    </Fragment>

  );
}

export default ModalCita;