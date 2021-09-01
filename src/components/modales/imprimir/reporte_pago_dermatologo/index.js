import React, { useState, useEffect, Fragment } from 'react';
import { Backdrop, CircularProgress, makeStyles } from '@material-ui/core';
import FormReporteImprimirPagoDermatologo from './FormReporteImprimirPagoDermatologo';
import {
  findConsultsByPayOfDoctorHoraAplicacion,
  findConsultsByPayOfDoctorHoraAplicacionFrecuencia,
  findConsultsByPayOfDoctorHoraAplicacionFrecuenciaPA,
  updateConsult,
} from '../../../../services/consultas';
import {
  createSalida, findSalidaByPagoDermatologoId, updateSalida,
} from '../../../../services/salidas';
import { showCorteByDateSucursalAndTurno, showCorteTodayBySucursalAndTurno } from '../../../../services/corte';
import { findFacialesByPayOfDoctorHoraAplicacion, findFacialesByPayOfDoctorHoraAplicacionPA, updateFacial } from '../../../../services/faciales';
import { findAparatologiasByPayOfDoctorHoraAplicacion, findAparatologiasByPayOfDoctorHoraAplicacionPA, updateAparatologia } from '../../../../services/aparatolgia';
import { findCirugiasByPayOfDoctorHoraAplicacion, findCirugiasByPayOfDoctorHoraAplicacionPA, updateCirugia } from '../../../../services/cirugias';
import { findEsteticasByPayOfDoctorHoraAplicacion, findEsteticasByPayOfDoctorHoraAplicacionPA, updateEstetica } from '../../../../services/esteticas';
import { findDermapensByPayOfDoctorHoraAplicacion, findDermapensByPayOfDoctorHoraAplicacionPA, updateDermapen } from '../../../../services/dermapens';
import { createPagoDermatologo, showTodayPagoDermatologoBySucursalTurno, updatePagoDermatologo } from '../../../../services/pago_dermatologos';
import { findSesionesAnticipadasByPayOfDoctorFechaPago, updateSesionAnticipada } from '../../../../services/sesiones_anticipadas';
import { findPagosAnticipadssByPayOfDoctorFechaPago } from '../../../../services/pagos_anticipados';
import { precioAreaBySucursal } from '../../../../utils/utils';

const useStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const ReporteImprimirPagoDermatologo = (props) => {

  const classes = useStyles();

  const {
    open,
    onClose,
    empleado,
    setOpenAlert,
    setMessage,
    colorBase,
    datosImpresion,
  } = props;

  const token = empleado.access_token;
  const {
    dermatologo,
    sucursal,
    turno
  } = datosImpresion;

  const [show, setShow] = useState(true);
  const [consultas, setConsultas] = useState([]);
  const [consultasPrivada, setConsultasPrivada] = useState([]);
  const [consultasPrimeraVez, setConsultasPrimeraVez] = useState([]);
  const [consultasPrimeraVezPA, setConsultasPrimeraVezPA] = useState([]);
  const [consultasReconsultas, setConsultasReconsultas] = useState([]);
  const [consultasReconsultasPA, setConsultasReconsultasPA] = useState([]);
  const [cirugias, setCirugias] = useState([]);
  const [cirugiasPA, setCirugiasPA] = useState([]);
  const [faciales, setFaciales] = useState([]);
  const [facialesPA, setFacialesPA] = useState([]);
  const [dermapens, setDermapens] = useState([]);
  const [dermapensPA, setDermapensPA] = useState([]);
  const [aparatologias, setAparatologias] = useState([]);
  const [aparatologiasPA, setAparatologiasPA] = useState([]);
  const [esteticas, setEsteticas] = useState([]);
  const [esteticasPA, setEsteticasPA] = useState([]);
  // const [sesionesAnticipadas, setSesionesAnticipadas] = useState([]);
  const [pagosAnticipados, setPagosAnticipados] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagoDermatologoObj, setPagoDermatologoObj] = useState();
  const [corte, setCorte] = useState();

  const atendidoId = process.env.REACT_APP_ATENDIDO_STATUS_ID;
  const canceladoCPId = process.env.REACT_APP_CANCELO_CP_STATUS_ID;
  const primeraVezFrecuenciaId = process.env.REACT_APP_FRECUENCIA_PRIMERA_VEZ_ID;
  const reconsultaFrecuenciaId = process.env.REACT_APP_FRECUENCIA_RECONSULTA_ID;
  const privadaFrecuenciaId = process.env.REACT_APP_FRECUENCIA_PRIVADA_ID;
  const revisadoTipoCitaId = process.env.REACT_APP_TIPO_CITA_REVISADO_ID;
  const derivadoTipoCitaId = process.env.REACT_APP_TIPO_CITA_DERIVADO_ID;
  const realizadoTipoCitaId = process.env.REACT_APP_TIPO_CITA_REALIZADO_ID;
  const noAplicaTipoCitaId = process.env.REACT_APP_TIPO_CITA_NO_APLICA_ID;
  const directoTipoCitaId = process.env.REACT_APP_TIPO_CITA_DIRECTO_ID;
  const pagoDermatologoTipoSalidaId = process.env.REACT_APP_TIPO_SALIDA_PAGO_DERMATOLOGO_ID;
  const efectivoMetodoPagoId = process.env.REACT_APP_FORMA_PAGO_EFECTIVO;
  const sucursalManuelAcunaId = process.env.REACT_APP_SUCURSAL_MANUEL_ACUNA_ID;
  const sucursalRubenDarioId = process.env.REACT_APP_SUCURSAL_RUBEN_DARIO_ID;
  const sucursalOcciId = process.env.REACT_APP_SUCURSAL_OCCI_ID;
  const sucursalFedeId = process.env.REACT_APP_SUCURSAL_FEDE_ID;
  const dermatologoDirectoId = process.env.REACT_APP_DERMATOLOGO_DIRECTO_ID;
  const servicioAparatologiaId = process.env.REACT_APP_APARATOLOGIA_SERVICIO_ID;
  const formaPagoSesionAnticipadaId = process.env.REACT_APP_FORMA_PAGO_SESION_ANTICIPADA;

  const loadConsultas = async (hora_apertura, hora_cierre) => {
    const response = await findConsultsByPayOfDoctorHoraAplicacion(sucursal._id, dermatologo._id, atendidoId, hora_apertura, hora_cierre ? hora_cierre : new Date(), token);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      const consultas = response.data;
      consultas.forEach((consulta) => {
        consulta.forma_pago_nombre = consulta.pagos.map((pago) => {
          return `${pago.forma_pago.nombre} `
        });
      });

      setConsultas(consultas);
    }
  }
  const loadConsultasPrivada = async (hora_apertura, hora_cierre) => {
    const response = await findConsultsByPayOfDoctorHoraAplicacionFrecuencia(sucursal._id, dermatologo._id, atendidoId, hora_apertura, hora_cierre ? hora_cierre : new Date(), privadaFrecuenciaId, token);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      const consultas = response.data;
      consultas.forEach((consulta) => {
        consulta.forma_pago_nombre = consulta.pagos.map((pago) => {
          return `${pago.forma_pago.nombre} `
        });
      });

      setConsultasPrivada(consultas);
    }
  }

  const loadConsultasPrimeraVez = async (hora_apertura, hora_cierre) => {
    const response = await findConsultsByPayOfDoctorHoraAplicacionFrecuencia(sucursal._id, dermatologo._id, atendidoId, hora_apertura, hora_cierre ? hora_cierre : new Date(), primeraVezFrecuenciaId, token);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      const consultas = response.data;
      consultas.forEach((consulta) => {
        consulta.forma_pago_nombre = consulta.pagos.map((pago) => {
          return `${pago.forma_pago.nombre} `
        });
      });

      setConsultasPrimeraVez(consultas);
    }
  }

  const loadConsultasPrimeraVezPA = async (hora_apertura, hora_cierre) => {
    const response = await findConsultsByPayOfDoctorHoraAplicacionFrecuenciaPA(sucursal._id, dermatologo._id, canceladoCPId, hora_apertura, hora_cierre ? hora_cierre : new Date(), primeraVezFrecuenciaId, token);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      const consultas = response.data;
      consultas.forEach((consulta) => {
        consulta.forma_pago_nombre = consulta.pagos.map((pago) => {
          return `${pago.forma_pago.nombre} `
        });
      });

      setConsultasPrimeraVezPA(consultas);
    }
  }

  const loadConsultasReconsulta = async (hora_apertura, hora_cierre) => {
    const response = await findConsultsByPayOfDoctorHoraAplicacionFrecuencia(sucursal._id, dermatologo._id, atendidoId, hora_apertura, hora_cierre ? hora_cierre : new Date(), reconsultaFrecuenciaId, token);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      const consultas = response.data;
      consultas.forEach((consulta) => {
        consulta.forma_pago_nombre = consulta.pagos.map((pago) => {
          return `${pago.forma_pago.nombre} `
        });
      });

      const newReconsultas = consultas.filter(reconsulta => {
        let total = 0;
        reconsulta.pagos.forEach(pago => {
          total += Number(pago.total);
        });
        return true;
      });
      setConsultasReconsultas(newReconsultas);
    }
  }

  const loadConsultasReconsultaPA = async (hora_apertura, hora_cierre) => {
    const response = await findConsultsByPayOfDoctorHoraAplicacionFrecuenciaPA(sucursal._id, dermatologo._id, canceladoCPId, hora_apertura, hora_cierre ? hora_cierre : new Date(), reconsultaFrecuenciaId, token);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      const consultas = response.data;
      consultas.forEach((consulta) => {
        consulta.forma_pago_nombre = consulta.pagos.map((pago) => {
          return `${pago.forma_pago.nombre} `
        });
      });

      const newReconsultas = consultas.filter(reconsulta => {
        let total = 0;
        reconsulta.pagos.forEach(pago => {
          total += Number(pago.total);
        });
        return true;
      });
      setConsultasReconsultasPA(newReconsultas);
    }
  }

  const loadCirugias = async (hora_apertura, hora_cierre) => {
    const response = await findCirugiasByPayOfDoctorHoraAplicacion(sucursal._id, dermatologo._id, atendidoId, hora_apertura, hora_cierre ? hora_cierre : new Date(), token);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      const cirugias = response.data;
      cirugias.forEach((cirugia) => {
        cirugia.forma_pago_nombre = cirugia.pagos.map((pago) => {
          return `${pago.forma_pago.nombre} `
        });
      });

      setCirugias(cirugias);
    }
  }

  const loadCirugiasCPA = async (hora_apertura, hora_cierre) => {
    const response = await findCirugiasByPayOfDoctorHoraAplicacionPA(sucursal._id, dermatologo._id, canceladoCPId, hora_apertura, hora_cierre ? hora_cierre : new Date(), token);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      const cirugias = response.data;
      cirugias.forEach((cirugia) => {
        cirugia.forma_pago_nombre = cirugia.pagos.map((pago) => {
          return `${pago.forma_pago.nombre} `
        });
      });

      setCirugiasPA(cirugias);
    }
  }

  const loadFaciales = async (hora_apertura, hora_cierre) => {
    const response = await findFacialesByPayOfDoctorHoraAplicacion(sucursal._id, dermatologo._id, atendidoId, hora_apertura, hora_cierre ? hora_cierre : new Date(), token);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      const faciales = response.data;
      faciales.forEach(item => {
        item.forma_pago_nombre = item.pagos.map((pago) => {
          return `${pago.forma_pago.nombre} `
        });
        item.show_tratamientos = item.tratamientos.map(tratamiento => {
          const show_areas = tratamiento.areasSeleccionadas.map(area => {
            return `${area.nombre}`;
          });
          return `►${tratamiento.nombre}(${show_areas}) `;
        });
      });
      setFaciales(faciales);
    }
  }

  const loadFacialesCPA = async (hora_apertura, hora_cierre) => {
    const response = await findFacialesByPayOfDoctorHoraAplicacionPA(sucursal._id, dermatologo._id, canceladoCPId, hora_apertura, hora_cierre ? hora_cierre : new Date(), token);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setFacialesPA(response.data);
    }
  }

  const loadDermapens = async (hora_apertura, hora_cierre) => {
    const response = await findDermapensByPayOfDoctorHoraAplicacion(sucursal._id, dermatologo._id, atendidoId, hora_apertura, hora_cierre ? hora_cierre : new Date(), token);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      const dermapens = response.data;
      dermapens.forEach((dermapen) => {
        dermapen.forma_pago_nombre = dermapen.pagos.map((pago) => {
          return `${pago.forma_pago.nombre} `
        });
      });

      setDermapens(dermapens);
    }
  }

  const loadDermapensCPA = async (hora_apertura, hora_cierre) => {
    const response = await findDermapensByPayOfDoctorHoraAplicacionPA(sucursal._id, dermatologo._id, canceladoCPId, hora_apertura, hora_cierre ? hora_cierre : new Date(), token);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setDermapensPA(response.data);
    }
  }

  const loadAparatologias = async (hora_apertura, hora_cierre) => {
    const response = await findAparatologiasByPayOfDoctorHoraAplicacion(sucursal._id, dermatologo._id, atendidoId, hora_apertura, hora_cierre ? hora_cierre : new Date(), token);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      response.data.forEach(item => {
        item.forma_pago_nombre = item.pagos.map((pago) => {
          return `${pago.forma_pago.nombre} `
        });
        item.show_tratamientos = item.tratamientos.map(tratamiento => {
          const show_areas = tratamiento.areasSeleccionadas.map(area => {
            return `${area.nombre}`;
          });
          return `►${tratamiento.nombre}(${show_areas}) `;
        });
      });
      setAparatologias(response.data);
    }
  }

  const loadAparatologiasCPA = async (hora_apertura, hora_cierre) => {
    const response = await findAparatologiasByPayOfDoctorHoraAplicacionPA(sucursal._id, dermatologo._id, canceladoCPId, hora_apertura, hora_cierre ? hora_cierre : new Date(), token);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setAparatologiasPA(response.data);
    }
  }

  const loadEsteticas = async (hora_apertura, hora_cierre) => {
    const response = await findEsteticasByPayOfDoctorHoraAplicacion(sucursal._id, dermatologo._id, atendidoId, hora_apertura, hora_cierre ? hora_cierre : new Date(), token);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      const esteticas = response.data;
      esteticas.forEach((estetica) => {
        if (dermatologo._id === dermatologoDirectoId) {
          estetica.total_aplicacion = estetica.total;
        }
        estetica.producto_nombre = estetica.producto.map((prod) => {
          return `${prod.nombre}`;
        });
        estetica.forma_pago_nombre = estetica.pagos.map((pago) => {
          return `${pago.forma_pago.nombre} `
        });
      });

      setEsteticas(esteticas);
    }
  }

  const loadEsteticasPA = async (hora_apertura, hora_cierre) => {
    const response = await findEsteticasByPayOfDoctorHoraAplicacionPA(sucursal._id, dermatologo._id, canceladoCPId, hora_apertura, hora_cierre ? hora_cierre : new Date(), token);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setEsteticasPA(response.data);
    }
  }

  const loadSesionesAnticipadas = async (hora_apertura, hora_cierre) => {
    const response = await findSesionesAnticipadasByPayOfDoctorFechaPago(sucursal._id, dermatologo._id, hora_apertura, hora_cierre ? hora_cierre : new Date(), token);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      response.data.forEach(item => {
        item.show_tratamientos = item.tratamientos.map(tratamiento => {
          const show_areas = tratamiento.areasSeleccionadas.map(area => {
            return `${area.nombre}`;
          });
          return `►${tratamiento.nombre}(${show_areas}) `;
        });
      });
      // setSesionesAnticipadas(response.data);
    }
  }

  const loadPagosAnticipados = async (hora_apertura, hora_cierre) => {
    const response = await findPagosAnticipadssByPayOfDoctorFechaPago(sucursal._id, dermatologo._id, hora_apertura, hora_cierre ? hora_cierre : new Date(), token);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      response.data.map((pagoAnticipado) => {
        pagoAnticipado.forma_pago_nombre = pagoAnticipado.pagos.map((pago) => {
          return `${pago.forma_pago.nombre} `
        });
        pagoAnticipado.sesiones_anticipadas.forEach(item => {
          item.forma_pago_nombre = pagoAnticipado.forma_pago_nombre;
          item.show_tratamientos = item.tratamientos.map(tratamiento => {
            const show_areas = tratamiento.areasSeleccionadas.map(area => {
              return `${area.nombre}`;
            });
            return `►${tratamiento.nombre}(${show_areas}) `;
          });
        });
      });

      setPagosAnticipados(response.data);
    }
  }

  const findPagoToday = async (hora_apertura, hora_cierre) => {
    console.log("KAOZ", dermatologo);

    await loadConsultas(hora_apertura, hora_cierre);
    await loadCirugias(hora_apertura, hora_cierre);
    // await loadCirugiasCPA(hora_apertura, hora_cierre);
    await loadFaciales(hora_apertura, hora_cierre);
    // await loadFacialesCPA(hora_apertura, hora_cierre);
    await loadDermapens(hora_apertura, hora_cierre);
    // await loadDermapensCPA(hora_apertura, hora_cierre);
    await loadAparatologias(hora_apertura, hora_cierre);
    // await loadAparatologiasCPA(hora_apertura, hora_cierre);
    await loadEsteticas(hora_apertura, hora_cierre);
    // await loadEsteticasPA(hora_apertura, hora_cierre);
    await loadConsultasPrivada(hora_apertura, hora_cierre);
    await loadConsultasPrimeraVez(hora_apertura, hora_cierre);
    // await loadConsultasPrimeraVezPA(hora_apertura, hora_cierre);
    await loadConsultasReconsulta(hora_apertura, hora_cierre);
    // await loadConsultasReconsultaPA(hora_apertura, hora_cierre);
    // await loadSesionesAnticipadas(hora_apertura, hora_cierre);
    await loadPagosAnticipados(hora_apertura, hora_cierre);
    setIsLoading(false);
  }

  const handleClickImprimir = (e) => {
    setShow(false);
    setTimeout(() => {
      window.print();
    }, 0);
    setTimeout(() => { setShow(true); }, 15);
  }

  const isSesionAnticipada = (servicio) => {
    return servicio.forma_pago._id === formaPagoSesionAnticipadaId;
  }

  const handleObtenerInformacion = async (corte) => {
    await findPagoToday(corte.hora_apertura, corte.hora_cierre, token);
  };

  const findCorte = async () => {
    const date = new Date(datosImpresion.fecha_pago);

    const response = await showCorteByDateSucursalAndTurno(sucursal._id, date.getFullYear(), date.getMonth(), date.getDate(), turno, token);
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
          <FormReporteImprimirPagoDermatologo
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={open}
            onClose={onClose}
            dermatologo={dermatologo}
            sucursal={sucursal}
            corte={corte}
            consultasPrivada={consultasPrivada}
            consultasPrimeraVez={consultasPrimeraVez}
            consultasPrimeraVezPA={consultasPrimeraVezPA}
            consultasReconsultas={consultasReconsultas}
            consultasReconsultasPA={consultasReconsultasPA}
            cirugias={cirugias}
            cirugiasPA={cirugiasPA}
            faciales={faciales}
            facialesPA={facialesPA}
            dermapens={dermapens}
            dermapensPA={dermapensPA}
            aparatologias={aparatologias}
            aparatologiasPA={aparatologiasPA}
            esteticas={esteticas}
            esteticasPA={esteticasPA}
            pagosAnticipados={pagosAnticipados}
            datosImpresion={datosImpresion}
            turno={turno}
            onClickImprimir={handleClickImprimir}
            onObtenerInformacion={() => handleObtenerInformacion()}
            findCorte={findCorte}
            show={show}
            colorBase={colorBase}
            empleado={empleado} /> :
          <Backdrop className={classes.backdrop} open={isLoading} >
            <CircularProgress color="inherit" />
          </Backdrop>
      }
    </Fragment>

  );
}

export default ReporteImprimirPagoDermatologo;