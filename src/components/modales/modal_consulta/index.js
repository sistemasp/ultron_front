import React, { useState, useEffect, Fragment } from 'react';
import {
  findScheduleInConsultByDateAndSucursal,
  showAllTipoCitas,
  updatePago,
  deletePago,
  createConsecutivo,
  showAllFrecuencias,
  showAllMedios,
  showAllMetodoPago,
} from "../../../services";
import {
  updateConsult,
  createConsult,
} from "../../../services/consultas";
import {
  findIngresoById,
  updateIngreso,
  deleteIngreso,
} from "../../../services/ingresos";
import { Backdrop, CircularProgress, makeStyles } from '@material-ui/core';
import { addZero } from '../../../utils/utils';
import ModalFormConsulta from './ModalFormConsulta';
import { showAllStatusVisibles } from '../../../services/status';
import { findProductoByServicio } from '../../../services/productos';
import { findEmployeesByRolIdAvailable } from '../../../services/empleados';

const useStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const ModalConsulta = (props) => {

  const classes = useStyles();

  const {
    open,
    onClose,
    consulta,
    empleado,
    loadConsultas,
    sucursal,
    setOpenAlert,
    setMessage,
    setSeverity,
    setFilterDate,
  } = props;

  const [isLoading, setIsLoading] = useState(true);
  const [frecuencias, setFrecuencias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [promovendedores, setPromovendedores] = useState([]);
  const [doctores, setDoctores] = useState([]);
  const [tipoCitas, setTipoCitas] = useState([]);
  const [statements, setStatements] = useState([]);
  const [medios, setMedios] = useState([]);
  const [formasPago, setFormasPago] = useState([]);
  const [previousState, setPreviousState] = useState();

  const [openModalPagos, setOpenModalPagos] = useState(false);
  const [openModalConfirmacion, setOpenModalConfirmacion] = useState(false);

  const fecha_cita = new Date(consulta.fecha_hora);
  const fecha = `${addZero(fecha_cita.getDate())}/${addZero(Number(fecha_cita.getMonth() + 1))}/${addZero(fecha_cita.getFullYear())}`;
  const hora = `${addZero(Number(fecha_cita.getHours()))}:${addZero(fecha_cita.getMinutes())}`;

  const [values, setValues] = useState({
    fecha_show: fecha_cita,
    fecha: fecha,
    hora: hora,
    fecha_actual: fecha,
    hora_actual: hora,
    paciente: consulta.paciente,
    paciente_nombre: `${consulta.paciente.nombres} ${consulta.paciente.apellidos}`,
    telefono: consulta.paciente.telefono,
    quien_agenda: consulta.quien_agenda,
    tipo_cita: consulta.tipo_cita,
    quien_confirma_llamada: consulta.quien_confirma_llamada,
    quien_confirma_asistencia: consulta.quien_confirma_asistencia,
    promovendedor: consulta.promovendedor ? consulta.promovendedor._id : '',
    status: consulta.status ? consulta.status._id : '',
    precio: consulta.precio,
    motivos: consulta.motivos,
    observaciones: consulta.observaciones,
    dermatologo: consulta.dermatologo ? consulta.dermatologo._id : '',
    pagado: consulta.pagado,
    frecuencia: consulta.frecuencia._id,
    producto: consulta.producto._id,
    hora_llegada: consulta.hora_llegada,
    servicio: consulta.servicio,
    pagos: consulta.pagos,
    hora_aplicacion: consulta.hora_aplicacion,
    medio: consulta.medio._id,
    forma_pago: consulta.forma_pago._id,
  });

  const promovendedorRolId = process.env.REACT_APP_PROMOVENDEDOR_ROL_ID;
  const dermatologoRolId = process.env.REACT_APP_DERMATOLOGO_ROL_ID;
  const pendienteStatusId = process.env.REACT_APP_PENDIENTE_STATUS_ID;
  const asistioStatusId = process.env.REACT_APP_ASISTIO_STATUS_ID;
  const reagendoStatusId = process.env.REACT_APP_REAGENDO_STATUS_ID;
  const consultaServicioId = process.env.REACT_APP_CONSULTA_SERVICIO_ID;
  const canceloCPStatusId = process.env.REACT_APP_CANCELO_CP_STATUS_ID;
  const canceloSPStatusId = process.env.REACT_APP_CANCELO_SP_STATUS_ID;
  const frecuenciaPrimeraVezId = process.env.REACT_APP_FRECUENCIA_PRIMERA_VEZ_ID;
  const frecuenciaReconsultaId = process.env.REACT_APP_FRECUENCIA_RECONSULTA_ID;
  const dermatologoDirectoId = process.env.REACT_APP_DERMATOLOGO_DIRECTO_ID;
  const promovendedorSinPromovendedorId = process.env.REACT_APP_PROMOVENDEDOR_SIN_PROMOVENDEDOR_ID;
  const productoConsultaId = process.env.REACT_APP_PRODUCTO_CONSULTA_ID;

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

  const loadProductos = async () => {
    const response = await findProductoByServicio(consultaServicioId);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setProductos(response.data);
    }
  }

  const loadPromovendedores = async () => {
    const response = await findEmployeesByRolIdAvailable(promovendedorRolId, empleado.access_token);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setPromovendedores(response.data);
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
  }

  const loadStaus = async () => {
    const response = await showAllStatusVisibles();
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setStatements(response.data);
    }
  }

  const loadHorarios = async (date) => {
    const dia = date ? date.getDate() : values.fecha_show.getDate();
    const mes = Number(date ? date.getMonth() : values.fecha_show.getMonth()) + 1;
    const anio = date ? date.getFullYear() : values.fecha_show.getFullYear();
    const response = await findScheduleInConsultByDateAndSucursal(consultaServicioId, dia, mes, anio, sucursal);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setHorarios(response.data);
    }
  }

  const loadAll = async () => {
    setIsLoading(true);
    await loadPromovendedores();
    await loadDoctores();
    await loadTipoCitas();
    await loadStaus();
    await loadHorarios();
    await loadFrecuencias();
    await loadProductos();
    await loadMedios();
    await loadFormasPago();
    setIsLoading(false);
  }

  const handleChangeMedio = (e) => {
		setValues({ ...values, medio: e.target.value });
  }

  const handleChangeFecha = async (date) => {
    setIsLoading(true);
    const fechaObservaciones = `${addZero(date.getDate())}/${addZero(Number(date.getMonth() + 1))}/${date.getFullYear()} - ${values.hora} HRS`;
    await setValues({
      ...values,
      nueva_fecha_hora: date,
      hora: '',
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

  const handleChangeStatus = e => {
    setPreviousState(values.status);
    const estado = statements.find(statement => {
      return statement._id === e.target.value;
    });
    if (e.target.value === asistioStatusId) {
      const hora_aplicacion = values.hora_aplicacion ? values.hora_aplicacion : new Date();
      setValues({ ...values, hora_aplicacion: hora_aplicacion });
    }
    setOpenModalConfirmacion(estado.confirmacion);
    setValues({ ...values, status: e.target.value });
  }

  const handleCloseModalConfirmacion = () => {
    setOpenModalConfirmacion(false);
    setValues({ ...values, status: previousState });
  }

  const handleConfirmModalConfirmacion = () => {
    setOpenModalConfirmacion(false);
  }
  /*
    const handleChangeStatus = e => {
      if (e.target.value === asistioStatusId) {
        const hora_aplicacion = values.hora_aplicacion ? values.hora_aplicacion : new Date();
        setValues({ ...values, hora_aplicacion: hora_aplicacion });
      }
      setValues({ ...values, status: e.target.value });
    }
  */
  const handleChangeObservaciones = e => {
    setValues({ ...values, observaciones: e.target.value.toUpperCase() });
  }

  const handleChangePagado = (e) => {
    setValues({ ...values, pagado: !values.pagado });
    setOpenModalPagos(!values.pagado);
  }

  const handleOnClickActualizarCita = async (event, rowData) => {
    if (rowData.pagado) {
      if (rowData.status === canceloCPStatusId) {
        rowData.pagos.forEach(async (pago) => {
          pago.pago_anticipado = true;
          const ingreso = await findIngresoById(pago.ingreso);
          if (`${ingreso.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
            const updateIngresoData = ingreso.data;
            updateIngresoData.pago_anticipado = true;
            await updateIngreso(updateIngresoData._id, updateIngresoData);
            await updatePago(pago._id, pago);
          }
        });
      } else if (rowData.status === canceloSPStatusId) {
        rowData.pagos.forEach(async (pago) => {
          await deleteIngreso(pago.ingreso);
          await deletePago(pago._id);
        });
        rowData.pagado = false;
      }
    }

    if (rowData.status._id !== pendienteStatusId && rowData.status === asistioStatusId) {
      rowData.quien_confirma_asistencia = empleado._id;
      const dateNow = new Date();
      rowData.hora_aplicacion = rowData.hora_aplicacion ? rowData.hora_aplicacion : dateNow;
      rowData.hora_llegada = (rowData.hora_llegada && rowData.hora_llegada !== '--:--') ? rowData.hora_llegada : `${addZero(dateNow.getHours())}:${addZero(dateNow.getMinutes())}`;
    }

    if (rowData.status === reagendoStatusId) {
      await updateConsult(consulta._id, rowData, empleado.access_token);
      rowData.quien_agenda = empleado._id;
      rowData.sucursal = sucursal;
      rowData.status = pendienteStatusId;
      rowData.hora_llegada = '--:--';
      rowData.observaciones = `CONSULTA REAGENDADA ${values.fecha_actual} - ${values.hora_actual} HRS`;
      rowData.fecha_hora = rowData.nueva_fecha_hora;
      const response = await createConsult(rowData, empleado.access_token);
      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
        /*const consecutivo = {
          consecutivo: response.data.consecutivo,
          tipo_servicio: consultaServicioId,
          servicio: response.data._id,
          sucursal: sucursal._id,
          fecha_hora: new Date(),
          status: response.data.status,
        }
        const responseConsecutivo = await createConsecutivo(consecutivo);
        if (`${responseConsecutivo.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {*/
          setOpenAlert(true);
          setMessage('CONSULTA REAGENDADA CORRECTAMENTE');
        //}
      }

      const dia = addZero(rowData.fecha_hora.getDate());
      const mes = addZero(rowData.fecha_hora.getMonth() + 1);
      const anio = rowData.fecha_hora.getFullYear();
      setFilterDate({
        fecha_show: rowData.fecha_hora,
        fecha: `${dia}/${mes}/${anio}`
      });
      await loadConsultas(rowData.fecha_hora);
    } else {
      const dia = addZero(rowData.fecha_show.getDate());
      const mes = addZero(rowData.fecha_show.getMonth() + 1);
      const anio = rowData.fecha_show.getFullYear();
      setFilterDate({
        fecha_show: rowData.fecha_show,
        fecha: `${dia}/${mes}/${anio}`
      });
      await updateConsult(consulta._id, rowData, empleado.access_token);
      await loadConsultas(rowData.fecha_show);
    }
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

  const handleCloseModalPagos = () => {
    setOpenModalPagos(false);
    setValues({ ...values, pagado: false });
  }

  const handleChangePaymentMethod = (event) => {
		setValues({
			...values,
			forma_pago: event.target.value,
		});
	}

  const handleGuardarModalPagos = (pagos) => {
    setValues({
      ...values,
      pagos: pagos,
    });
    setOpenModalPagos(false);
  }

  const handleChangeFrecuencia = (e) => {
		const frecuencia = e.target.value;
		/*const dermatologo = dermatologos.find(item => {
			return item._id === dermatologoDirectoId;
		});*/
		const promovendedor = promovendedores.find(item => {
			return item._id === promovendedorSinPromovendedorId;
		});
		setValues({
			...values,
			frecuencia: frecuencia,
			//dermatologo: frecuencia === frecuenciaPrimeraVezId ? dermatologo._id : dermatologoDirectoId,
			promovendedor: frecuencia === frecuenciaReconsultaId ? promovendedor._id : promovendedorSinPromovendedorId,
			producto: frecuencia === frecuenciaPrimeraVezId ? productoConsultaId : values.producto,
		});
	}

  const handleChangeProductos = (e) => {
		setValues({ ...values, producto: e.target.value });
	}

  useEffect(() => {
    loadAll();
  }, []);

  return (
    <Fragment>
      {
        !isLoading ?
          <ModalFormConsulta
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={open}
            values={values}
            onClose={onClose}
            consulta={consulta}
            empleado={empleado}
            onClickActualizarCita={handleOnClickActualizarCita}
            onChangeFecha={(e) => handleChangeFecha(e)}
            onChangeHora={(e) => handleChangeHora(e)}
            onChangeTipoCita={(e) => handleChangeTipoCita(e)}
            onChangeStatus={(e) => handleChangeStatus(e)}
            onChangePromovendedor={(e) => handleChangePromovendedor(e)}
            onChangeDermatologo={(e) => handleChangeDermatologo(e)}
            onChangeTiempo={(e) => handleChangeTiempo(e)}
            onChangeFrecuencia={(e) => handleChangeFrecuencia(e)}
            onChangeProductos={(e) => handleChangeProductos(e)}
            onChangePaymentMethod={(e) => handleChangePaymentMethod(e)}
            horarios={horarios}
            promovendedores={promovendedores}
            doctores={doctores}
            tipoCitas={tipoCitas}
            frecuencias={frecuencias}
            productos={productos}
            medios={medios}
            formasPago={formasPago}
            statements={statements}
            onChangeSesion={handleChangeSesion}
            onChangePrecio={handleChangePrecio}
            onChangeMotivos={handleChangeMotivos}
            onChangeObservaciones={handleChangeObservaciones}
            onChangePagado={(e) => handleChangePagado(e)}
            openModalPagos={openModalPagos}
            onCloseModalPagos={handleCloseModalPagos}
            onGuardarModalPagos={handleGuardarModalPagos}
            onCloseModalConfirmacion={handleCloseModalConfirmacion}
            onConfirmModalConfirmacion={handleConfirmModalConfirmacion}
            onChangeMedio={(e) => handleChangeMedio(e)}
            openModalConfirmacion={openModalConfirmacion}
            setOpenAlert={setOpenAlert}
            setMessage={setMessage}
            setSeverity={setSeverity}
            sucursal={sucursal}
            tipoServicioId={consultaServicioId}
            frecuenciaReconsultaId={frecuenciaReconsultaId} /> :
          <Backdrop className={classes.backdrop} open={isLoading} >
            <CircularProgress color="inherit" />
          </Backdrop>
      }
    </Fragment>

  );
}

export default ModalConsulta;