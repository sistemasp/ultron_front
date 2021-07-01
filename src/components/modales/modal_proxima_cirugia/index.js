import React, { useState, useEffect, Fragment } from 'react';
import {
  createConsecutivo,
  findScheduleByDateAndSucursalAndService,
  showAllMetodoPago,
  showAllOffices,
} from "../../../services";
import {
  findAreasByTreatmentServicio,
} from "../../../services/areas";
import { createAparatologia } from '../../../services/aparatolgia';
import { createFacial } from '../../../services/faciales';
import { createLaser } from '../../../services/laser';
import { Backdrop, CircularProgress, makeStyles } from '@material-ui/core';
import { addZero } from '../../../utils/utils';
import ModalFormProximaCirugia from './ModalFormProximaCirugia';
import { findProductoByServicio } from '../../../services/productos';
import { createCirugia } from '../../../services/cirugias';
import { findEmployeesByRolIdAvailable } from '../../../services/empleados';

const useStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const ModalProximaCirugia = (props) => {

  const classes = useStyles();

  const {
    open,
    onClose,
    cirugia,
    empleado,
    sucursal,
    setOpenAlert,
    setMessage,
    setFilterDate,
    loadCirugias,
  } = props;

  const [isLoading, setIsLoading] = useState(true);
  const [sucursales, setSucursales] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [areas, setAreas] = useState([]);
  const [cosmetologas, setCosmetologas] = useState([]);
  const [formasPago, setFormasPago] = useState([]);
  const [dermatologos, setDermatologos] = useState([]);
  const fecha_cita = new Date(cirugia.fecha_hora);
  const fecha = `${addZero(fecha_cita.getDate())}/${addZero(Number(fecha_cita.getMonth() + 1))}/${addZero(fecha_cita.getFullYear())}`;
  const hora = `${addZero(Number(fecha_cita.getHours()))}:${addZero(fecha_cita.getMinutes())}`;

  const promovendedorSinPromovendedorId = process.env.REACT_APP_PROMOVENDEDOR_SIN_PROMOVENDEDOR_ID;
  const cosmetologaRolId = process.env.REACT_APP_COSMETOLOGA_ROL_ID;
  const dermatologoRolId = process.env.REACT_APP_DERMATOLOGO_ROL_ID;
  const pendienteStatusId = process.env.REACT_APP_PENDIENTE_STATUS_ID;
  const consultaServicioId = process.env.REACT_APP_CONSULTA_SERVICIO_ID;
  const reconsultaFrecuenciaId = process.env.REACT_APP_FRECUENCIA_RECONSULTA_ID;
  const tipoCitaDerivadaId = process.env.REACT_APP_TIPO_CITA_DERIVADO_ID;
  const fisicoMedioId = process.env.REACT_APP_MEDIO_FISICO_ID;
  const sucursalManuelAcunaId = process.env.REACT_APP_SUCURSAL_MANUEL_ACUNA_ID;
  const sucursalOcciId = process.env.REACT_APP_SUCURSAL_OCCI_ID;
  const sucursalFedeId = process.env.REACT_APP_SUCURSAL_FEDE_ID;
  const servicioAparatologiaId = process.env.REACT_APP_APARATOLOGIA_SERVICIO_ID;
  const servicioFacialId = process.env.REACT_APP_FACIAL_SERVICIO_ID;
  const servicioLaserId = process.env.REACT_APP_LASER_SERVICIO_ID;
  const cirugiaServicioId = process.env.REACT_APP_CIRUGIA_SERVICIO_ID;
  const productoCirugiaId = process.env.REACT_APP_PRODUCTO_CIRUGIA_ID;

  const [productos, setProductos] = useState([]);
  const [values, setValues] = useState({
    fecha_show: fecha_cita,
    fecha: fecha,
    hora: 0,
    fecha_actual: fecha,
    fecha_hora: new Date(),
    hora_actual: 0,
    paciente: cirugia.paciente,
    paciente_nombre: `${cirugia.paciente.nombres} ${cirugia.paciente.apellidos}`,
    telefono: cirugia.paciente.telefono,
    precio: cirugia.precio,
    total: cirugia.total,
    cosmetologa: cirugia.cosmetologa ? cirugia.cosmetologa._id : '',
    quien_agenda: empleado,
    tipo_cita: tipoCitaDerivadaId,
    promovendedor: promovendedorSinPromovendedorId,
    status: pendienteStatusId,
    observaciones: '',
    dermatologo: cirugia.dermatologo ? cirugia.dermatologo : '',
    frecuencia: reconsultaFrecuenciaId,
    producto: productoCirugiaId,
    servicio: cirugia.servicio,
    sucursal: cirugia.sucursal._id,
    medio: fisicoMedioId,
    areas: cirugia.areas,
    forma_pago: cirugia.forma_pago._id,
    tiempo: cirugia.tiempo,
    dermatologo: cirugia.dermatologo._id,
    hora: 0,
    minutos: 0,
  });

  const loadHorarios = async (date) => {
    const dia = date ? date.getDate() : values.fecha_show.getDate();
    const mes = Number(date ? date.getMonth() : values.fecha_show.getMonth()) + 1;
    const anio = date ? date.getFullYear() : values.fecha_show.getFullYear();
    const response = await findScheduleByDateAndSucursalAndService(dia, mes, anio, sucursal, values.servicio._id);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setHorarios(response.data);
    }
  }

  const handleChangeFecha = async (date) => {
    setIsLoading(true);
    date.setHours(Number(values.hora));
    date.setMinutes(Number(values.minutos));
    date.setSeconds(0);
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
    const hora = (e.target.value);
    const date = new Date(values.fecha_hora);
    date.setHours(Number(hora));
    date.setMinutes(Number(values.minutos));
    date.setSeconds(0);
    setValues({
      ...values,
      fecha_hora: date,
      hora: hora,
    });
    setIsLoading(false);
  };

  const handleChangeMinutos = e => {
    setIsLoading(true);
    const minutos = e.target.value;
    const date = new Date(values.fecha_hora);
    date.setHours(Number(values.hora));
    date.setMinutes(minutos);
    date.setSeconds(0);
    setValues({
      ...values,
      fecha_hora: date,
      minutos: minutos,
    });

    setIsLoading(false);
  };

  const handleChangeObservaciones = e => {
    setValues({ ...values, observaciones: e.target.value.toUpperCase() });
  }

  const handleOnClickProximarCita = async (data) => {
    setIsLoading(true);
    data.hora_llegada = '--:--';
		data.hora_atencion = '--:--';
		data.hora_salida = '--:--';
    const response = await createCirugia(data, empleado.access_token);
    /*switch (cirugia.servicio._id) {
      case servicioAparatologiaId:
        response = await createAparatologia(data);
        break;
      case servicioFacialId:
        response = await createFacial(data);
        break;
      case servicioLaserId:
        response = await createLaser(data);
        break;
    }*/
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
      const consecutivo = {
        consecutivo: response.data.consecutivo,
        tipo_servicio: cirugia.servicio._id,
        servicio: response.data._id,
        sucursal: sucursal._id,
        fecha_hora: new Date(),
        status: response.data.status,
      }
      const responseConsecutivo = await createConsecutivo(consecutivo);
      if (`${responseConsecutivo.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
        setOpenAlert(true);
        setMessage('CIRUGIA AGREGADA CORRECTAMENTE');
        const dia = addZero(data.fecha_show.getDate());
        const mes = addZero(data.fecha_show.getMonth() + 1);
        const anio = data.fecha_show.getFullYear();
        setFilterDate({
          fecha_show: data.fecha_hora,
          fecha: `${dia}/${mes}/${anio}`
        });
      }
    }

    await loadCirugias(data.fecha_hora);
    setIsLoading(false);
    onClose();
  };

  const handleChangeSucursal = item => {
    setValues({
      ...values,
      sucursal: item.target.value
    });
  };

  const handleChangePaymentMethod = (event) => {
    setValues({
      ...values,
      forma_pago: event.target.value,
    });
  }

  const handleChangeTiempo = e => {
    setValues({ ...values, tiempo: e.target.value });
  };

  const handleChangeCosmetologa = e => {
    setValues({ ...values, cosmetologa: e.target.value });
  }

  const handleChangeDermatologo = (e) => {
    setValues({ ...values, dermatologo: e.target.value });
  }

  const handleChangeProductos = (e) => {
    setValues({ ...values, producto: e.target.value });
  }

  const handleChangeTotal = e => {
    let total_aplicacion = Number(e.target.value);
    setValues({
      ...values,
      precio: e.target.value,
      total: e.target.value,
      total_aplicacion: total_aplicacion,
    });
  };

  const loadSucursales = async () => {
    const response = await showAllOffices();
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      const sucursales = response.data;
      setSucursales(sucursales);
    }
  }

  const loadDermatologos = async () => {
    const response = await findEmployeesByRolIdAvailable(dermatologoRolId, empleado.access_token);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setDermatologos(response.data);
    }
  }

  const loadProductos = async () => {
    const response = await findProductoByServicio(cirugiaServicioId);
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

  const loadAll = async () => {
    setIsLoading(true);
    await loadSucursales();
    await loadDermatologos();
    await loadProductos();
    await loadFormasPago();
    setIsLoading(false);
  }

  useEffect(() => {
    loadAll();
  }, [consultaServicioId]);

  return (
    <Fragment>
      {
        !isLoading ?
          <ModalFormProximaCirugia
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={open}
            values={values}
            onClose={onClose}
            cita={cirugia}
            empleado={empleado}
            sucursales={sucursales}
            onChangeSucursal={(e) => handleChangeSucursal(e)}
            onClickProximarCita={handleOnClickProximarCita}
            onChangeFecha={(e) => handleChangeFecha(e)}
            onChangeHora={(e) => handleChangeHora(e)}
            onChangeMinutos={(e) => handleChangeMinutos(e)}
            onChangeTiempo={(e) => handleChangeTiempo(e)}
            onChangeCosmetologa={(e) => handleChangeCosmetologa(e)}
            onChangeDermatologo={(e) => handleChangeDermatologo(e)}
            onChangeTotal={handleChangeTotal}
            horarios={horarios}
            onChangeObservaciones={handleChangeObservaciones}
            sucursal={sucursal}
            tipoServicioId={consultaServicioId}
            dermatologos={dermatologos}
            productos={productos}
            onChangePaymentMethod={(e) => handleChangePaymentMethod(e)}
            formasPago={formasPago}

            onChangeProductos={(e) => handleChangeProductos(e)} /> :
          <Backdrop className={classes.backdrop} open={isLoading} >
            <CircularProgress color="inherit" />
          </Backdrop>
      }
    </Fragment>

  );
}

export default ModalProximaCirugia;