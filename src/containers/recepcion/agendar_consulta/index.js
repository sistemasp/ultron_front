import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { AgendarConsultaContainer } from "./agendar_consulta";
import {
	showAllTipoCitas,
	showAllMedios,
	showAllFrecuencias,
	findScheduleByDateAndSucursalAndService,
	showAllMetodoPago,
} from "../../../services";
import {
	createConsult,
	findConsultsByDateAndSucursal,
	updateConsult
} from "../../../services/consultas";
import {
	findCuracionByConsultaId,
} from "../../../services/curaciones";
import {
	findEsteticaByConsultaId,
} from "../../../services/esteticas";
import { Backdrop, CircularProgress, FormControl, InputLabel, MenuItem, Select, Snackbar, TablePagination } from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';
import EditIcon from '@material-ui/icons/Edit';
import { toFormatterCurrency, addZero, generateFolio, dateToString } from "../../../utils/utils";
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import PrintIcon from '@material-ui/icons/Print';
import LocalHospitalIcon from '@material-ui/icons/LocalHospital';
import FaceIcon from '@material-ui/icons/Face';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';
import { findProductoByServicio } from "../../../services/productos";
import { findEmployeesByRolIdAvailable } from "../../../services/empleados";
import { createFactura } from "../../../services/facturas";
import {
	findConsecutivoBySucursal,
	createConsecutivo,
} from "../../../services/consecutivos";
import { updateSesionAnticipada } from "../../../services/sesiones_anticipadas";
import { createEntrada, updateEntrada } from "../../../services/entradas";
import { createPago } from "../../../services/pagos";
import { findTurnoActualBySucursal } from "../../../services/corte";
import {
	frecuenciaPrimeraVezObj,
	productoConsultaObj,
	rolRecepcionistaId
} from "../../../utils/constants";

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles(theme => ({
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: '#fff',
	},
	pagago: {
		color: '#11A532',
	},
	no_pagago: {
		color: '#DC3132',
	},
}));

const AgendarConsulta = (props) => {

	const classes = useStyles();

	const {
		paciente,
		empleado,
		setPacienteAgendado,
		sucursal,
		history,
		onClickAgendarCuracion,
		onClickAgendarEstetica,
		onClickAgendarDermapen,
		onClickAgendarFaciales,
		onClickAgendarAparatologia,
		colorBase,
		turno,
	} = props;

	const token = empleado.access_token;

	const dermatologoRolId = process.env.REACT_APP_DERMATOLOGO_ROL_ID;
	const promovendedorRolId = process.env.REACT_APP_PROMOVENDEDOR_ROL_ID;
	const pendienteStatusId = process.env.REACT_APP_PENDIENTE_STATUS_ID;
	const asistioStatusId = process.env.REACT_APP_ASISTIO_STATUS_ID;
	const confirmadoStatusId = process.env.REACT_APP_CONFIRMADO_STATUS_ID;
	const enProcedimientoStatusId = process.env.REACT_APP_EN_PROCEDIMIENTO_STATUS_ID;
	const enConsultorioStatusId = process.env.REACT_APP_EN_CONSULTORIO_STATUS_ID;
	const enCabinaStatusId = process.env.REACT_APP_EN_CABINA_STATUS_ID;
	const atendidoStatusId = process.env.REACT_APP_ATENDIDO_STATUS_ID;
	const noAsistioStatusId = process.env.REACT_APP_NO_ASISTIO_STATUS_ID;
	const reagendoStatusId = process.env.REACT_APP_REAGENDO_STATUS_ID;
	const canceladoCPStatusId = process.env.REACT_APP_CANCELO_CP_STATUS_ID;
	const canceladoSPStatusId = process.env.REACT_APP_CANCELO_SP_STATUS_ID;
	const consultaServicioId = process.env.REACT_APP_CONSULTA_SERVICIO_ID;
	const sucursalManuelAcunaId = process.env.REACT_APP_SUCURSAL_MANUEL_ACUNA_ID;
	const sucursalRubenDarioId = process.env.REACT_APP_SUCURSAL_RUBEN_DARIO_ID;
	const dermatologoDirectoId = process.env.REACT_APP_DERMATOLOGO_DIRECTO_ID;
	const promovendedorSinPromovendedorId = process.env.REACT_APP_PROMOVENDEDOR_SIN_PROMOVENDEDOR_ID;
	const frecuenciaPrimeraVezId = process.env.REACT_APP_FRECUENCIA_PRIMERA_VEZ_ID;
	const frecuenciaReconsultaId = process.env.REACT_APP_FRECUENCIA_RECONSULTA_ID;
	const tipoCitaRevisionId = process.env.REACT_APP_TIPO_CITA_REVISADO_ID;
	const tipoCitaDerivadaId = process.env.REACT_APP_TIPO_CITA_DERIVADO_ID;
	const medioSinCitaId = process.env.REACT_APP_MEDIO_SIN_CITA_ID;
	const productoConsultaId = process.env.REACT_APP_PRODUCTO_CONSULTA_ID;
	const efectivoFormaPagoId = process.env.REACT_APP_FORMA_PAGO_EFECTIVO;
	const tarjetaFormaPagoId = process.env.REACT_APP_FORMA_PAGO_TARJETA;
	const noPagaFormaPagoId = process.env.REACT_APP_FORMA_PAGO_NO_PAGA;
	const sesionAnticipadaFormaPagoId = process.env.REACT_APP_FORMA_PAGO_SESION_ANTICIPADA;
	const fisicoMedioId = process.env.REACT_APP_MEDIO_FISICO_ID;
	const sucursalOccidentalId = process.env.REACT_APP_SUCURSAL_OCCI_ID;
	const sucursalFederalismoId = process.env.REACT_APP_SUCURSAL_FEDE_ID;
	const tipoEntradaConsultaId = process.env.REACT_APP_TIPO_ENTRADA_CONSULTA_ID;
	const servicioConsultaId = process.env.REACT_APP_CONSULTA_SERVICIO_ID;
	const tratamientoConsultaId = process.env.REACT_APP_CONSULTA_TRATAMIENTO_ID;

	const date = new Date();

	const getPrecio = () => {
		return isHoliDay ? sucursal.precio_festivo : // DÍA FESTIVO
			date.getDay() === 6 ? (date.getHours() >= 13 ? sucursal.precio_sabado_vespertino : sucursal.precio_sabado_matutino) // SABADO
				: (date.getHours() >= 14 ? sucursal.precio_vespertino : sucursal.precio_matutino) // L-V
	}

	const [openAlert, setOpenAlert] = useState(false);
	const [message, setMessage] = useState('');
	const [severity, setSeverity] = useState('success');
	const [horarios, setHorarios] = useState([]);
	const [recepcionistas, setRecepcionistas] = useState([]);
	const [dermatologos, setDermatologos] = useState([]);
	const [frecuencias, setFrecuencias] = useState([]);
	const [productos, setProductos] = useState([]);
	const [tipoCitas, setTipoCitas] = useState([]);
	const [medios, setMedios] = useState([]);
	const [promovendedores, setPromovendedores] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [disableDate, setDisableDate] = useState(true);
	const [isHoliDay, setIsHoliDay] = useState(false);
	const [cambioTurno, setCambioTurno] = useState(false);
	const [values, setValues] = useState({
		hora: '',
		fecha_hora: new Date(),
		producto: productoConsultaObj,
		paciente: `${paciente._id}`,
		precio: getPrecio(),
		porcentaje_descuento_clinica: 0,
		descuento_clinica: 0,
		descuento_dermatologo: 0,
		frecuencia: frecuenciaPrimeraVezObj,
		forma_pago: efectivoFormaPagoId,
		promovendedor: promovendedorSinPromovendedorId,
		dermatologo: dermatologoDirectoId,
		medio: fisicoMedioId,
	});

	const [consultas, setConsultas] = useState([]);
	const [formasPago, setFormasPago] = useState([]);
	const [openModal, setOpenModal] = useState(false);
	const [openModalProxima, setOpenModalProxima] = useState(false);
	const [openModalPagos, setOpenModalPagos] = useState(false);
	const [openModalCuraciones, setOpenModalCuraciones] = useState(false);
	const [openModalTraspaso, setOpenModalTraspaso] = useState(false);
	const [openModalEstetica, setOpenModalEstetica] = useState(false);
	const [consulta, setConsulta] = useState();
	const [openModalImprimirConsultas, setOpenModalImprimirConsultas] = useState(false);
	const [datosImpresion, setDatosImpresion] = useState();
	const [curacion, setCuracion] = useState({
		materiales: []
	});
	const [estetica, setEstetica] = useState({
		materiales: []
	});

	const dia = addZero(date.getDate());
	const mes = addZero(date.getMonth() + 1);
	const anio = date.getFullYear();

	const [filterDate, setFilterDate] = useState({
		fecha_show: date,
		fecha: `${dia}/${mes}/${anio}`,
	});

	const columns = [
		{ title: 'FOLIO', field: 'consecutivo' },
		{ title: 'TURNO', field: 'turno' },
		{ title: 'HORA', field: 'hora' },
		{ title: 'PACIENTE', field: 'paciente_nombre' },
		{ title: 'TELÉFONO', field: 'paciente.telefono' },
		{ title: 'PRODUCTO', field: 'show_tratamientos' },
		{ title: 'OBSERVACIONES', field: 'observaciones' },
		{ title: 'QUIÉN AGENDA', field: 'quien_agenda.nombre' },
		{ title: 'FRECUENCIA', field: 'frecuencia.nombre' },
		{ title: 'TIPO', field: 'tipo_cita.nombre' },
		{ title: 'DERMATÓLOGO (A)', field: 'dermatologo_nombre' },
		{ title: 'PROMOVENDEDOR (A)', field: 'promovendedor_nombre' },
		{ title: 'STATUS', field: 'status.nombre' },
		{ title: 'PRECIO', field: 'precio_moneda' },
		{ title: 'TOTAL', field: 'total_moneda' },
		{ title: 'FORMA DE PAGO', field: 'forma_pago_show' },
		{ title: 'HORA LLEGADA', field: 'hora_llegada' },
		{ title: 'HORA ATENDIDO', field: 'hora_atencion' },
		{ title: 'HORA SALIDA', field: 'hora_salida' },
	];

	const dataComplete = !paciente.nombres || !values.precio || !values.dermatologo
		|| !values.promovendedor || (sucursal._id === sucursalManuelAcunaId ? (!values.fecha_hora || !values.medio) : false)
		|| (sucursal._id === sucursalRubenDarioId ? (!values.fecha_hora || !values.medio) : false);

	const options = {
		rowStyle: rowData => {
			return {
				color: rowData.status.color,
				backgroundColor: rowData.pagado ? process.env.REACT_APP_PAGADO_COLOR : ''
			};
		},
		headerStyle: {
			backgroundColor: colorBase,
			color: '#FFF',
			fontWeight: 'bolder',
			fontSize: '18px'
		},
		cellStyle: {
			fontWeight: 'bolder',
			fontSize: '16px',
			padding: '5px',
			textAlign: 'center',
		},
		paging: false,
	}

	const loadHorarios = async (date) => {
		const dia = date ? date.getDate() : values.fecha_show.getDate();
		const mes = Number(date ? date.getMonth() : values.fecha_show.getMonth());
		const anio = date ? date.getFullYear() : values.fecha_show.getFullYear();
		const response = await findScheduleByDateAndSucursalAndService(dia, mes, anio, sucursal._id, consultaServicioId);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			setHorarios(response.data);
		}
	}

	const handleChangeFecha = async (date) => {
		setIsLoading(true);
		await setValues({
			...values,
			fecha_hora: date,
		});
		await loadHorarios(date);
		await handleChangeFilterDate(date);
		setIsLoading(false);
	};

	const handleChangeHora = e => {
		setIsLoading(true);
		const hora = (e.target.value).split(':');
		const date = values.fecha_hora;
		date.setHours(Number(hora[0]));
		date.setMinutes(hora[1]);
		date.setSeconds(0);
		setValues({
			...values,
			hora: e.target.value,
			fecha_hora: date
		});
		setIsLoading(false);
	};

	const handleChangeFilterDate = async (date) => {
		setIsLoading(true);
		const dia = addZero(date.getDate());
		const mes = addZero(date.getMonth() + 1);
		const anio = date.getFullYear();
		setFilterDate({
			fecha_show: date,
			fecha: `${dia}/${mes}/${anio}`
		});
		await loadConsultas(date);
		setIsLoading(false);
	};

	const loadConsultas = async (filterDate) => {
		const response = await findConsultsByDateAndSucursal(filterDate.getDate(), filterDate.getMonth(), filterDate.getFullYear(), sucursal._id, token);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			response.data.forEach(item => {
				const fecha = new Date(item.fecha_hora);
				item.folio = generateFolio(item);
				item.hora = `${addZero(fecha.getHours())}:${addZero(fecha.getMinutes())}`;
				item.precio_moneda = toFormatterCurrency(item.precio);
				item.total_moneda = toFormatterCurrency(item.total);
				item.paciente_nombre = `${item.paciente.nombres} ${item.paciente.apellidos}`;
				item.promovendedor_nombre = item.promovendedor ? item.promovendedor.nombre : 'SIN ASIGNAR';
				item.dermatologo_nombre = item.dermatologo ? item.dermatologo.nombre : 'DIRECTO';
				item.show_tratamientos = item.producto.nombre;
				item.forma_pago_show = `${item.forma_pago.nombre}${item.factura ? ' (FACTURA)' : ''}`;
			});
			setConsultas(response.data);
		}
	}

	const getTimeToTratamiento = (tratamientos) => {
		tratamientos.sort((a, b) => {
			if (a.tiempo < b.tiempo) return 1;
			if (a.tiempo > b.tiempo) return -1;
			return 0;
		});
		let tiempo = 0;
		tratamientos.forEach((item, index) => {
			tiempo += Number(index === 0 ? item.tiempo : (item.tiempo - (item.servicio !== 'APARATOLOGÍA' ? 20 : 0)));
		});
		return tiempo;
	}

	const handleChangeTipoCita = (e) => {
		setValues({ ...values, tipo_cita: e.target.value });
	}

	const handleChangeMedio = (e) => {
		setValues({ ...values, medio: e.target.value });
	}

	const handleChangeProductos = (e, newValue) => {
		setValues({
			...values,
			producto: newValue,
			forma_pago: newValue && newValue._id === productoConsultaId ? efectivoFormaPagoId : noPagaFormaPagoId,
			precio: newValue && newValue._id === productoConsultaId ? getPrecio() : '0',
			porcentaje_descuento_clinica: newValue && newValue._id === productoConsultaId ? '0' : '100',
			descuento_clinica: newValue && newValue._id === productoConsultaId ? 0 : getPrecio(),
		});
	}

	const handleClickAgendar = async (data) => {
		setIsLoading(true);
		const create_date = new Date();
		data.quien_agenda = empleado._id;
		data.sucursal = sucursal._id;
		data.status = pendienteStatusId;
		data.hora_llegada = '--:--';
		data.hora_atencion = '--:--';
		data.hora_salida = '--:--';
		data.total = data.precio;
		data.servicio = consultaServicioId;
		data.tipo_cita = data.frecuencia._id === frecuenciaPrimeraVezId ? tipoCitaRevisionId : tipoCitaDerivadaId;
		if (sucursal._id === sucursalOccidentalId || sucursal._id === sucursalFederalismoId) {
			const fecha_hora = new Date();
			fecha_hora.setMinutes(0);
			fecha_hora.setSeconds(0);
			data.hora_llegada = `${addZero(create_date.getHours())}:${addZero(create_date.getMinutes())}`;
			data.fecha_hora = fecha_hora;
			data.status = asistioStatusId;
			data.hora_aplicacion = create_date;
			// data.quien_confirma_asistencia = empleado._id;
		}

		const response = await createConsult(data, token);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
			const resConsult = response.data;
			if (sucursal._id === sucursalOccidentalId || sucursal._id === sucursalFederalismoId && data.forma_pago !== tarjetaFormaPagoId) {
				const entrada = {
					create_date: create_date,
					hora_aplicacion: create_date,
					recepcionista: empleado._id,
					concepto: `PACIENTE: ${paciente.nombres} ${paciente.apellidos}`,
					cantidad: data.precio,
					tipo_entrada: tipoEntradaConsultaId,
					sucursal: sucursal,
					forma_pago: data.forma_pago,
					pago_anticipado: false,
				};

				const entradaResponse = await createEntrada(entrada, token);
				if (`${entradaResponse.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
					const resEntrada = entradaResponse.data;
					const pago = {
						create_date: create_date,
						fecha_pago: create_date,
						hora_aplicacion: create_date,
						paciente: data.paciente,
						dermatologo: data.dermatologo,
						tratamientos: [tratamientoConsultaId],
						quien_recibe_pago: data.quien_agenda,
						cantidad: data.precio,
						total: data.precio,
						forma_pago: data.forma_pago,
						sucursal: sucursal._id,
						observaciones: data.observaciones,
						porcentaje_descuento_clinica: values.porcentaje_descuento_clinica,
						descuento_clinica: values.descuento_clinica,
						descuento_dermatologo: 0,
						tipo_servicio: servicioConsultaId,
						servicio: resConsult._id,
						pago_anticipado: false,
						entrada: resEntrada._id,
						turno: turno,
					};

					const pagoResponse = await createPago(pago, token);
					if (`${pagoResponse.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
						const resPago = pagoResponse.data;
						resEntrada.pago = resPago._id;
						await updateEntrada(resEntrada._id, resEntrada, token);
						resConsult.pagos = [resPago];
						handleGuardarModalPagos(resConsult);
					}
				}
			}
			setOpenAlert(true);
			setSeverity('success');
			setMessage('LA CONSULTA SE AGENDO CORRECTAMENTE');
			setValues({
				servicio: '',
				tratamiento: '',
				fecha_show: '',
				fecha: '',
				hora: '',
				paciente: {},
				precio: '',
				tipo_cita: '',
				citado: '',
				pagado: false,
			});
			setDisableDate(true);
			setPacienteAgendado({});
			loadConsultas(new Date());
		}
		setIsLoading(false);
	};

	const handleChangePrecio = (e) => {
		setValues({ ...values, precio: e.target.value });
	}

	const handleChangeTiempo = (e) => {
		setValues({ ...values, tiempo: e.target.value });
	}

	const handleChangeDermatologos = (e) => {
		setValues({ ...values, dermatologo: e.target.value });
	}

	const handleChangeHoliDay = (e) => {
		setValues({
			...values,
			precio: !isHoliDay ? sucursal.precio_festivo : // Dia Festivo
				date.getDay() === 6 ? (date.getHours() >= 13 ? sucursal.precio_sabado_vespertino : sucursal.precio_sabado_matutino) // SABADO
					: (date.getHours() >= 14 ? sucursal.precio_vespertino : sucursal.precio_matutino), // L-V
		})
		setIsHoliDay(!isHoliDay);
	}

	const handleChangeCambioTurno = (e) => {
		setIsHoliDay(false);
		setValues({
			...values,
			precio: date.getDay() === 6 ? (values.precio === sucursal.precio_sabado_matutino ? sucursal.precio_sabado_vespertino : sucursal.precio_sabado_matutino) // SABADO
				: (values.precio === sucursal.precio_matutino ? sucursal.precio_vespertino : sucursal.precio_matutino) // L-V
		})
		setCambioTurno(!cambioTurno);
	}

	const handleChangeObservaciones = e => {
		setValues({ ...values, observaciones: e.target.value.toUpperCase() });
	}

	const handleChangePromovendedor = (e) => {
		setValues({ ...values, promovendedor: e.target.value });
	}

	const handleChangeFrecuencia = (e, newValue) => {
		const frecuencia = newValue;

		const dermatologo = dermatologos.find(item => {
			return item._id === dermatologoDirectoId;
		});
		const promovendedor = promovendedores.find(item => {
			return item._id === promovendedorSinPromovendedorId;
		});
		setValues({
			...values,
			frecuencia: frecuencia,
			dermatologo: frecuencia && frecuencia._id === frecuenciaPrimeraVezId ? dermatologo._id : dermatologoDirectoId,
			promovendedor: frecuencia && frecuencia._id === frecuenciaReconsultaId ? promovendedor : promovendedorSinPromovendedorId,
			producto: frecuencia && frecuencia._id === frecuenciaPrimeraVezId ? productoConsultaId : values.producto,
		});
	}

	const handleCloseAlert = () => {
		setOpenAlert(false);
	};

	const handleCloseModal = () => {
		setOpenModal(false);
		setOpenModalProxima(false);
		setOpenModalTraspaso(false);
	};

	const handleOnClickEditarConsulta = async (event, rowData) => {
		setIsLoading(true);
		setConsulta(rowData);
		await loadHorarios(new Date(rowData.fecha_hora));
		setOpenModal(true);
		setIsLoading(false);
	}

	const handleOnClickNuevaConsulta = async (event, rowData) => {
		setIsLoading(true);
		setConsulta(rowData);
		// await loadTratamientos(rowData.servicio);
		await loadHorarios(new Date(rowData.fecha_hora));
		setOpenModalProxima(true);
		setIsLoading(false);
	}

	const handleClickVerPagos = (event, rowData) => {
		setConsulta(rowData);
		setOpenModalPagos(true);
	}

	const handleClickTraspaso = (event, rowData) => {
		setConsulta(rowData);
		setOpenModalTraspaso(true);
	}

	const handleCloseVerPagos = () => {
		setOpenModalPagos(false);
	}

	const handleCloseCuracion = () => {
		setCuracion({
			materiales: [],
		});
		setOpenModalCuraciones(false);
	}

	const handleCloseEstetica = () => {
		setEstetica({
			materiales: [],
		});
		setOpenModalEstetica(false);
	}

	const handleCloseImprimirConsulta = () => {
		setOpenModalImprimirConsultas(false);
	}

	const handlePrint = async (event, rowData) => {
		setDatosImpresion(rowData);
		setOpenModalImprimirConsultas(true);
	}

	const handleGuardarModalPagos = async (servicio) => {
		servicio.pagado = servicio.pagos.length > 0;
		setIsLoading(true);
		if (!servicio.consecutivo) {
			const response = await findConsecutivoBySucursal(sucursal._id, token);
			if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				const resConsecutivo = response.data;
				servicio.consecutivo = resConsecutivo;

				if (servicio.forma_pago._id === sesionAnticipadaFormaPagoId) {
					servicio.sesion_anticipada.consecutivo = servicio.consecutivo;
					await updateSesionAnticipada(servicio.sesion_anticipada._id, servicio.sesion_anticipada, token);
				}

				const consecutivo = {
					consecutivo: servicio.consecutivo,
					tipo_servicio: servicio.servicio,
					servicio: servicio._id,
					sucursal: sucursal,
					fecha_hora: new Date(),
					status: servicio.status,
				}
				await createConsecutivo(consecutivo, token);
			}
		} else {
			if (servicio.forma_pago._id === sesionAnticipadaFormaPagoId) {
				servicio.sesion_anticipada.consecutivo = servicio.consecutivo;
				await updateSesionAnticipada(servicio.sesion_anticipada._id, servicio.sesion_anticipada, token);
			}
		}

		servicio.turno = servicio.turno ? servicio.turno : servicio.pagos[0].turno === 'm' ? 'M' : 'V';
		if (servicio.factura) {
			if (servicio.factura._id) {
				await updateConsult(servicio._id, servicio, token);
				await loadConsultas(new Date(servicio.fecha_hora));
			} else {
				const factura = {
					fecha_hora: new Date(),
					paciente: servicio.factura.paciente._id,
					razon_social: servicio.factura.razon_social._id,
					servicio: servicio.factura.servicio._id,
					tipo_servicio: servicio.factura.tipo_servicio._id,
					sucursal: servicio.factura.sucursal._id,
					uso_cfdi: servicio.factura.uso_cfdi._id,
				};
				const response = await createFactura(factura, token);
				if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
					servicio.factura = response.data;
					await updateConsult(servicio._id, servicio, token);
					await loadConsultas(new Date(servicio.fecha_hora));
				}
			}
		} else {
			await updateConsult(servicio._id, servicio, token);
			await loadConsultas(new Date(servicio.fecha_hora));
		}

		setOpenModalPagos(false);
		setIsLoading(false);
	}

	const actions = [
		{
			icon: AttachMoneyIcon,
			tooltip: 'PAGOS',
			onClick: handleClickVerPagos
		},
		{
			icon: PrintIcon,
			tooltip: 'IMPRIMIR',
			onClick: handlePrint
		},
		{
			icon: EditIcon,
			tooltip: 'EDITAR',
			onClick: handleOnClickEditarConsulta
		},
		{
			icon: LocalHospitalIcon,
			tooltip: 'AGREGAR FACIAL',
			onClick: onClickAgendarFaciales
		},
		{
			icon: LocalHospitalIcon,
			tooltip: 'AGREGAR APARATOLOGÍA',
			onClick: onClickAgendarAparatologia
		},
		{
			icon: LocalHospitalIcon,
			tooltip: 'AGREGAR DERMAPEN',
			onClick: onClickAgendarDermapen
		},
		{
			icon: LocalHospitalIcon,
			tooltip: 'AGREGAR CURACIÓN',
			onClick: onClickAgendarCuracion
		},
		{
			icon: FaceIcon,
			tooltip: 'AGREGAR ESTÉTICA',
			onClick: onClickAgendarEstetica
		},
		{
			icon: EventAvailableIcon,
			tooltip: 'NUEVA CITA',
			onClick: handleOnClickNuevaConsulta
		},
		{
			icon: AttachMoneyIcon,
			tooltip: 'TRASPASO',
			onClick: handleClickTraspaso
		},
		//: ''
		/*rowData => {
			return (rowData.status._id === enProcedimientoStatusId || rowData.status._id === enConsultorioStatusId
				|| rowData.status._id === enCabinaStatusId || rowData.status._id === atendidoStatusId)
				? {
					icon: LocalHospitalIcon,
					tooltip: 'AGREGAR CURACIÓN',
					onClick: onClickAgendarCuracion
				} : ''
		},
		rowData => {
			return (rowData.status._id === enProcedimientoStatusId || rowData.status._id === enConsultorioStatusId
				|| rowData.status._id === enCabinaStatusId || rowData.status._id === atendidoStatusId)
				? {
					icon: FaceIcon,
					tooltip: 'AGREGAR ESTÉTICA',
					onClick: onClickAgendarEstetica
				} : ''
		},
		rowData => (
			rowData.status._id !== pendienteStatusId ? {
				icon: AttachMoneyIcon,
				tooltip: rowData.pagado ? 'VER PAGO' : 'PAGAR',
				onClick: handleClickVerPagos
			} : ''
		),
		rowData => (
			rowData.status._id === atendidoStatusId ? {
				icon: EventAvailableIcon,
				tooltip: 'NUEVA CITA',
				onClick: handleOnClickNuevaConsulta
			} : ''
		),*/
	];

	const onChangeActions = (e, rowData) => {
		const action = e.target.value;
		switch (action) {
			case 'IMPRIMIR':
				handlePrint(e, rowData);
				break;
			case 'EDITAR':
				handleOnClickEditarConsulta(e, rowData);
				break;
			case 'AGREGAR CURACIÓN':
				onClickAgendarCuracion(e, rowData);
				break;
			case 'AGREGAR ESTÉTICA':
				onClickAgendarEstetica(e, rowData);
				break;
			case 'AGREGAR DERMAPEN':
				onClickAgendarDermapen(e, rowData);
				break;
			case 'AGREGAR APARATOLOGÍA':
				onClickAgendarAparatologia(e, rowData);
				break;
			case 'AGREGAR FACIAL':
				onClickAgendarFaciales(e, rowData);
				break;
			case 'NUEVA CITA':
				handleOnClickNuevaConsulta(e, rowData);
				break;
			case 'PAGOS':
				handleClickVerPagos(e, rowData);
				break;
			case 'TRASPASO':
				handleClickTraspaso(e, rowData);
				break;
		}
	}

	const components = {
		Pagination: props => {
			return <TablePagination
				{...props}
				rowsPerPageOptions={[5, 10, 20, 30, consultas.length]}
			/>
		},
		Actions: props => {
			return props.actions.length > 0
				? <Fragment>
					<FormControl variant="outlined" className={classes.formControl}>
						<Select
							labelId="simple-select-outlined-actions"
							id="simple-select-outlined-actions"
							onChange={(e) => onChangeActions(e, props.data)}
							label="ACCIONES">
							{
								props.actions.map((item, index) => {
									let menuItem = <MenuItem
										key={index}
										value={item.tooltip}
									>{item.tooltip}</MenuItem>;
									switch (item.tooltip) {
										case 'PAGOS':
											menuItem = props.data.status._id !== pendienteStatusId && props.data.status._id !== confirmadoStatusId ?
												<MenuItem
													key={index}
													value={item.tooltip}
												>{item.tooltip}</MenuItem>
												: '';
											break;
										case 'TRASPASO':
											menuItem = props.data.status._id !== atendidoStatusId && props.data.status._id !== confirmadoStatusId ?
												<MenuItem
													key={index}
													value={item.tooltip}
												>{item.tooltip}</MenuItem>
												: '';
											break;
										case 'NUEVA CITA':
											menuItem = props.data.status._id === atendidoStatusId ?
												<MenuItem
													key={index}
													value={item.tooltip}
												>{item.tooltip}</MenuItem>
												: '';
									}
									if (menuItem !== '' && props.data.status._id !== reagendoStatusId && props.data.status._id !== noAsistioStatusId) {
										return menuItem;
									}
								})
							}
						</Select>
					</FormControl>
				</Fragment>
				: ''
		}
	}

	const handleChangePaymentMethod = (e) => {
		const formaPago = e.target.value;
		setValues({
			...values,
			forma_pago: formaPago,
			precio: formaPago !== noPagaFormaPagoId ? getPrecio() : '0',
			porcentaje_descuento_clinica: formaPago !== noPagaFormaPagoId ? '0' : '100',
			descuento_clinica: formaPago !== noPagaFormaPagoId ? 0 : getPrecio(),
		});
	}

	const loadFormasPago = async () => {
		const response = await showAllMetodoPago();
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			setFormasPago(response.data);
		}
	}

	const loadDermatologos = async () => {
		const response = await findEmployeesByRolIdAvailable(dermatologoRolId, token);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			setDermatologos(response.data);
		}
	}

	const loadRecepcionistas = async () => {
		const response = await findEmployeesByRolIdAvailable(rolRecepcionistaId, token);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			setRecepcionistas(response.data);
		}
	}

	const loadPromovendedores = async () => {
		const response = await findEmployeesByRolIdAvailable(promovendedorRolId, token);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			setPromovendedores(response.data);
		}
	}

	const loadTipoCitas = async () => {
		const response = await showAllTipoCitas();
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			setTipoCitas(response.data);
		}
	}

	const loadMedios = async () => {
		const response = await showAllMedios();
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			setMedios(response.data);
		}
	}

	const loadFrecuencias = async () => {
		const response = await showAllFrecuencias();
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			setFrecuencias(response.data);
		}
	}

	const loadProductos = async () => {
		const response = await findProductoByServicio(consultaServicioId);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			setProductos(response.data);
		}
	}

	const loadAll = async () => {
		setIsLoading(true);
		await loadConsultas(new Date());
		await loadProductos();
		await loadDermatologos();
		await loadPromovendedores();
		await loadTipoCitas();
		await loadFrecuencias();
		await loadMedios();
		await loadFormasPago();
		await loadHorarios(values.fecha_hora);
		setIsLoading(false);
	}

	useEffect(() => {
		loadAll();
	}, []);

	return (
		<Fragment>
			{
				!isLoading ?
					<AgendarConsultaContainer
						values={values}
						horarios={horarios}
						formasPago={formasPago}
						onChangeFecha={(e) => handleChangeFecha(e)}
						onChangeFilterDate={(e) => handleChangeFilterDate(e)}
						onChangeHora={(e) => handleChangeHora(e)}
						filterDate={filterDate.fecha_show}
						paciente={paciente}
						disableDate={disableDate}
						onClickAgendar={handleClickAgendar}
						onChangePrecio={(e) => handleChangePrecio(e)}
						onChangeTiempo={(e) => handleChangeTiempo(e)}
						onChangeObservaciones={(e) => handleChangeObservaciones(e)}
						onChangePaymentMethod={(e) => handleChangePaymentMethod(e)}
						titulo={`CONSULTAS (${dateToString(filterDate.fecha_show)}) (${consultas.length})`}
						columns={columns}
						options={options}
						citas={consultas}
						actions={actions}
						components={components}
						consulta={consulta}
						openModal={openModal}
						empleado={empleado}
						sucursal={sucursal}
						isHoliDay={isHoliDay}
						cambioTurno={cambioTurno}
						colorBase={colorBase}
						onClickCancel={handleCloseModal}
						loadConsultas={loadConsultas}
						tipoCitas={tipoCitas}
						medios={medios}
						onChangeTipoCita={(e) => handleChangeTipoCita(e)}
						onChangeMedio={(e) => handleChangeMedio(e)}
						onChangeProductos={handleChangeProductos}
						dermatologos={dermatologos}
						promovendedores={promovendedores}
						recepcionistas={recepcionistas}
						onChangeDermatologos={(e) => handleChangeDermatologos(e)}
						onChangePromovendedor={(e) => handleChangePromovendedor(e)}
						onChangeHoliDay={(e) => handleChangeHoliDay(e)}
						onChangeCambioTurno={(e) => handleChangeCambioTurno(e)}
						setOpenAlert={setOpenAlert}
						setMessage={setMessage}
						setSeverity={setSeverity}
						setFilterDate={setFilterDate}
						OnCloseVerPagos={handleCloseVerPagos}
						openModalPagos={openModalPagos}
						openModalCuraciones={openModalCuraciones}
						openModalEstetica={openModalEstetica}
						openModalProxima={openModalProxima}
						openModalTraspaso={openModalTraspaso}
						openModalImprimirConsultas={openModalImprimirConsultas}
						datosImpresion={datosImpresion}
						onCloseImprimirConsulta={handleCloseImprimirConsulta}
						frecuencias={frecuencias}
						productos={productos}
						onChangeFrecuencia={handleChangeFrecuencia}
						dataComplete={dataComplete}
						onCloseCuracion={handleCloseCuracion}
						onCloseEstetica={handleCloseEstetica}
						curacion={curacion}
						estetica={estetica}
						tipoServicioId={consultaServicioId}
						frecuenciaPrimeraVezId={frecuenciaPrimeraVezId}
						frecuenciaReconsultaId={frecuenciaReconsultaId}
						onGuardarModalPagos={handleGuardarModalPagos} /> :
					<Backdrop className={classes.backdrop} open={isLoading} >
						<CircularProgress color="inherit" />
					</Backdrop>
			}
			<Snackbar open={openAlert} autoHideDuration={5000} onClose={handleCloseAlert}>
				<Alert onClose={handleCloseAlert} severity={severity}>
					{message}
				</Alert>
			</Snackbar>
		</Fragment>
	);
}

export default AgendarConsulta;