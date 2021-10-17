import React, { useState, useEffect, Fragment } from 'react';
import { Backdrop, CircularProgress, makeStyles } from '@material-ui/core';
import {
  createSalida, findSalidaByPagoDermatologoId, updateSalida,
} from '../../../services/salidas';
import { findTurnoActualBySucursal, showCorteTodayBySucursalAndTurno } from '../../../services/corte';
import {
  findCuracionesByPayOfPatologoHoraAplicacion,
  updateCuracion
} from '../../../services/curaciones';
import { createPagoPatologo, showTodayPagoPatologoBySucursalTurno, updatePagoPatologo } from '../../../services/pago_patologo';
import myStyles from '../../../css';
import FormImprimirPagoPatologo from './FormImprimirPagoPatologo';

const ImprimirPagoPatologo = (props) => {

  const {
    setOpenAlert,
    setMessage,
    history,
  } = props;

  const {
		empleado,
		sucursal,
    patologo,
    colorBase,
	} = props.location.state;

  const token = empleado.access_token;

  const classes = myStyles(colorBase)();

  const [show, setShow] = useState(true);
  const [curaciones, setCuraciones] = useState([]);
  const [biopsias, setBiopsias] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [turno, setTurno] = useState('m');
  const [pagoPatologo, setPagoPatologo] = useState();
  const [corte, setCorte] = useState();

  const pagoPatologoTipoSalidaId = process.env.REACT_APP_TIPO_SALIDA_PAGO_PATOLOGO_ID;
  const efectivoMetodoPagoId = process.env.REACT_APP_FORMA_PAGO_EFECTIVO;

  const handleReturn = () => {
    history.goBack();
  }

  const loadCuraciones = async (hora_apertura, hora_cierre) => {
    const response = await findCuracionesByPayOfPatologoHoraAplicacion(sucursal._id, patologo._id, hora_apertura, hora_cierre ? hora_cierre : new Date(), token);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      const curaciones = response.data;
      curaciones.forEach(curacion => {
        setBiopsias([...biopsias, ...curacion.biopsias]);
      });
      setCuraciones(curaciones);
    }
  }

  const findPagoToday = async (hora_apertura, hora_cierre) => {
    const response = await showTodayPagoPatologoBySucursalTurno(patologo._id, sucursal._id, turno);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      const resPagoPatologo = response.data;
      setPagoPatologo(resPagoPatologo);
      if (resPagoPatologo) {
      } else {
      }
      await loadCuraciones(hora_apertura, hora_cierre);
      setIsLoading(false);
    }
  }

  const handleClickImprimir = (e) => {
    setShow(false);
    setTimeout(() => {
      window.print();
    }, 0);
    setTimeout(() => { setShow(true); }, 15);
  }

  const handleClickPagar = async () => {
    setIsLoading(true);
    let total = 0;

    // TOTAL DE LAS CURACION
    curaciones.forEach(async (curacion) => {
      const pagoPatologo = Number(curacion.costo_biopsias);
      curacion.pago_patologo = pagoPatologo;
      updateCuracion(curacion._id, curacion, token)
      total += Number(pagoPatologo);
    });

    const newPagoPatologo = {
      ...pagoPatologo,
      fecha_pago: new Date(),
      patologo: patologo,
      biopsias: biopsias,
      sucursal: sucursal._id,
      turno: turno,
      retencion: (patologo.pago_completo ? 0 : total),
      total: (patologo.pago_completo ? total : 0),
      pagado: true,
    }

    const response = await (newPagoPatologo._id ? updatePagoPatologo(newPagoPatologo._id, newPagoPatologo, token) : createPagoPatologo(newPagoPatologo, token));

    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK
      || `${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
      const data = newPagoPatologo._id ? newPagoPatologo : response.data;
      const responseSalida = await findSalidaByPagoDermatologoId(data._id);
      if (`${responseSalida.status}` === process.env.REACT_APP_RESPONSE_CODE_OK
        || `${responseSalida.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
        const resSalida = responseSalida.data;

        const salida = {
          ...resSalida,
          create_date: new Date(),
          hora_aplicacion: corte.create_date,
          tipo_salida: pagoPatologoTipoSalidaId,
          recepcionista: empleado,
          turno: corte.turno === 'm' ? 'MATUTINO' : 'VESPERTINO',
          concepto: patologo.nombre,
          cantidad: data.total,
          retencion: data.retencion,
          sucursal: sucursal._id,
          forma_pago: efectivoMetodoPagoId,
          pago_dermatologo: data._id
        }

        await (salida._id ? updateSalida(salida._id, salida, token) : createSalida(salida, token));

      }
    }

    findCorte(turno);
  };

  const handleObtenerInformacion = async (corte) => {
    await findPagoToday(corte.hora_apertura, corte.hora_cierre);
  };

  const handleCambioTurno = () => {
    setTurno(turno === 'm' ? 'v' : 'm');
  };

  const findCorte = async (turno) => {
    setIsLoading(true);
    const response = await showCorteTodayBySucursalAndTurno(sucursal._id, turno);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setCorte(response.data);
      handleObtenerInformacion(response.data);
    }
  }

  const turnoActual = async () => {
    const response = await findTurnoActualBySucursal(sucursal._id);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      const corte = response.data;
      setTurno(corte.turno);
      findCorte(corte.turno);
    }
  }

  useEffect(() => {
    turnoActual();
  }, []);

  return (
    <Fragment>
      {
        !isLoading ?
          <FormImprimirPagoPatologo
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            onReturn={handleReturn}
            patologo={patologo}
            sucursal={sucursal}
            corte={corte}
            curaciones={curaciones}
            turno={turno}
            pagoDermatologo={pagoPatologo}
            colorBase={colorBase}
            onClickImprimir={handleClickImprimir}
            onCambioTurno={() => handleCambioTurno()}
            onObtenerInformacion={() => handleObtenerInformacion()}
            findCorte={findCorte}
            onClickPagar={() => handleClickPagar()}
            show={show}
            empleado={empleado} /> :
          <Backdrop className={classes.backdrop} open={isLoading} >
            <CircularProgress color="inherit" />
          </Backdrop>
      }
    </Fragment>

  );
}

export default ImprimirPagoPatologo;