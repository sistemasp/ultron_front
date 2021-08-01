import React, { useState, useEffect, Fragment } from 'react';
import { Backdrop, CircularProgress, makeStyles } from '@material-ui/core';
import ModalFormImprimirPagoDermatologo from './ModalFormImprimirPagoDermatologo';
import {
  findConsultsByPayOfDoctorHoraAplicacion,
  findConsultsByPayOfDoctorHoraAplicacionFrecuencia,
  findConsultsByPayOfDoctorHoraAplicacionFrecuenciaPA,
  updateConsult,
} from '../../../../services/consultas';
import {
  createSalida,
} from '../../../../services/salidas';
import { showCorteTodayBySucursalAndTurno } from '../../../../services/corte';
import { findFacialesByPayOfDoctorHoraAplicacion, findFacialesByPayOfDoctorHoraAplicacionPA, updateFacial } from '../../../../services/faciales';
import { findAparatologiasByPayOfDoctorHoraAplicacion, findAparatologiasByPayOfDoctorHoraAplicacionPA, updateAparatologia } from '../../../../services/aparatolgia';
import { findCirugiasByPayOfDoctorHoraAplicacion, findCirugiasByPayOfDoctorHoraAplicacionPA, updateCirugia } from '../../../../services/cirugias';
import { findEsteticasByPayOfDoctorHoraAplicacion, findEsteticasByPayOfDoctorHoraAplicacionPA, updateEstetica } from '../../../../services/esteticas';
import { findDermapensByPayOfDoctorHoraAplicacion, findDermapensByPayOfDoctorHoraAplicacionPA, updateDermapen } from '../../../../services/dermapens';
import { createPagoDermatologo, showTodayPagoDermatologoBySucursalTurno } from '../../../../services/pago_dermatologos';
import { findSesionesAnticipadasByPayOfDoctorFechaPago, updateSesionAnticipada } from '../../../../services/sesiones_anticipadas';
import { findPagosAnticipadssByPayOfDoctorFechaPago } from '../../../../services/pagos_anticipados';
import { precioAreaBySucursal } from '../../../../utils/utils';

const useStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const ModalImprimirPagoDermatologo = (props) => {

  const classes = useStyles();

  const {
    open,
    onClose,
    dermatologo,
    sucursal,
    empleado,
    setOpenAlert,
    setMessage,
    colorBase,
  } = props;

  const token = empleado.access_token;

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
  const [turno, setTurno] = useState('m');
  const [pagoDermatologo, setPagoDermatologo] = useState();
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
    const response = await showTodayPagoDermatologoBySucursalTurno(dermatologo._id, sucursal._id, turno, token);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      const pagoDermatologo = response.data;
      setPagoDermatologo(pagoDermatologo);
      if (pagoDermatologo) {
        setConsultas(pagoDermatologo.consultas);
      } else {
        await loadConsultas(hora_apertura, hora_cierre);
      }
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

    // TOTAL DE LAS CONSULTAS 
    consultas.forEach(async (consulta) => {
      let totalPagos = 0;
      if (!consulta.has_descuento_dermatologo) {
        consulta.pagos.forEach(pago => {
          totalPagos += Number(pago.total);
        })
      }

      let pagoDermatologo = Number(totalPagos) * Number(consulta.frecuencia === reconsultaFrecuenciaId ? dermatologo.esquema.porcentaje_reconsulta : dermatologo.esquema.porcentaje_consulta) / 100;
      consulta.pago_dermatologo = pagoDermatologo;
      updateConsult(consulta._id, consulta, token);
      total += Number(pagoDermatologo);
    });


    // TOTAL DE LAS CIRUGíAS
    cirugias.forEach(async (cirugia) => {
      const pagoDermatologo = cirugia.has_descuento_dermatologo ? 0 : Number(cirugia.total_aplicacion) * Number(dermatologo.esquema.porcentaje_cirugias) / 100;
      cirugia.pago_dermatologo = pagoDermatologo;
      updateCirugia(cirugia._id, cirugia, token)
      total += Number(pagoDermatologo);
    });

    // TOTAL DERMAPENS
    dermapens.forEach(async (dermapen) => {
      const pagoDermatologo = dermapen.has_descuento_dermatologo ? 0 : Number(dermapen.total_aplicacion) * Number(dermatologo.esquema.porcentaje_dermocosmetica) / 100;
      dermapen.pago_dermatologo = pagoDermatologo;
      updateDermapen(dermapen._id, dermapen, token);
      total += Number(pagoDermatologo);
    });

    // TOTAL DE LOS FACIALES
    faciales.forEach(async (facial) => {
      let comisionDermatologo = 0;
      if (!facial.has_descuento_dermatologo) {
        facial.tratamientos.map(tratamiento => {
          let importe1 = 0;
          tratamiento.areasSeleccionadas.map(areaSeleccionada => {
            let comisionReal = 0;
            const itemPrecio = sucursal._id === sucursalManuelAcunaId ? areaSeleccionada.precio_ma
              : (sucursal._id === sucursalRubenDarioId ? areaSeleccionada.precio_rd
                : (sucursal._id === sucursalOcciId ? areaSeleccionada.precio_oc
                  : (sucursal._id === sucursalFedeId ? areaSeleccionada.precio_fe : '0')));

            importe1 += Number(itemPrecio);
            switch (facial.tipo_cita._id) {
              case revisadoTipoCitaId:
                comisionReal = sucursal._id === sucursalManuelAcunaId ? areaSeleccionada.comision_revisado_ma
                  : (sucursal._id === sucursalRubenDarioId ? areaSeleccionada.comision_revisado_rd
                    : areaSeleccionada.comision_revisado);
                break;
              case derivadoTipoCitaId:
                comisionReal = sucursal._id === sucursalManuelAcunaId ? areaSeleccionada.comision_derivado_ma
                  : (sucursal._id === sucursalRubenDarioId ? areaSeleccionada.comision_derivado_rd
                    : areaSeleccionada.comision_derivado);
                break;
              case realizadoTipoCitaId:
                comisionReal = sucursal._id === sucursalManuelAcunaId ? areaSeleccionada.comision_realizado_ma
                  : (sucursal._id === sucursalRubenDarioId ? areaSeleccionada.comision_realizado_rd
                    : areaSeleccionada.comision_realizado);
                break;
              case directoTipoCitaId: // TOMA EL 100%
                comisionReal = sucursal._id === sucursalManuelAcunaId ? areaSeleccionada.precio_ma
                  : (sucursal._id === sucursalRubenDarioId ? areaSeleccionada.precio_rd
                    : areaSeleccionada.precio_fe);
                break;
              case noAplicaTipoCitaId:
                comisionReal = 0;
                break;
            }
            const precioReal = (itemPrecio - (itemPrecio * (facial.porcentaje_descuento_clinica ? facial.porcentaje_descuento_clinica : 0) / 100));
            areaSeleccionada.comision_real = !facial.has_descuento_dermatologo ? comisionReal : 0;
            areaSeleccionada.precio_real = precioReal;
            comisionDermatologo += Number(comisionReal);
          });
          tratamiento.importe1 = importe1;
        });
      }
      const pagoDermatologo = comisionDermatologo - ((comisionDermatologo * facial.porcentaje_descuento_clinica ? facial.porcentaje_descuento_clinica : 0) / 100);
      facial.pago_dermatologo = pagoDermatologo;
      updateFacial(facial._id, facial, token);
      total += Number(pagoDermatologo);
    });

    // TOTAL DE LAS APARATOLOGIAS
    aparatologias.forEach(async (aparatologia) => {
      let comisionDermatologo = 0;
      if (!aparatologia.has_descuento_dermatologo) {
        aparatologia.tratamientos.forEach(tratamiento => {
          let importe1 = 0;
          tratamiento.areasSeleccionadas.map(area => {
            const itemPrecio =
              sucursal._id === sucursalManuelAcunaId ? area.precio_ma // PRECIO MANUEL ACUÑA
                : (sucursal._id === sucursalOcciId ? area.precio_oc // PRECIO OCCIDENTAL
                  : (sucursal._id === sucursalFedeId ? area.precio_fe // PRECIO FEDERALISMO
                    : (sucursal._id === sucursalRubenDarioId ? area.precio_rd // PRECIO RUBEN DARIO
                      : 0))); // ERROR
            importe1 += Number(itemPrecio);

            const precioReal = itemPrecio - ((itemPrecio * (aparatologia.porcentaje_descuento_clinica ? aparatologia.porcentaje_descuento_clinica : 0)) / 100);
            //const precioReal = (itemPrecio - (itemPrecio * (aparatologia.porcentaje_descuento_clinica ? aparatologia.porcentaje_descuento_clinica : 0 / 100))) *
            //(aparatologia.has_descuento_dermatologo ? (1 - ((aparatologia.frecuencia === primeraVezFrecuenciaId ? dermatologo.esquema.porcentaje_laser : 0) / 100)) : 1);
            const comisionReal = Number(precioReal) * Number(aparatologia.frecuencia === primeraVezFrecuenciaId ? dermatologo.esquema.porcentaje_laser : 0) / 100;
            comisionDermatologo += comisionReal;
            area.comision_real = aparatologia.has_descuento_dermatologo ? 0 : comisionReal;
            area.precio_real = precioReal;
          });
          tratamiento.importe1 = importe1;
        });
      }
      let pagoDermatologo = aparatologia.has_descuento_dermatologo ? 0 : comisionDermatologo;
      aparatologia.pago_dermatologo = pagoDermatologo;
      updateAparatologia(aparatologia._id, aparatologia, token);
      total += Number(pagoDermatologo);
    });

    // TOTAL DE LAS ESTÉTICAS
    esteticas.map(async (estetica) => {
      const pagoDermatologo = estetica.has_descuento_dermatologo ? 0 : Number(estetica.total_aplicacion) * Number(dermatologo.esquema.porcentaje_dermocosmetica) / 100;
      estetica.pago_dermatologo = pagoDermatologo;
      updateEstetica(estetica._id, estetica, token);
      total += Number(pagoDermatologo);
    });

    // TOTAL DE LOS PAGO ANTICIPADOS
    const sesionesAnticipadas = [];
    pagosAnticipados.forEach((pagoAnticipado) => {
      pagoAnticipado.sesiones_anticipadas.forEach((sesionAnticipada) => {
        sesionesAnticipadas.push(sesionAnticipada);
      });
    });

    sesionesAnticipadas.map((sesionAnticipada, index) => {
      let comisionDermatologo = 0;
      let pagoDermatologo = 0;
      if (!sesionAnticipada.has_descuento_dermatologo) {
        if (sesionAnticipada.servicio._id === servicioAparatologiaId && index === 0) {
          let importe1 = 0;
          sesionAnticipada.tratamientos.forEach(tratamiento => {

            tratamiento.areasSeleccionadas.map(area => {
              const itemPrecio = precioAreaBySucursal(sucursal._id, area);

              comisionDermatologo += (Number(itemPrecio) * Number(dermatologo.esquema.porcentaje_laser) / 100);
              importe1 += Number(itemPrecio);
            });
            tratamiento.importe1 = importe1;
          });
          pagoDermatologo = comisionDermatologo - ((comisionDermatologo * (sesionAnticipada.porcentaje_descuento_clinica ? sesionAnticipada.porcentaje_descuento_clinica : 0)) / 100);
        } else {
          sesionAnticipada.tratamientos.map(tratamiento => {
            let importe1 = 0;
            tratamiento.areasSeleccionadas.map(areaSeleccionada => {
              const itemPrecio = sucursal._id === sucursalManuelAcunaId ? areaSeleccionada.precio_ma
                : (sucursal._id === sucursalRubenDarioId ? areaSeleccionada.precio_rd
                  : (sucursal._id === sucursalOcciId ? areaSeleccionada.precio_oc
                    : (sucursal._id === sucursalFedeId ? areaSeleccionada.precio_fe : '0')));

              importe1 += Number(itemPrecio);

              switch (sesionAnticipada.tipo_cita._id) {
                case revisadoTipoCitaId:
                  comisionDermatologo += Number(
                    sucursal._id === sucursalManuelAcunaId ? areaSeleccionada.comision_revisado_ma
                      : (sucursal._id === sucursalRubenDarioId ? areaSeleccionada.comision_revisado_rd
                        : areaSeleccionada.comision_revisado)
                  );
                  break;
                case derivadoTipoCitaId:
                  comisionDermatologo += Number(
                    sucursal._id === sucursalManuelAcunaId ? areaSeleccionada.comision_derivado_ma
                      : (sucursal._id === sucursalRubenDarioId ? areaSeleccionada.comision_derivado_rd
                        : areaSeleccionada.comision_derivado)
                  );
                  break;
                case realizadoTipoCitaId:
                  comisionDermatologo += Number(
                    sucursal._id === sucursalManuelAcunaId ? areaSeleccionada.comision_realizado_ma
                      : (sucursal._id === sucursalRubenDarioId ? areaSeleccionada.comision_realizado_rd
                        : areaSeleccionada.comision_realizado)
                  );
                  break;
                case directoTipoCitaId: // TOMA EL 100%
                  comisionDermatologo += Number(
                    sucursal._id === sucursalManuelAcunaId ? areaSeleccionada.precio_ma
                      : (sucursal._id === sucursalRubenDarioId ? areaSeleccionada.precio_rd
                        : areaSeleccionada.precio_fe)
                  );
                  break;
                case noAplicaTipoCitaId:
                  comisionDermatologo += Number(0);
                  break;
              }
            });
            tratamiento.importe1 = importe1;
          });
          pagoDermatologo = comisionDermatologo - ((comisionDermatologo * (sesionAnticipada.porcentaje_descuento_clinica ? sesionAnticipada.porcentaje_descuento_clinica : 0)) / 100);
        }
        total += Number(pagoDermatologo);
      }
      updateSesionAnticipada(sesionAnticipada._id, sesionAnticipada, token);
    });

    if (dermatologo._id !== dermatologoDirectoId) {
      const pagoDermatologo = {
        fecha_pago: new Date(),
        dermatologo: dermatologo,
        consultas: consultas,
        cirugias: cirugias,
        faciales: faciales,
        dermapens: dermapens,
        aparatologias: aparatologias,
        esteticas: esteticas,
        sucursal: sucursal._id,
        turno: turno,
        retencion: (dermatologo.pago_completo ? 0 : (total / 2)),
        total: total,
        pagado: true,
      }

      const response = await createPagoDermatologo(pagoDermatologo, token);
      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK
        || `${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
        const data = response.data;

        const salida = {
          create_date: new Date(),
          hora_aplicacion: corte.create_date,
          tipo_salida: pagoDermatologoTipoSalidaId,
          recepcionista: empleado,
          turno: corte.turno === 'm' ? 'MATUTINO' : 'VESPERTINO',
          concepto: dermatologo.nombre,
          cantidad: dermatologo.pago_completo ? data.total : data.retencion,
          retencion: data.retencion,
          sucursal: sucursal._id,
          forma_pago: efectivoMetodoPagoId,
        }

        const resp = await createSalida(salida);
        if (`${resp.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
          setIsLoading(false);
        }
      }
    }
    findCorte();
  };

  const handleObtenerInformacion = async (corte) => {
    await findPagoToday(corte.hora_apertura, corte.hora_cierre, token);
  };

  const handleCambioTurno = () => {
    setTurno(turno === 'm' ? 'v' : 'm');
  };

  const findCorte = async () => {
    const response = await showCorteTodayBySucursalAndTurno(sucursal._id, turno, token);
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
          <ModalFormImprimirPagoDermatologo
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
            turno={turno}
            pagoDermatologo={pagoDermatologo}
            onClickImprimir={handleClickImprimir}
            onCambioTurno={() => handleCambioTurno()}
            onObtenerInformacion={() => handleObtenerInformacion()}
            findCorte={findCorte}
            onClickPagar={() => handleClickPagar()}
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

export default ModalImprimirPagoDermatologo;