import React, { useState, useEffect, Fragment } from 'react';
import {
  createConsecutivo,
  findEmployeesByRolIdAvailable,
  findScheduleInConsultByDateAndSucursal,
  showAllMetodoPago,
  showAllOffices,
} from "../../../services";
import {
  createConsult,
} from "../../../services/consultas";
import { Backdrop, CircularProgress, makeStyles } from '@material-ui/core';
import { addZero } from '../../../utils/utils';
import ModalFormProximaConsulta from './ModalFormProximaConsulta';
import { findProductoByServicio } from '../../../services/productos';

const useStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const ModalProximaConsulta = (props) => {

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
    setFilterDate,
  } = props;

  const [isLoading, setIsLoading] = useState(true);
  const [sucursales, setSucursales] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [dermatologos, setDermatologos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [formasPago, setFormasPago] = useState([]);

  const fecha_cita = new Date(consulta.fecha_hora);
  const fecha = `${addZero(fecha_cita.getDate())}/${addZero(Number(fecha_cita.getMonth() + 1))}/${addZero(fecha_cita.getFullYear())}`;
  const hora = `${addZero(Number(fecha_cita.getHours()))}:${addZero(fecha_cita.getMinutes())}`;

  const promovendedorSinPromovendedorId = process.env.REACT_APP_PROMOVENDEDOR_SIN_PROMOVENDEDOR_ID;
  const pendienteStatusId = process.env.REACT_APP_PENDIENTE_STATUS_ID;
  const asistioStatusId = process.env.REACT_APP_ASISTIO_STATUS_ID;
  const dermatologoRolId = process.env.REACT_APP_DERMATOLOGO_ROL_ID;
  const consultaServicioId = process.env.REACT_APP_CONSULTA_SERVICIO_ID;
  const reconsultaFrecuenciaId = process.env.REACT_APP_FRECUENCIA_RECONSULTA_ID;
  const tipoCitaDerivadaId = process.env.REACT_APP_TIPO_CITA_DERIVADO_ID;
  const fisicoMedioId = process.env.REACT_APP_MEDIO_FISICO_ID;

  const [values, setValues] = useState({
    fecha_show: fecha_cita,
    fecha: fecha,
    fecha_actual: fecha,
    hora_actual: hora,
    paciente: consulta.paciente,
    paciente_nombre: `${consulta.paciente.nombres} ${consulta.paciente.apellidos}`,
    telefono: consulta.paciente.telefono,
    precio: consulta.precio,
    total: consulta.total,
    quien_agenda: empleado,
    tipo_cita: tipoCitaDerivadaId,
    promovendedor: promovendedorSinPromovendedorId,
    status: pendienteStatusId,
    observaciones: consulta.observaciones,
    dermatologo: consulta.dermatologo._id,
    frecuencia: reconsultaFrecuenciaId,
    servicio: consulta.servicio,
    sucursal: consulta.sucursal._id,
    producto: consulta.producto._id,
    medio: fisicoMedioId,
    forma_pago: consulta.forma_pago._id,
  });

  const loadHorarios = async (date) => {
    const dia = date ? date.getDate() : values.fecha_show.getDate();
    const mes = Number(date ? date.getMonth() : values.fecha_show.getMonth()) + 1;
    const anio = date ? date.getFullYear() : values.fecha_show.getFullYear();
    const response = await findScheduleInConsultByDateAndSucursal(consultaServicioId, dia, mes, anio, sucursal);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setHorarios(response.data);
    }
  }

  const handleChangeSucursal = item => {
    setValues({ 
      ...values,
      sucursal: item.target.value
    });
  };

  const handleChangeProductos = (e) => {
		setValues({ ...values, producto: e.target.value });
	}

  const handleChangePaymentMethod = (event) => {
		setValues({
			...values,
			forma_pago: event.target.value,
		});
	}

  const handleChangeFecha = async (date) => {
    setIsLoading(true);
    await setValues({
      ...values,
      fecha_hora: date,
      hora: '',
    });
    await loadHorarios(date);
    setIsLoading(false);
  };

  const handleChangeHora = e => {
    setIsLoading(true);
    const hora = (e.target.value).split(':');
    const date = new Date(values.fecha_hora);
    date.setHours(Number(hora[0]));
    date.setMinutes(hora[1]);
    date.setSeconds(0);
    setValues({
      ...values,
      fecha_hora: date,
      hora: e.target.value,
    });
    setIsLoading(false);
  };

  const handleChangeDermatologo = (e) => {
    setValues({ ...values, dermatologo: e.target.value });
  }

  const handleChangeObservaciones = e => {
    setValues({ ...values, observaciones: e.target.value.toUpperCase() });
  }

  const handleOnClickProximarCita = async (data) => {
    setIsLoading(true);
    data.hora_llegada = '--:--';
    data.hora_atencion = '--:--';
    data.hora_salida = '--:--';
    const response = await createConsult(data);
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
        setMessage('CONSULTA AGREGADA CORRECTAMENTE');
        const dia = addZero(data.fecha_show.getDate());
        const mes = addZero(data.fecha_show.getMonth() + 1);
        const anio = data.fecha_show.getFullYear();
        setFilterDate({
          fecha_show: data.fecha_hora,
          fecha: `${dia}/${mes}/${anio}`
        });
        loadConsultas(data.fecha_hora);
      //}
    }
    onClose();
    setIsLoading(false);
  };

  const handleChangeTiempo = e => {
    setValues({ ...values, tiempo: e.target.value });
  };

  const loadDermatologos = async () => {
    const response = await findEmployeesByRolIdAvailable(dermatologoRolId);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setDermatologos(response.data);
    }
  }

  const loadSucursales = async () => {
    const response = await showAllOffices();
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      const sucursales = response.data;
      setSucursales(sucursales);
    }
  }

  const loadProductos = async () => {
    const response = await findProductoByServicio(consultaServicioId);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setProductos(response.data);
    }
  }

  const loadFormasPago = async () => {
		const response = await showAllMetodoPago();
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			setFormasPago(response.data);
		}
	}

  const  loadAll = async () => {
    setIsLoading(true);
    await loadSucursales();
    await loadHorarios();
    await loadDermatologos();
    await loadProductos();
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
          <ModalFormProximaConsulta
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={open}
            values={values}
            onClose={onClose}
            consulta={consulta}
            empleado={empleado}
            productos={productos}
            sucursales={sucursales}
            onChangeSucursal={(e) => handleChangeSucursal(e)}
            onClickProximarCita={handleOnClickProximarCita}
            onChangeFecha={(e) => handleChangeFecha(e)}
            onChangeHora={(e) => handleChangeHora(e)}
            onChangeTiempo={(e) => handleChangeTiempo(e)}
            horarios={horarios}
            onChangeDermatologo={(e) => handleChangeDermatologo(e)}
            dermatologos={dermatologos}
            onChangeObservaciones={handleChangeObservaciones}
            sucursal={sucursal}
            onChangeProductos={(e) => handleChangeProductos(e)}
            onChangePaymentMethod={(e) => handleChangePaymentMethod(e)}
            formasPago={formasPago}
            tipoServicioId={consultaServicioId} /> :
          <Backdrop className={classes.backdrop} open={isLoading} >
            <CircularProgress color="inherit" />
          </Backdrop>
      }
    </Fragment>

  );
}

export default ModalProximaConsulta;