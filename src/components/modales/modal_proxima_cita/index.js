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
import ModalFormProximaCita from './ModalFormProximaCita';
import { createCirugia } from '../../../services/cirugias';
import { createEstetica } from '../../../services/esteticas';
import { createDermapen } from '../../../services/dermapens';
import { findEmployeesByRolIdAvailable } from '../../../services/empleados';

const useStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const ModalProximaCita = (props) => {

  const classes = useStyles();

  const {
    open,
    onClose,
    cita,
    empleado,
    loadConsultas,
    tratamientos,
    sucursal,
    setOpenAlert,
    setMessage,
    setFilterDate,
    loadAparatologias,
    loadFaciales,
    loadLaser,
    loadDermapens,
  } = props;

  const [isLoading, setIsLoading] = useState(true);
  const [sucursales, setSucursales] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [areas, setAreas] = useState([]);
  const [cosmetologas, setCosmetologas] = useState([]);
  const [dermatologos, setDermatologos] = useState([]);
  const [formasPago, setFormasPago] = useState([]);
  const fecha_cita = new Date(cita.fecha_hora);
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
  const sucursalRubenDarioId = process.env.REACT_APP_SUCURSAL_RUBEN_DARIO_ID;
  const servicioAparatologiaId = process.env.REACT_APP_APARATOLOGIA_SERVICIO_ID;
  const servicioFacialId = process.env.REACT_APP_FACIAL_SERVICIO_ID;
  const servicioLaserId = process.env.REACT_APP_LASER_SERVICIO_ID;
  const servicioCirugiaId = process.env.REACT_APP_CIRUGIA_SERVICIO_ID;
  const servicioEsteticaId = process.env.REACT_APP_ESTETICA_SERVICIO_ID;
  const servicioDermapenId = process.env.REACT_APP_DERMAPEN_SERVICIO_ID;

  const [values, setValues] = useState({
    fecha_show: fecha_cita,
    fecha: fecha,
    hora: 0,
    fecha_actual: fecha,
    hora_actual: 0,
    paciente: cita.paciente,
    paciente_nombre: `${cita.paciente.nombres} ${cita.paciente.apellidos}`,
    telefono: cita.paciente.telefono,
    precio: cita.precio,
    total: cita.total,
    cosmetologa: cita.cosmetologa ? cita.cosmetologa._id : '',
    quien_agenda: empleado,
    tipo_cita: tipoCitaDerivadaId,
    promovendedor: promovendedorSinPromovendedorId,
    status: pendienteStatusId,
    observaciones: '',
    dermatologo: cita.dermatologo ? cita.dermatologo : '',
    frecuencia: reconsultaFrecuenciaId,
    servicio: cita.servicio,
    sucursal: cita.sucursal._id,
    medio: fisicoMedioId,
    tratamientos: cita.tratamientos,
    areas: cita.areas,
    tiempo: cita.tiempo,
    dermatologo: cita.dermatologo._id,
    forma_pago: cita.forma_pago._id,
    producto: cita.producto,
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

  const loadAreas = async (tratamiento) => {
    const response = await findAreasByTreatmentServicio(tratamiento.servicio, tratamiento._id);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setAreas(response.data);
    }
  }

  const loadCosmetologas = async () => {
    const response = await findEmployeesByRolIdAvailable(cosmetologaRolId, empleado.access_token);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setCosmetologas(response.data);
    }
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

  const handleChangeObservaciones = e => {
    setValues({ ...values, observaciones: e.target.value.toUpperCase() });
  }

  const handleOnClickProximarCita = async (data) => {
    setIsLoading(true);
    data.hora_llegada = '--:--';
    let response;
    switch (cita.servicio._id) {
      case servicioAparatologiaId:
        response = await createAparatologia(data, empleado.access_token);
        break;
      case servicioFacialId:
        response = await createFacial(data, empleado.access_token);
        break;
      case servicioLaserId:
        response = await createLaser(data, empleado.access_token);
        break;
      case servicioCirugiaId:
        response = await createCirugia(data, empleado.access_token);
        break;
      case servicioEsteticaId:
        response = await createEstetica(data, empleado.access_token);
        break;
      case servicioDermapenId:
        response = await createDermapen(data, empleado.access_token);
        break;
    }
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
      const consecutivo = {
        consecutivo: response.data.consecutivo,
        tipo_servicio: cita.servicio._id,
        servicio: response.data._id,
        sucursal: sucursal._id,
        fecha_hora: new Date(),
        status: response.data.status,
      }
      const responseConsecutivo = await createConsecutivo(consecutivo);
      if (`${responseConsecutivo.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
        setOpenAlert(true);
        setMessage('CITA AGREGADA CORRECTAMENTE');
        const dia = addZero(data.fecha_show.getDate());
        const mes = addZero(data.fecha_show.getMonth() + 1);
        const anio = data.fecha_show.getFullYear();
        setFilterDate({
          fecha_show: data.fecha_hora,
          fecha: `${dia}/${mes}/${anio}`
        });
      }
    }

    switch (cita.servicio._id) {
      case servicioAparatologiaId:
        await loadAparatologias(data.fecha_hora, empleado.access_token);
        break;
      case servicioFacialId:
        await loadFaciales(data.fecha_hora, empleado.access_token);
        break;
      case servicioLaserId:
        await loadLaser(data.fecha_hora, empleado.access_token);
        break;
      case servicioCirugiaId:
        await createCirugia(data.fecha_hora, empleado.access_token);
        break;
      case servicioEsteticaId:
        await createEstetica(data.fecha_hora, empleado.access_token);
        break;
      case servicioDermapenId:
        await loadDermapens(data.fecha_hora, empleado.access_token);
        break;
    }
    setIsLoading(false);
    onClose();
  };

  const handleChangeTiempo = e => {
    setValues({ ...values, tiempo: e.target.value });
  };

  const handleChangeCosmetologa = e => {
    setValues({ ...values, cosmetologa: e.target.value });
  }

  const handleChangeDermatologo = (e) => {
    setValues({ ...values, dermatologo: e.target.value });
  }

  const handleChangeTratamientos = (e) => {
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

  const handleChangeTotal = (event) => {
    const precio = event.target.value;
    let total_aplicacion = precio;

    setValues({
      ...values,
      precio: precio,
      total: precio,
      total_aplicacion: total_aplicacion,
    })

  }

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

  const handleChangeAreas = async (items, tratamiento) => {

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
      precio: precio
    });
    setIsLoading(false);
  }

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

  const loadFormasPago = async () => {
    const response = await showAllMetodoPago();
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setFormasPago(response.data);
    }
  }

  const loadAll = async () => {
    setIsLoading(true);
    await loadSucursales();
    await loadHorarios(new Date);
    await loadAreas(cita.tratamientos[0]);
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
          <ModalFormProximaCita
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={open}
            values={values}
            onClose={onClose}
            cita={cita}
            empleado={empleado}
            sucursales={sucursales}
            onChangeSucursal={(e) => handleChangeSucursal(e)}
            onChangeTratamientos={(e) => handleChangeTratamientos(e)}
            onClickProximarCita={handleOnClickProximarCita}
            onChangeAreas={handleChangeAreas}
            onChangeFecha={(e) => handleChangeFecha(e)}
            onChangeHora={(e) => handleChangeHora(e)}
            onChangeTiempo={(e) => handleChangeTiempo(e)}
            onChangeCosmetologa={(e) => handleChangeCosmetologa(e)}
            onChangeDermatologo={(e) => handleChangeDermatologo(e)}
            horarios={horarios}
            onChangeObservaciones={handleChangeObservaciones}
            sucursal={sucursal}
            tipoServicioId={consultaServicioId}
            tratamientos={tratamientos}
            areas={areas}
            dermatologos={dermatologos}
            cosmetologas={cosmetologas}
            onChangePaymentMethod={(e) => handleChangePaymentMethod(e)}
            formasPago={formasPago}
            onChangeTotal={handleChangeTotal} /> :
          <Backdrop className={classes.backdrop} open={isLoading} >
            <CircularProgress color="inherit" />
          </Backdrop>
      }
    </Fragment>

  );
}

export default ModalProximaCita;