import React, { useState, useEffect, Fragment } from 'react';
import { createConsecutivo, createPago, deletePago, showAllOffices } from '../../../services';
import { addZero, generateFolio } from '../../../utils/utils';
import ModalFormTraspasoServicio from './ModalFormTraspasoServicio';
import { showAllStatusVisibles } from '../../../services/status';
import { createEntrada, deleteEntrada, updateEntrada } from '../../../services/entradas';
import { createFacial, updateFacial } from '../../../services/faciales';
import { createAparatologia, updateAparatologia } from '../../../services/aparatolgia';
import { createCirugia, updateCirugia } from '../../../services/cirugias';
import { createEstetica, updateEstetica } from '../../../services/esteticas';
import { createDermapen, updateDermapen } from '../../../services/dermapens';

const ModalTraspasoServicio = (props) => {
  const {
    open,
    onClose,
    sucursal,
    servicio,
    empleado,
    loadServicios,
    tipoServicioId,
    setOpenAlert,
    setMessage,
    colorBase,
  } = props;

  const consultaServicioId = process.env.REACT_APP_CONSULTA_SERVICIO_ID;
  const canceladoSPStatusId = process.env.REACT_APP_CANCELO_SP_STATUS_ID;
  const asistioStatusId = process.env.REACT_APP_ASISTIO_STATUS_ID;
  const tipoEntradaServicioId = process.env.REACT_APP_TIPO_INGRESO_CONSULTA_ID;
  const pendienteStatusId = process.env.REACT_APP_PENDIENTE_STATUS_ID;
  const servicioFacialId = process.env.REACT_APP_FACIAL_SERVICIO_ID;
  const servicioAparatologiaId = process.env.REACT_APP_APARATOLOGIA_SERVICIO_ID;
  const servicioCirugiaId = process.env.REACT_APP_CIRUGIA_SERVICIO_ID;
  const servicioEsteticaId = process.env.REACT_APP_ESTETICA_SERVICIO_ID;
  const servicioDermapenId = process.env.REACT_APP_DERMAPEN_SERVICIO_ID;

  const [isLoading, setIsLoading] = useState(true);
  const [sucursales, setSucursales] = useState([]);
  const [estadoAsistio, setEstadoAsistio] = useState();
  const [values, setValues] = useState({
    sucursal: sucursal
  });

  const confirmacion = () => {
    setMessage('SERVICIO TRASPASADO CORRECTAMENTE');
    setOpenAlert(true);
  }

  const handleChangeSucursal = e => {
    setIsLoading(true);
    setValues({ ...values, sucursal: e.target.value });
    setIsLoading(false);
  };

  const handleClickTraspasar = async (rowData) => {
    setIsLoading(true);
    servicio.status = { _id: canceladoSPStatusId };
    const dateNow = new Date();
    const pagos = [];
    servicio.pagos.forEach(async (pago) => {
      pagos.push(pago);
      await deleteEntrada(pago.entrada);
      await deletePago(pago._id);
    });
    servicio.pagado = false;
    servicio.pagos = [];
    let servicioResponse;
    if (servicio.servicio._id === servicioFacialId) {
      servicioResponse = await updateFacial(servicio._id, servicio, empleado.access_token);
    } else if (servicio.servicio._id === servicioAparatologiaId) {
      servicioResponse = await updateAparatologia(servicio._id, servicio, empleado.access_token);
    } else if (servicio.servicio._id === servicioCirugiaId) {
      servicioResponse = await updateCirugia(servicio._id, servicio, empleado.access_token);
    } else if (servicio.servicio._id === servicioEsteticaId) {
      servicioResponse = await updateEstetica(servicio._id, servicio, empleado.access_token);
    } else if (servicio.servicio._id === servicioDermapenId) {
      servicioResponse = await updateDermapen(servicio._id, servicio, empleado.access_token);
    }

    if (`${servicioResponse.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      servicio._id = undefined;
      servicio.consecutivo = undefined;
      servicio.quien_agenda = empleado;
      servicio.sucursal = rowData.sucursal;
      servicio.status = { _id: pendienteStatusId };
      servicio.hora_llegada = `--:--`;
      servicio.hora_aplicacion = dateNow.toString();
      //servicio.hora_atencion = '--:--';
      //servicio.hora_salida = '--:--';
      servicio.observaciones = `SERVICIO TRASPASADO`;
      servicio.pagado = true;
      let response;

      if (servicio.servicio._id === servicioFacialId) {
        response = await createFacial(servicio, empleado.access_token);
      } else if (servicio.servicio._id === servicioAparatologiaId) {
        response = await createAparatologia(servicio, empleado.access_token);
      } else if (servicio.servicio._id === servicioCirugiaId) {
        response = await createCirugia(servicio, empleado.access_token);
      } else if (servicio.servicio._id === servicioEsteticaId) {
        response = await createEstetica(servicio, empleado.access_token);
      } else if (servicio.servicio._id === servicioDermapenId) {
        response = await createDermapen(servicio, empleado.access_token);
      }

      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
        const servicioRes = response.data;
        const consecutivo = {
          consecutivo: response.data.consecutivo,
          tipo_servicio: consultaServicioId,
          servicio: response.data._id,
          sucursal: servicioRes.sucursal,
          fecha_hora: dateNow,
          status: response.data.status,
        }

        const responseConsecutivo = await createConsecutivo(consecutivo);
        if (`${responseConsecutivo.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
          pagos.forEach(async (pago) => {
            pago.fecha_pago = dateNow;
            pago.observaciones = "TRASPASO";
            pago.sucursal = servicioRes.sucursal;
            pago.servicio = servicioRes._id;
            pago.hora_aplicacion = servicioRes.hora_aplicacion;

            const entrada = {
              create_date: dateNow,
              hora_aplicacion: servicioRes.hora_aplicacion,
              recepcionista: empleado,
              concepto: `TRASPASO FOLIO: ${generateFolio(servicioRes)}`,
              cantidad: pago.total,
              tipo_entrada: tipoEntradaServicioId,
              sucursal: servicioRes.sucursal,
              forma_pago: pago.forma_pago,
              pago_anticipado: pago.pago_anticipado,
            }

            const response = await createEntrada(entrada);

            if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
              const resEntrada = response.data;
              pago.entrada = resEntrada._id;

              const res = await createPago(pago);
              if (`${res.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
                resEntrada.pago = res.data._id;
                await updateEntrada(resEntrada._id, resEntrada);
                confirmacion();
              }
            }
          });
        }
      }
    }
    loadServicios(dateNow);
    setIsLoading(false);
    onClose();
  }

  const loadSucursales = async () => {
    const response = await showAllOffices();
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setSucursales(response.data);
    }
  }

  const loadStaus = async () => {
    const response = await showAllStatusVisibles();
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setEstadoAsistio(response.data.find(item => item._id === asistioStatusId));
    }
    setIsLoading(false);
  }

  useEffect(() => {
    setIsLoading(true);
    loadSucursales();
    loadStaus();
    setIsLoading(false);
  }, []);

  return (
    <Fragment>
      <ModalFormTraspasoServicio
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        values={values}
        open={open}
        onClickCancel={onClose}
        onChangeSucursal={(e) => handleChangeSucursal(e)}
        isLoading={isLoading}
        servicio={servicio}
        empleado={empleado}
        sucursal={sucursal}
        sucursales={sucursales}
        colorBase={colorBase}
        onClickTraspasar={(e) => handleClickTraspasar(e)}
        tipoServicioId={tipoServicioId} />
    </Fragment>


  );
}

export default ModalTraspasoServicio;