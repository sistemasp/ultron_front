import React, { useState, useEffect, Fragment } from 'react';
import { Backdrop, CircularProgress, makeStyles } from '@material-ui/core';
import {
  createSalida,
} from '../../../../services/salidas';
import { showCorteTodayBySucursalAndTurno } from '../../../../services/corte';
import {
  indCuracionesByPayOfDoctorHoraAplicacionPA,
  findCuracionesByPayOfPatologoHoraAplicacion,
  updateCuracion
} from '../../../../services/curaciones';
import ModalFormImprimirPagoPatologo from './ModalFormImprimirPagoPatologo';
import { createPagoPatologo, showTodayPagoPatologoBySucursalTurno } from '../../../../services/pago_patologo';
import myStyles from '../../../../css';
import FormReporteImprimirPagoPatologo from './FormReporteImprimirPagoPatologo';

const useStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const ReporteImprimirPagoPatologo = (props) => {

  const {
    open,
    onClose,
    patologo,
    sucursal,
    empleado,
    setOpenAlert,
    setMessage,
    colorBase,
  } = props;

  const classes = myStyles(colorBase)();

  const [show, setShow] = useState(true);
  const [curaciones, setCuraciones] = useState([]);
  const [biopsias, setBiopsias] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [turno, setTurno] = useState('m');
  const [pagoDermatologo, setPagoDermatologo] = useState();
  const [corte, setCorte] = useState();

  const pagoPatologoTipoSalidaId = process.env.REACT_APP_TIPO_SALIDA_PAGO_PATOLOGO_ID;
  const efectivoMetodoPagoId = process.env.REACT_APP_FORMA_PAGO_EFECTIVO;

  const loadCuraciones = async (hora_apertura, hora_cierre) => {
    const response = await findCuracionesByPayOfPatologoHoraAplicacion(sucursal._id, patologo._id, hora_apertura, hora_cierre ? hora_cierre : new Date(),  empleado.access_token);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      const curaciones = response.data;
      curaciones.forEach(curacion => {
        setBiopsias([...biopsias, ...curacion.biopsias]);
      });
      setCuraciones(curaciones);
    }
  }

  const loadCuracionesCPA = async (hora_apertura, hora_cierre) => {
    /*const response = await findCuracionesByPayOfDoctorHoraAplicacionPA(sucursal._id, patologo._id, canceladoCPId, hora_apertura, hora_cierre ? hora_cierre : new Date());
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setCuracionesPA(response.data);
    }*/
  }

  const findPagoToday = async (hora_apertura, hora_cierre) => {
    const response = await showTodayPagoPatologoBySucursalTurno(patologo._id, sucursal._id, turno);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      const pagoDermatologo = response.data;
      setPagoDermatologo(pagoDermatologo);
      if (pagoDermatologo) {
      } else {
      }
      await loadCuraciones(hora_apertura, hora_cierre);
      await loadCuracionesCPA(hora_apertura, hora_cierre);
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
      updateCuracion(curacion._id, curacion,  empleado.access_token)
      total += Number(pagoPatologo);
    });

    const pagoPatologo = {
      fecha_pago: new Date(),
      patologo: patologo,
      biopsias: biopsias,
      sucursal: sucursal._id,
      turno: turno,
      retencion: (patologo.pago_completo ? 0 : total),
      total: (patologo.pago_completo ? total : 0),
      pagado: true,
    }


    const response = await createPagoPatologo(pagoPatologo, empleado.access_token);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK
      || `${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
      const data = response.data;

      const salida = {
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
      }

      const resp = await createSalida(salida, empleado.access_token);
      if (`${resp.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
        setIsLoading(false);
      }
    }

    findCorte();
  };

  const handleObtenerInformacion = async (corte) => {
    await findPagoToday(corte.hora_apertura, corte.hora_cierre);
  };

  const handleCambioTurno = () => {
    setTurno(turno === 'm' ? 'v' : 'm');
  };

  const findCorte = async () => {
    const response = await showCorteTodayBySucursalAndTurno(sucursal._id, turno);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setCorte(response.data);
      handleObtenerInformacion(response.data);
    }
  }

  useEffect(() => {
    setIsLoading(true);
    findCorte();
  }, []);

  return (
    <Fragment>
      {
        !isLoading ?
          <FormReporteImprimirPagoPatologo
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={open}
            onClose={onClose}
            patologo={patologo}
            sucursal={sucursal}
            corte={corte}
            curaciones={curaciones}
            turno={turno}
            pagoDermatologo={pagoDermatologo}
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

export default ReporteImprimirPagoPatologo;