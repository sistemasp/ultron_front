import React, { useState, useEffect, Fragment } from 'react';
import { Backdrop, CircularProgress, makeStyles } from '@material-ui/core';
import FormImprimirPagoDermatologo from './FormImprimirPagoDermatologo';
import {
  findConsultsByPayOfDoctorHoraAplicacion,
  findConsultsByPayOfDoctorHoraAplicacionFrecuencia,
  findConsultsByPayOfDoctorHoraAplicacionFrecuenciaPA,
  updateConsult,
} from '../../../services/consultas';
import {
  createSalida, findSalidaByPagoDermatologoId, updateSalida,
} from '../../../services/salidas';
import { findTurnoActualBySucursal, showCorteTodayBySucursalAndTurno } from '../../../services/corte';
import { findFacialesByPayOfDoctorHoraAplicacion, updateFacial } from '../../../services/faciales';
import { findAparatologiasByPayOfDoctorHoraAplicacion, updateAparatologia } from '../../../services/aparatolgia';
import { findCuracionesByPayOfDoctorHoraAplicacion, updateCuracion } from '../../../services/curaciones';
import { findEsteticasByPayOfDoctorHoraAplicacion, updateEstetica } from '../../../services/esteticas';
import { findDermapensByPayOfDoctorHoraAplicacion, updateDermapen } from '../../../services/dermapens';
import { createPagoDermatologo, showTodayPagoDermatologoBySucursalTurno, updatePagoDermatologo } from '../../../services/pago_dermatologos';
import { findSesionesAnticipadasByPayOfDoctorFechaPago, updateSesionAnticipada } from '../../../services/sesiones_anticipadas';
import { findPagosAnticipadssByPayOfDoctorFechaPago } from '../../../services/pagos_anticipados';
import { comisionAreaBySucursalAndTipo, precioAreaBySucursal } from '../../../utils/utils';

const useStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const ImprimirPagoDermatologo = (props) => {

  const classes = useStyles();

  const {
    setOpenAlert,
    setMessage,
    history,
  } = props;

  const {
    empleado,
    sucursal,
    dermatologo,
    colorBase,
  } = props.location.state;

  const token = empleado.access_token;

  const [show, setShow] = useState(true);
  const [consultas, setConsultas] = useState([]);
  const [consultasPrivada, setConsultasPrivada] = useState([]);
  const [consultasPrimeraVez, setConsultasPrimeraVez] = useState([]);
  const [consultasReconsultas, setConsultasReconsultas] = useState([]);
  const [curaciones, setCuraciones] = useState([]);
  const [faciales, setFaciales] = useState([]);
  const [dermapens, setDermapens] = useState([]);
  const [aparatologias, setAparatologias] = useState([]);
  const [esteticas, setEsteticas] = useState([]);
  const [pagosAnticipados, setPagosAnticipados] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [turno, setTurno] = useState('m');
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
  const tratamientoLuzpulzadaId = process.env.REACT_APP_LUZ_PULZADA_TRATAMIENTO_ID;

  const handleReturn = () => {
    history.goBack();
  }

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

  const loadCuraciones = async (hora_apertura, hora_cierre) => {
    const response = await findCuracionesByPayOfDoctorHoraAplicacion(sucursal._id, dermatologo._id, atendidoId, hora_apertura, hora_cierre ? hora_cierre : new Date(), token);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      const curaciones = response.data;
      curaciones.forEach((curacion) => {
        curacion.forma_pago_nombre = curacion.pagos.map((pago) => {
          return `${pago.forma_pago.nombre} `
        });
      });

      setCuraciones(curaciones);
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

  const loadEsteticas = async (hora_apertura, hora_cierre) => {
    const response = await findEsteticasByPayOfDoctorHoraAplicacion(sucursal._id, dermatologo._id, atendidoId, hora_apertura, hora_cierre ? hora_cierre : new Date(), token);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      const esteticas = response.data;
      esteticas.forEach((estetica) => {
        if (dermatologo._id === dermatologoDirectoId) {
          estetica.total_aplicacion = estetica.total;
        }
        estetica.producto_nombre = dermatologo._id === dermatologoDirectoId
          ? estetica.toxinas_rellenos.map((toxina_relleno) => {
            return `${toxina_relleno.nombre}`;
          })
          : estetica.producto.map((prod) => {
            return `${prod.nombre}`;
          });
        estetica.forma_pago_nombre = estetica.pagos.map((pago) => {
          return `${pago.forma_pago.nombre} `
        });
      });

      setEsteticas(esteticas);
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
      setPagoDermatologoObj(pagoDermatologo);
      await loadConsultas(hora_apertura, hora_cierre);
      await loadCuraciones(hora_apertura, hora_cierre);
      await loadFaciales(hora_apertura, hora_cierre);
      await loadDermapens(hora_apertura, hora_cierre);
      await loadAparatologias(hora_apertura, hora_cierre);
      await loadEsteticas(hora_apertura, hora_cierre);
      await loadConsultasPrivada(hora_apertura, hora_cierre);
      await loadConsultasPrimeraVez(hora_apertura, hora_cierre);
      await loadConsultasReconsulta(hora_apertura, hora_cierre);
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

  const isSesionAnticipada = (servicio) => {
    return servicio.forma_pago._id === formaPagoSesionAnticipadaId;
  }

  const handleClickPagar = async () => {
    setIsLoading(true);
    let total = 0;

    // TOTAL DE LAS CONSULTAS 
    consultas.forEach(async (consulta) => {
      let totalPagos = 0;
      if (isSesionAnticipada(consulta)) {
        consulta.pago_dermatologo = 0;
        updateConsult(consulta._id, consulta, token);
      } else {
        if (!consulta.has_descuento_dermatologo) {
          consulta.pagos.forEach(pago => {
            totalPagos += Number(pago.total);
          })
        }

        let pagoDermatologo = Number(totalPagos) * Number(
          consulta.frecuencia === reconsultaFrecuenciaId ? dermatologo.esquema.porcentaje_reconsulta
            : (consulta.frecuencia === privadaFrecuenciaId ? dermatologo.esquema.porcentaje_consulta_privada : dermatologo.esquema.porcentaje_consulta)) / 100;
        consulta.pago_dermatologo = pagoDermatologo;

        updateConsult(consulta._id, consulta, token);
        total += Number(pagoDermatologo);
      }
    });


    // TOTAL DE LAS CURACION
    curaciones.forEach(async (curacion) => {
      if (isSesionAnticipada(curacion)) {
        curacion.pago_dermatologo = 0;
        updateCuracion(curacion._id, curacion, token);
      } else {
        const pagoDermatologo = curacion.has_descuento_dermatologo ? 0 : Number(curacion.total_aplicacion) * Number(dermatologo.esquema.porcentaje_curaciones) / 100;
        curacion.pago_dermatologo = pagoDermatologo;
        updateCuracion(curacion._id, curacion, token);
        total += Number(pagoDermatologo);
      }

    });

    // TOTAL DERMAPENS
    dermapens.forEach(async (dermapen) => {
      if (isSesionAnticipada(dermapen)) {
        dermapen.pago_dermatologo = 0;
        updateDermapen(dermapen._id, dermapen, token);
      } else {
        const pagoDermatologo = dermapen.has_descuento_dermatologo ? 0 : Number(dermapen.total_aplicacion) * Number(dermatologo.esquema.porcentaje_dermocosmetica) / 100;
        dermapen.pago_dermatologo = pagoDermatologo;
        updateDermapen(dermapen._id, dermapen, token);
        total += Number(pagoDermatologo);
      }
    });

    // TOTAL DE LOS FACIALES
    faciales.forEach(async (facial) => {
      let comisionDermatologo = 0;
      if (isSesionAnticipada(facial)) {
        facial.pago_dermatologo = 0;
        updateFacial(facial._id, facial, token);
      } else {
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
      }

    });

    // TOTAL DE LAS APARATOLOGIAS
    aparatologias.forEach(async (aparatologia) => {
      let comisionDermatologo = 0;
      if (isSesionAnticipada(aparatologia)) {
        aparatologia.pago_dermatologo = 0;
        updateAparatologia(aparatologia._id, aparatologia, token);
      } else {
        if (!aparatologia.has_descuento_dermatologo) {
          aparatologia.tratamientos.forEach(tratamiento => {
            let importe1 = 0;
            tratamiento.areasSeleccionadas.map(area => {
              const itemPrecio = precioAreaBySucursal(sucursal._id, area);
              importe1 += Number(itemPrecio);

              const precioReal = itemPrecio - ((itemPrecio * (aparatologia.porcentaje_descuento_clinica ? aparatologia.porcentaje_descuento_clinica : 0)) / 100);
              //const precioReal = (itemPrecio - (itemPrecio * (aparatologia.porcentaje_descuento_clinica ? aparatologia.porcentaje_descuento_clinica : 0 / 100))) *
              //(aparatologia.has_descuento_dermatologo ? (1 - ((aparatologia.frecuencia === primeraVezFrecuenciaId ? dermatologo.esquema.porcentaje_laser : 0) / 100)) : 1);
              const comisionReal = Number(precioReal) * Number(aparatologia.frecuencia === primeraVezFrecuenciaId ? dermatologo.esquema.porcentaje_laser : 0) / 100;
              if (tratamiento._id === tratamientoLuzpulzadaId) {
                comisionDermatologo = comisionAreaBySucursalAndTipo(sucursal._id, aparatologia.tipo_cita._id, area);
              } else {
                comisionDermatologo += comisionReal;
              }
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
      }

    });

    // TOTAL DE LAS ESTÉTICAS
    esteticas.map(async (estetica) => {
      if (isSesionAnticipada(estetica)) {
        estetica.pago_dermatologo = 0;
        updateEstetica(estetica._id, estetica, token);
      } else {
        const pagoDermatologo = estetica.has_descuento_dermatologo ? 0 : Number(estetica.total_aplicacion) * Number(dermatologo.esquema.porcentaje_dermocosmetica) / 100;
        estetica.pago_dermatologo = pagoDermatologo;
        updateEstetica(estetica._id, estetica, token);
        total += Number(pagoDermatologo);
      }

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
              const precioReal = (itemPrecio - (itemPrecio * (sesionAnticipada.porcentaje_descuento_clinica ? sesionAnticipada.porcentaje_descuento_clinica : 0) / 100));
              areaSeleccionada.comision_real = !sesionAnticipada.has_descuento_dermatologo ? comisionDermatologo : 0;
              areaSeleccionada.precio_real = precioReal;
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
        ...pagoDermatologoObj,
        fecha_pago: new Date(),
        dermatologo: dermatologo,
        consultas: consultas,
        curaciones: curaciones,
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

      const response = await (pagoDermatologoObj._id ? updatePagoDermatologo(pagoDermatologoObj._id, pagoDermatologo, token) : createPagoDermatologo(pagoDermatologo, token));

      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK
        || `${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
        const data = pagoDermatologo._id ? pagoDermatologo : response.data;

        const responseSalida = await findSalidaByPagoDermatologoId(data._id);
        if (`${responseSalida.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
          const resSalida = responseSalida.data;

          const salida = {
            ...resSalida,
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
            pago_dermatologo: data._id,
          }

          const resp = await (resSalida._id ? updateSalida(resSalida._id, salida, token) : createSalida(salida, token));
          if (`${resp.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
            setIsLoading(false);
          }
        }
      }
    }

    findCorte(turno);
  };

  const handleObtenerInformacion = async (corte) => {
    await findPagoToday(corte.hora_apertura, corte.hora_cierre, token);
  };

  const handleCambioTurno = () => {
    setTurno(turno === 'm' ? 'v' : 'm');
  };

  const findCorte = async (turno) => {
    setIsLoading(true);
    const response = await showCorteTodayBySucursalAndTurno(sucursal._id, turno, token);
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
          <FormImprimirPagoDermatologo
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            onReturn={handleReturn}
            dermatologo={dermatologo}
            sucursal={sucursal}
            corte={corte}
            consultasPrivada={consultasPrivada}
            consultasPrimeraVez={consultasPrimeraVez}
            consultasReconsultas={consultasReconsultas}
            curaciones={curaciones}
            faciales={faciales}
            dermapens={dermapens}
            aparatologias={aparatologias}
            esteticas={esteticas}
            pagosAnticipados={pagosAnticipados}
            turno={turno}
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

export default ImprimirPagoDermatologo;