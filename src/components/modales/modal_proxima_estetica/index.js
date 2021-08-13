import React, { useState, useEffect, Fragment } from 'react';
import {
  createConsecutivo,
  findScheduleByDateAndSucursalAndService,
  showAllMedios,
  showAllMetodoPago,
  showAllOffices,
} from "../../../services";
import { Backdrop, CircularProgress, makeStyles } from '@material-ui/core';
import { addZero } from '../../../utils/utils';
import { findProductoByServicio } from '../../../services/productos';
import { createCirugia } from '../../../services/cirugias';
import ModalFormProximaEstetica from './ModalFormProximaEstetica';
import { createEstetica } from '../../../services/esteticas';
import { findEmployeesByRolIdAvailable } from '../../../services/empleados';

const useStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const ModalProximaEstetica = (props) => {

  const classes = useStyles();

  const {
    open,
    onClose,
    estetica,
    empleado,
    sucursal,
    setOpenAlert,
    setMessage,
    setFilterDate,
    loadEsteticas,
  } = props;

  const [isLoading, setIsLoading] = useState(true);
  const [sucursales, setSucursales] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [cosmetologas, setCosmetologas] = useState([]);
  const [dermatologos, setDermatologos] = useState([]);
  const [promovendedores, setPromovendedores] = useState([]);
  const [medios, setMedios] = useState([]);
  const [formasPago, setFormasPago] = useState([]);
  const fecha_cita = new Date(estetica.fecha_hora);
  const fecha = `${addZero(fecha_cita.getDate())}/${addZero(Number(fecha_cita.getMonth() + 1))}/${addZero(fecha_cita.getFullYear())}`;
  const hora = `${addZero(Number(fecha_cita.getHours()))}:${addZero(fecha_cita.getMinutes())}`;

  const promovendedorSinPromovendedorId = process.env.REACT_APP_PROMOVENDEDOR_SIN_PROMOVENDEDOR_ID;
  const promovendedorRolId = process.env.REACT_APP_PROMOVENDEDOR_ROL_ID;
  const cosmetologaRolId = process.env.REACT_APP_COSMETOLOGA_ROL_ID;
  const dermatologoRolId = process.env.REACT_APP_DERMATOLOGO_ROL_ID;
  const pendienteStatusId = process.env.REACT_APP_PENDIENTE_STATUS_ID;
  const consultaServicioId = process.env.REACT_APP_CONSULTA_SERVICIO_ID;
  const reconsultaFrecuenciaId = process.env.REACT_APP_FRECUENCIA_RECONSULTA_ID;
  const tipoCitaDerivadaId = process.env.REACT_APP_TIPO_CITA_DERIVADO_ID;
  const cosmetologaSinAsignarId = process.env.REACT_APP_COSMETOLOGA_SIN_ASIGNAR_ID;
  const esteticaServicioId = process.env.REACT_APP_ESTETICA_SERVICIO_ID;
  const productoCirugiaId = process.env.REACT_APP_PRODUCTO_CIRUGIA_ID;

  const [productos, setProductos] = useState([]);
  const [values, setValues] = useState({
    fecha_show: fecha_cita,
    fecha: fecha,
    hora: 0,
    fecha_actual: fecha,
    fecha_hora: new Date(),
    hora_actual: 0,
    paciente: estetica.paciente,
    paciente_nombre: `${estetica.paciente.nombres} ${estetica.paciente.apellidos}`,
    telefono: estetica.paciente.telefono,
    precio: estetica.precio,
    total: estetica.total,
    total_aplicacion: estetica.total_aplicacion,
    cosmetologa: cosmetologaSinAsignarId,
    quien_agenda: empleado,
    tipo_cita: tipoCitaDerivadaId,
    promovendedor: promovendedorSinPromovendedorId,
    status: pendienteStatusId,
    observaciones: '',
    dermatologo: estetica.dermatologo ? estetica.dermatologo : '',
    frecuencia: reconsultaFrecuenciaId,
    producto: estetica.producto,
    servicio: estetica.servicio,
    sucursal: estetica.sucursal._id,
    medio: estetica.medio._id,
    areas: estetica.areas,
    forma_pago: estetica.forma_pago._id,
    tiempo: estetica.tiempo,
    dermatologo: estetica.dermatologo._id,
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

  const loadCosmetologas = async () => {
    const response = await findEmployeesByRolIdAvailable(cosmetologaRolId, empleado.access_token);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setCosmetologas(response.data);
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

  const handleOnClickProximaEstetica = async (data) => {
    setIsLoading(true);
    data.hora_llegada = '--:--';
    data.hora_atencion = '--:--';
    data.hora_salida = '--:--';
    const response = await createEstetica(data, empleado.access_token);
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
      setOpenAlert(true);
      setMessage('ESTÉTICA AGREGADA CORRECTAMENTE');
      const dia = addZero(data.fecha_show.getDate());
      const mes = addZero(data.fecha_show.getMonth() + 1);
      const anio = data.fecha_show.getFullYear();
      setFilterDate({
        fecha_show: data.fecha_hora,
        fecha: `${dia}/${mes}/${anio}`
      });
    }

    await loadEsteticas(data.fecha_hora);
    setIsLoading(false);
    onClose();
  };

  const handleChangeSucursal = item => {
    setValues({
      ...values,
      sucursal: item.target.value
    });
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

  const handleChangePromovendedor = (e) => {
    setValues({ ...values, promovendedor: e.target.value });
  }

  const handleChangeMedio = (e) => {
    setValues({ ...values, medio: e.target.value });
  }

  const handleChangeProductos = (items) => {
    setIsLoading(true);
    setValues({
      ...values,
      producto: items
    });
    setIsLoading(false);
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

  const loadDermatologos = async () => {
    const response = await findEmployeesByRolIdAvailable(dermatologoRolId, empleado.access_token);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setDermatologos(response.data);
    }
  }

  const loadProductos = async () => {
    const response = await findProductoByServicio(esteticaServicioId);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setProductos(response.data);
    }
  }

  const handleChangePaymentMethod = (event) => {
    setValues({
      ...values,
      forma_pago: event.target.value,
    });
  }

  const loadSucursales = async () => {
    const response = await showAllOffices();
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      const sucursales = response.data;
      setSucursales(sucursales);
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
  const loadPromovendedores = async () => {
    const response = await findEmployeesByRolIdAvailable(promovendedorRolId, empleado.access_token);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setPromovendedores(response.data);
    }
  }

  const loadAll = async () => {
    setIsLoading(true);
    await loadSucursales();
    await loadDermatologos();
    await loadProductos();
    await loadFormasPago();
    await loadMedios();
    await loadPromovendedores();
    await loadCosmetologas();
    setIsLoading(false);
  }

  useEffect(() => {
    loadAll();
  }, [consultaServicioId]);

  return (
    <Fragment>
      {
        !isLoading ?
          <ModalFormProximaEstetica
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={open}
            values={values}
            onClose={onClose}
            cita={estetica}
            empleado={empleado}
            sucursales={sucursales}
            onChangeSucursal={(e) => handleChangeSucursal(e)}
            onClickProximarEstetica={handleOnClickProximaEstetica}
            onChangeFecha={(e) => handleChangeFecha(e)}
            onChangeHora={(e) => handleChangeHora(e)}
            onChangeMinutos={(e) => handleChangeMinutos(e)}
            onChangeTiempo={(e) => handleChangeTiempo(e)}
            onChangeCosmetologa={(e) => handleChangeCosmetologa(e)}
            onChangeDermatologo={(e) => handleChangeDermatologo(e)}
            onChangePaymentMethod={(e) => handleChangePaymentMethod(e)}
            onChangePromovendedor={(e) => handleChangePromovendedor(e)}
            onChangeMedio={(e) => handleChangeMedio(e)}
            onChangeTotal={handleChangeTotal}
            horarios={horarios}
            onChangeObservaciones={handleChangeObservaciones}
            sucursal={sucursal}
            tipoServicioId={consultaServicioId}
            dermatologos={dermatologos}
            productos={productos}
            medios={medios}
            promovendedores={promovendedores}
            cosmetologas={cosmetologas}
            formasPago={formasPago}
            onChangeProductos={(e) => handleChangeProductos(e)} /> :
          <Backdrop className={classes.backdrop} open={isLoading} >
            <CircularProgress color="inherit" />
          </Backdrop>
      }
    </Fragment>

  );
}

export default ModalProximaEstetica;