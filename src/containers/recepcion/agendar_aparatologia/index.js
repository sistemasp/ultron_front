import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from '@material-ui/core/styles';
import {
	findScheduleByDateAndSucursalAndService,
	showAllTipoCitas,
	showAllMedios,
	showAllFrecuencias,
	showAllMetodoPago,
	showAllBanco,
	showAllTipoTarjeta,
} from "../../../services";
import {
	findTreatmentByServicio,
} from "../../../services/tratamientos";
import {
	findAreasByTreatmentServicio,
} from "../../../services/areas";
import { Backdrop, CircularProgress, FormControl, InputLabel, MenuItem, Select, Snackbar, TablePagination } from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';
import { Formik } from 'formik';
import EditIcon from '@material-ui/icons/Edit';
import * as Yup from "yup";
import { toFormatterCurrency, addZero, generateFolio, dateToString } from "../../../utils/utils";
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import PrintIcon from '@material-ui/icons/Print';
import { AgendarAparatologiaContainer } from "./agendar_aparatologia";
import {
	createAparatologia,
	findAparatologiaByDateAndSucursal,
	updateAparatologia
} from "../../../services/aparatolgia";
import EventAvailableIcon from '@material-ui/icons/EventAvailable';
import { findEmployeesByRolIdAvailable } from "../../../services/empleados";
import { createFactura } from "../../../services/facturas";
import {
	findConsecutivoBySucursal,
	createConsecutivo,
} from "../../../services/consecutivos";
import { updateSesionAnticipada } from "../../../services/sesiones_anticipadas";
import { rolCosmetologaId, rolDermatologoId, rolPromovendedorId, rolRecepcionistaId, statusAsistioId, tipoEntradaAparatologiasId } from "../../../utils/constants";
import { useNavigate } from "react-router-dom";
import { createEntrada, updateEntrada } from "../../../services/entradas";
import { createPago } from "../../../services/pagos";

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles(theme => ({
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: '#fff',
	},
}));

const validationSchema = Yup.object({
	servicio: Yup.string("Ingresa los nombres")
		.required("El servicio es requerido."),
	tratamiento: Yup.string("Ingresa los apellidos")
		.required("El tratamiento es requerido"),
	fecha: Yup.string("Ingresa la fecha de nacimiento")
		.required("Los nombres del pacientes son requeridos"),
	hora: Yup.string("Ingresa la domicilio")
		.required("Los nombres del pacientes son requeridos")
});

const AgendarAparatologia = (props) => {
	const classes = useStyles();

	const navigate = useNavigate();

	const {
		info,
		empleado,
		setPacienteAgendado,
		sucursal,
		colorBase,
		turno,
	} = props;

	const token = empleado.access_token;
	const paciente = info.paciente ? info.paciente : info;

	const pendienteStatusId = process.env.REACT_APP_PENDIENTE_STATUS_ID;
	const atendidoStatusId = process.env.REACT_APP_ATENDIDO_STATUS_ID;
	const confirmadoStatusId = process.env.REACT_APP_CONFIRMADO_STATUS_ID;
	const noAsistioStatusId = process.env.REACT_APP_NO_ASISTIO_STATUS_ID;
	const reagendoStatusId = process.env.REACT_APP_REAGENDO_STATUS_ID;
	const canceladoCPStatusId = process.env.REACT_APP_CANCELO_CP_STATUS_ID;
	const canceladoSPStatusId = process.env.REACT_APP_CANCELO_SP_STATUS_ID;
	const sucursalManuelAcunaId = process.env.REACT_APP_SUCURSAL_MANUEL_ACUNA_ID;
	const sucursalOcciId = process.env.REACT_APP_SUCURSAL_OCCI_ID;
	const sucursalFedeId = process.env.REACT_APP_SUCURSAL_FEDE_ID;
	const sucursalRubenDarioId = process.env.REACT_APP_SUCURSAL_RUBEN_DARIO_ID;
	const dermatologoDirectoId = process.env.REACT_APP_DERMATOLOGO_DIRECTO_ID;
	const directoTipoCitaId = process.env.REACT_APP_TIPO_CITA_DIRECTO_ID;
	const servicioAparatologiaId = process.env.REACT_APP_APARATOLOGIA_SERVICIO_ID;
	const cosmetologaSinAsignarId = process.env.REACT_APP_COSMETOLOGA_SIN_ASIGNAR_ID;
	const promovendedorSinPromovendedorId = process.env.REACT_APP_PROMOVENDEDOR_SIN_PROMOVENDEDOR_ID;
	const frecuenciaPrimeraVezId = process.env.REACT_APP_FRECUENCIA_PRIMERA_VEZ_ID;
	const efectivoFormaPagoId = process.env.REACT_APP_FORMA_PAGO_EFECTIVO;
	const sesionAnticipadaFormaPagoId = process.env.REACT_APP_FORMA_PAGO_SESION_ANTICIPADA;
	const fisicoMedioId = process.env.REACT_APP_MEDIO_FISICO_ID;

	const [openAlert, setOpenAlert] = useState(false);
	const [message, setMessage] = useState('');
	const [severity, setSeverity] = useState('success');
	const [esHoy, setEsHoy] = useState(false);
	const [formasPago, setFormasPago] = useState([]);
	const [tratamientos, setTratamientos] = useState([]);
	const [horarios, setHorarios] = useState([]);
	const [dermatologos, setDermatologos] = useState([]);
	const [promovendedores, setPromovendedores] = useState([]);
	const [recepcionistas, setRecepcionistas] = useState([]);
	const [cosmetologas, setCosmetologas] = useState([]);
	const [tipoCitas, setTipoCitas] = useState([]);
	const [medios, setMedios] = useState([]);
	const [frecuencias, setFrecuencias] = useState([]);
	const [productos, setProductos] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [disableDate, setDisableDate] = useState(true);
	const [selectedAreas, setSelectedAreas] = useState(false);
	const [values, setValues] = useState({
		servicio: servicioAparatologiaId,
		tratamientos: [],
		areas: [],
		paciente: `${paciente._id}`,
		precio: 0,
		total: 0,
		tipo_cita: directoTipoCitaId,
		observaciones: '',
		dermatologo: dermatologoDirectoId,
		consulta: info.dermatologo ? info._id : undefined,
		porcentaje_descuento_clinica: 0,
		descuento_clinica: 0,
		descuento_dermatologo: 0,
		cosmetologa: cosmetologaSinAsignarId,
		promovendedor: promovendedorSinPromovendedorId,
		quien_realiza: cosmetologaSinAsignarId,
		frecuencia: frecuenciaPrimeraVezId,
		forma_pago: efectivoFormaPagoId,
		medio: fisicoMedioId,
		tiempo: 0,
	});
	const [aparatologias, setAparatologias] = useState([]);
	const [areas, setAreas] = useState([]);
	const [openModal, setOpenModal] = useState(false);
	const [openModalProxima, setOpenModalProxima] = useState(false);
	const [aparatologia, setAparatologia] = useState();
	const [openModalPagos, setOpenModalPagos] = useState(false);
	const [openModalImprimirCita, setOpenModalImprimirCita] = useState(false);
	const [openModalTraspaso, setOpenModalTraspaso] = useState(false);
	const [datosImpresion, setDatosImpresion] = useState();
	const [bancos, setBancos] = useState([]);
	const [tiposTarjeta, setTiposTarjeta] = useState([]);

	const date = new Date();
	const dia = addZero(date.getDate());
	const mes = addZero(date.getMonth() + 1);
	const anio = date.getFullYear();

	const [filterDate, setFilterDate] = useState({
		fecha_show: date,
		fecha: `${dia}/${mes}/${anio}`
	});

	const columns = [
		{ title: 'FOLIO', field: 'consecutivo' },
		{ title: 'TURNO', field: 'turno' },
		{ title: 'HORA', field: 'hora' },
		{ title: 'PACIENTE', field: 'paciente_nombre' },
		{ title: 'TELÉFONO', field: 'paciente.telefono' },
		{ title: 'PRODUCTO (ÁREAS)', field: 'show_tratamientos' },
		{ title: 'TIEMPO', field: 'tiempo' },
		{ title: 'OBSERVACIONES', field: 'observaciones' },
		{ title: 'QUIÉN AGENDA', field: 'quien_agenda.nombre' },
		{ title: 'FRECUENCIA', field: 'frecuencia.nombre' },
		{ title: 'TIPO', field: 'tipo_cita.nombre' },
		{ title: 'DERMATÓLOGO (A)', field: 'dermatologo_nombre' },
		{ title: 'COSMETÓLOGA', field: 'cosmetologa_nombre' },
		{ title: 'PROMOVENDEDOR (A)', field: 'promovendedor_nombre' },
		{ title: 'STATUS', field: 'status.nombre' },
		{ title: 'PRECIO', field: 'precio_moneda' },
		{ title: 'TOTAL', field: 'total_moneda' },
		{ title: 'FORMA DE PAGO', field: 'forma_pago_show' },
		{ title: 'HORA LLEGADA', field: 'hora_llegada' },
		{ title: 'HORA ATENDIDO', field: 'hora_atencion' },
		{ title: 'HORA SALIDA', field: 'hora_salida' },
	];

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

	const loadTratamientos = async () => {
		const response = await findTreatmentByServicio(servicioAparatologiaId);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			setTratamientos(response.data);
		}
	}

	const loadAreas = async (tratamiento) => {
		const response = await findAreasByTreatmentServicio(tratamiento.servicio, tratamiento._id);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			setAreas(response.data);
		}
	}

	const loadHorarios = async (date) => {
		const dia = date ? date.getDate() : values.fecha_hora.getDate();
		const mes = Number(date ? date.getMonth() : values.fecha_hora.getMonth());
		const anio = date ? date.getFullYear() : values.fecha_hora.getFullYear();
		const response = await findScheduleByDateAndSucursalAndService(dia, mes, anio, sucursal, values.servicio);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			setHorarios(response.data);
		}
	}

	const loadHorariosByServicio = async (date, servicio) => {
		const dia = date ? date.getDate() : values.fecha_hora.getDate();
		const mes = Number(date ? date.getMonth() : values.fecha_hora.getMonth());
		const anio = date ? date.getFullYear() : values.fecha_hora.getFullYear();
		const response = await findScheduleByDateAndSucursalAndService(dia, mes, anio, sucursal, servicio);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			setHorarios(response.data);
		}
	}

	const handleChangeServicio = async (e) => {
		setIsLoading(true);

		setValues({
			...values,
			servicio: e.target.value,
			fecha_hora: '',
			precio: 0,
			total: 0,
			tratamientos: []
		});
		loadTratamientos(e.target.value);
		setIsLoading(false);
	};

	const getTimeToTratamiento = () => {
		let tiempo = 0;
		values.tratamientos.forEach(tratamiento => {
			tratamiento.areasSeleccionadas.sort((a, b) => {
				if (a.tiempo < b.tiempo) return 1;
				if (a.tiempo > b.tiempo) return -1;
				return 0;
			});

			tratamiento.areasSeleccionadas.forEach((item, index) => {
				tiempo += Number(item.tiempo);
			});
		});

		return tiempo;
	}

	const handleChangeTratamientos = (e) => {
		setSelectedAreas(false);
		e.map(async (tratamiento) => {
			setIsLoading(true);
			const response = await findAreasByTreatmentServicio(tratamiento.servicio, tratamiento._id);
			if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				tratamiento.areas = response.data;
				tratamiento.areasSeleccionadas = tratamiento.areasSeleccionadas ? tratamiento.areasSeleccionadas : [];
				setIsLoading(false);
				setValues({
					...values,
					fecha_hora: '',
					precio: 0,
					total: 0,
					tratamientos: e,
				});
			}
		});
		values.tiempo = getTimeToTratamiento();
	};

	const handleChangeAreas = async (items, tratamiento) => {
		setSelectedAreas(items.length > 0);
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
					item.precio_real = itemPrecio;
				});
			}
		});
		setValues({
			...values,
			fecha_hora: '',
			precio: precio,
			total: precio,
			hora: '',
			tiempo: getTimeToTratamiento(),
		});
		setDisableDate(false);
		setIsLoading(false);
	}

	const handleChangeFecha = async (date) => {
		setIsLoading(true);
		setValues({
			...values,
			fecha_hora: date,
			hora: '',
		});
		await handleChangeFilterDate(date);
		loadHorarios(date);
		setIsLoading(false);
	};

	const handleChangeEsHoy = (e) => {
		setEsHoy(!esHoy);
	}

	const handleChangeHora = e => {
		setIsLoading(true);
		const hora = (e.target.value).split(':');
		const date = values.fecha_hora;
		date.setHours(Number(hora[0]));
		date.setMinutes(hora[1]);
		date.setSeconds(0);
		setValues({ ...values, hora: e.target.value, fecha_hora: date });
		setIsLoading(false);
	};

	const handleChangeObservaciones = e => {
		setValues({ ...values, observaciones: e.target.value.toUpperCase() });
	}

	const handleChangeFilterDate = async (date) => {
		setIsLoading(true);
		const dia = addZero(date.getDate());
		const mes = addZero(date.getMonth() + 1);
		const anio = date.getFullYear();
		setFilterDate({
			fecha_show: date,
			fecha: `${dia}/${mes}/${anio}`
		});
		await loadAparatologias(date);
		setIsLoading(false);
	};

	const loadAparatologias = async (filterDate) => {
		const response = await findAparatologiaByDateAndSucursal(filterDate.getDate(), filterDate.getMonth(), filterDate.getFullYear(), sucursal, token);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			response.data.forEach(item => {
				item.folio = generateFolio(item);
				const fecha = new Date(item.fecha_hora);
				item.hora = `${addZero(fecha.getHours())}:${addZero(fecha.getMinutes())}`;
				item.precio_moneda = toFormatterCurrency(item.precio);
				item.total_moneda = toFormatterCurrency(item.total);
				item.paciente_nombre = `${item.paciente.nombres} ${item.paciente.apellidos}`;
				item.promovendedor_nombre = item.promovendedor ? item.promovendedor.nombre : 'SIN ASIGNAR';
				item.cosmetologa_nombre = item.quien_realiza ? item.quien_realiza.nombre : 'SIN ASIGNAR';
				item.dermatologo_nombre = item.dermatologo ? item.dermatologo.nombre : 'DIRECTO';
				item.show_tratamientos = item.tratamientos.map(tratamiento => {
					const show_areas = tratamiento.areasSeleccionadas.map(area => {
						return `${area.nombre}`;
					});
					return `►${tratamiento.nombre}(${show_areas}) `;
				});
				item.forma_pago_show = `${item.forma_pago.nombre}${item.factura ? ' (FACTURA)' : ''}`;
			});
			setAparatologias(response.data);
		}
	}

	const handleClickAgendar = async (data) => {
		setIsLoading(true);
		data.tratamientos.forEach(tratamiento => {
			tratamiento.areas = undefined;
		});
		data.quien_agenda = empleado._id;
		data.sucursal = sucursal;
		data.status = pendienteStatusId;
		data.hora_llegada = '--:--';
		data.tipo_cita = data.dermatologo._id === dermatologoDirectoId ? directoTipoCitaId : data.tipo_cita;
		const response = await createAparatologia(data, token);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
			if (esHoy) {
				const resAparatologia = response.data;
				const create_date = new Date();
				resAparatologia.hora_llegada = `${addZero(create_date.getHours())}:${addZero(create_date.getMinutes())}`;
				resAparatologia.status = statusAsistioId;
				resAparatologia.hora_aplicacion = create_date;
				await updateAparatologia(resAparatologia._id, resAparatologia, token);
				const entrada = {
					create_date: create_date,
					hora_aplicacion: create_date,
					recepcionista: empleado._id,
					concepto: `PACIENTE: ${paciente.nombres} ${paciente.apellidos}`,
					cantidad: resAparatologia.precio,
					tipo_entrada: tipoEntradaAparatologiasId,
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
						paciente: resAparatologia.paciente,
						dermatologo: resAparatologia.dermatologo,
						tratamientos: resAparatologia.tratamientos,
						quien_recibe_pago: resAparatologia.quien_agenda,
						cantidad: resAparatologia.precio,
						total: resAparatologia.precio,
						forma_pago: data.forma_pago,
						digitos: data.digitos,
						banco: data.banco,
						tipo_tarjeta: data.tipo_tarjeta,
						sucursal: sucursal._id,
						observaciones: resAparatologia.observaciones,
						porcentaje_descuento_clinica: '0',
						descuento_clinica: 0,
						descuento_dermatologo: 0,
						tipo_servicio: servicioAparatologiaId,
						servicio: resAparatologia._id,
						pago_anticipado: false,
						entrada: resEntrada._id,
						turno: turno,
					};
					const pagoResponse = await createPago(pago, token);
					if (`${pagoResponse.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
						const resPago = pagoResponse.data;
						resEntrada.pago = resPago._id;
						await updateEntrada(resEntrada._id, resEntrada, token);
						resAparatologia.pagos = [resPago];
						handleGuardarModalPagos(resAparatologia);
					}
				}
			}
			setOpenAlert(true);
			setSeverity('success');
			setMessage('APARATOLOGIA AGREGADA CORRECTAMENTE');
			setValues({
				servicio: '',
				tratamientos: [],
				dermatologo: '',
				promovendedor: '',
				cosmetologa: '',
				paciente: `${paciente._id}`,
				precio: 0,
				total: 0,
				tipo_cita: {},
				tiempo: '30',
			});
			setDisableDate(true);
			setPacienteAgendado({});
			loadAparatologias(new Date());
		}

		setIsLoading(false);
	};

	const handleChangeItemPrecio = (e, index) => {
		const newTratamientos = values.tratamientos;
		newTratamientos[index].precio = e.target.value;
		let precio = 0;
		newTratamientos.map((item) => {
			precio = Number(precio) + Number(item.precio);
		});
		setValues({
			...values,
			tratamientos: newTratamientos,
			precio: precio,
			total: precio,
		});
	}

	const handleChangeDoctors = (e) => {
		setValues({ ...values, dermatologo: e.target.value });
	}

	const handleChangePromovendedor = (e) => {
		setValues({ ...values, promovendedor: e.target.value });
	}

	const handleChangeCosmetologa = (e) => {
		setValues({ ...values, cosmetologa: e.target.value });
	}

	const handleChangeTipoCita = (e) => {
		setValues({ ...values, tipo_cita: e.target.value });
	}

	const handleChangeMedio = (e) => {
		setValues({ ...values, medio: e.target.value });
	}

	const handleChangeBank = (event) => {
		setValues({ ...values, banco: event.target.value });
	}

	const handleChangeCardType = (event) => {
		setValues({ ...values, tipo_tarjeta: event.target.value });
	}

	const handleChangeDigitos = (event) => {
		setValues({ ...values, digitos: event.target.value });
	}

	const handleChangeTiempo = (e) => {
		setValues({ ...values, tiempo: e.target.value });
	}

	const handleCloseAlert = () => {
		setOpenAlert(false);
	};

	const handleCloseModal = () => {
		setOpenModal(false);
		setOpenModalProxima(false);
	};

	const handleCloseTraspasos = (event, rowData) => {
		setOpenModalTraspaso(false);
	}

	const handleClickTraspaso = (event, rowData) => {
		setAparatologia(rowData);
		setOpenModalTraspaso(true);
	}

	const handleOnClickEditarCita = async (event, rowData) => {
		setIsLoading(true);
		setAparatologia(rowData);
		await loadHorariosByServicio(new Date(rowData.fecha_hora), rowData.servicio._id);
		setOpenModal(true);
		setIsLoading(false);
	}

	const handleOnClickNuevaCita = async (event, rowData) => {
		setIsLoading(true);
		setAparatologia(rowData);
		await loadHorariosByServicio(new Date(rowData.fecha_hora), rowData.servicio._id);
		setOpenModalProxima(true);
		setIsLoading(false);
	}

	const handleClickVerPagos = (event, rowData) => {
		setAparatologia(rowData);
		setOpenModalPagos(true);
	}

	const handleCloseVerPagos = (event, rowData) => {
		setOpenModalPagos(false);
	}

	const handleCloseImprimirConsulta = (event, rowData) => {
		setOpenModalImprimirCita(false);
	}

	const handlePrint = async (event, rowData) => {
		navigate('/imprimir/ticket/tratamiento',
			{
				state: {
					empleado: empleado,
					sucursal: sucursal,
					datos: rowData,
					colorBase: colorBase,
				}
			});
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
		//new Date(anio, mes - 1, dia) < filterDate.fecha_hora  ? 
		{
			icon: EditIcon,
			tooltip: 'EDITAR',
			onClick: handleOnClickEditarCita
		},
		{
			icon: EventAvailableIcon,
			tooltip: 'NUEVA CITA',
			onClick: handleOnClickNuevaCita
		},
		// {
		// 	icon: EventAvailableIcon,
		// 	tooltip: 'TRASPASO',
		// 	onClick: handleClickTraspaso
		// },
	];

	const onChangeActions = (e, rowData) => {
		const action = e.target.value;
		switch (action) {
			case 'IMPRIMIR':
				handlePrint(e, rowData);
				break;
			case 'EDITAR':
				handleOnClickEditarCita(e, rowData);
				break;
			case 'NUEVA CITA':
				handleOnClickNuevaCita(e, rowData);
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
				rowsPerPageOptions={[5, 10, 20, 30, aparatologias.length]}
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

	const handleGuardarModalPagos = async (servicio) => {
		servicio.pagado = servicio.pagos.length > 0;

		if (!servicio.consecutivo) {
			const response = await findConsecutivoBySucursal(sucursal, token);
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
				await updateAparatologia(servicio._id, servicio, token);
				await loadAparatologias(new Date(servicio.fecha_hora));
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
					await updateAparatologia(servicio._id, servicio, token);
					await loadAparatologias(new Date(servicio.fecha_hora));
				}
			}
		} else {
			await updateAparatologia(servicio._id, servicio, token);
			await loadAparatologias(new Date(servicio.fecha_hora));
		}

		setOpenModalPagos(false);
	}

	const handleChangeFrecuencia = (e) => {
		setValues({
			...values,
			frecuencia: e.target.value,
			//producto: frecuencia === frecuenciaPrimeraVezId ? productoConsultaId : values.producto,
		});
	}

	const handleChangePaymentMethod = (event) => {
		setValues({
			...values,
			forma_pago: event.target.value,
		});
	}

	const loadFormasPago = async () => {
		const response = await showAllMetodoPago();
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			setFormasPago(response.data);
		}
	}

	const loadRecepcionistas = async () => {
		const response = await findEmployeesByRolIdAvailable(rolRecepcionistaId, token);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			setRecepcionistas(response.data);
		}
	}

	const loadPromovendedores = async () => {
		const response = await findEmployeesByRolIdAvailable(rolPromovendedorId, token);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			setPromovendedores(response.data);
		}
	}

	const loadCosmetologas = async () => {
		const response = await findEmployeesByRolIdAvailable(rolCosmetologaId, token);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			setCosmetologas(response.data);
		}
	}

	const loadDermatologos = async () => {
		const response = await findEmployeesByRolIdAvailable(rolDermatologoId, token);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			setDermatologos(response.data);
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

	const loadBancos = async () => {
		const response = await showAllBanco();
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			setBancos(response.data);
		}
	}

	const loadTipoTarjeta = async () => {
		const response = await showAllTipoTarjeta();
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			setTiposTarjeta(response.data);
		}
	}

	const loadAll = async () => {
		setIsLoading(true);
		await loadTratamientos();
		await loadAparatologias(new Date());
		await loadRecepcionistas();
		await loadPromovendedores();
		await loadCosmetologas();
		await loadDermatologos();
		await loadBancos();
		await loadTipoTarjeta();
		await loadTipoCitas();
		await loadFrecuencias();
		await loadFormasPago();
		await loadMedios();
		setIsLoading(false);
	}

	useEffect(() => {
		loadAll();
	}, []);

	return (
		<Fragment>
			{
				!isLoading ?
					<Formik
						enableReinitialize
						initialValues={values}
						validationSchema={validationSchema} >
						{
							props => <AgendarAparatologiaContainer
								tratamientos={tratamientos}
								areas={areas}
								horarios={horarios}
								onChangeTratamientos={(e) => handleChangeTratamientos(e)}
								onChangeAreas={handleChangeAreas}
								onChangeFecha={(e) => handleChangeFecha(e)}
								onChangeFilterDate={(e) => handleChangeFilterDate(e)}
								onChangeHora={(e) => handleChangeHora(e)}
								onChangeObservaciones={(e) => handleChangeObservaciones(e)}
								filterDate={filterDate.fecha_show}
								paciente={paciente}
								disableDate={disableDate}
								promovendedores={promovendedores}
								recepcionistas={recepcionistas}
								cosmetologas={cosmetologas}
								onClickAgendar={handleClickAgendar}
								titulo={`APARATOLOGIAS (${dateToString(filterDate.fecha_show)}) (${aparatologias.length})`}
								columns={columns}
								options={options}
								aparatologias={aparatologias}
								actions={actions}
								components={components}
								aparatologia={aparatologia}
								openModal={openModal}
								openModalProxima={openModalProxima}
								empleado={empleado}
								onClickCancel={handleCloseModal}
								loadAparatologias={loadAparatologias}
								dermatologos={dermatologos}
								tipoCitas={tipoCitas}
								medios={medios}
								bancos={bancos}
								tiposTarjeta={tiposTarjeta}
								frecuencias={frecuencias}
								productos={productos}
								formasPago={formasPago}
								colorBase={colorBase}
								esHoy={esHoy}
								onChangeEsHoy={(e) => handleChangeEsHoy(e)}
								onChangeFrecuencia={(e) => handleChangeFrecuencia(e)}
								onChangeTipoCita={(e) => handleChangeTipoCita(e)}
								onChangeMedio={(e) => handleChangeMedio(e)}
								onChangePaymentMethod={(e) => handleChangePaymentMethod(e)}
								onChangeDoctors={(e) => handleChangeDoctors(e)}
								onChangePromovendedor={(e) => handleChangePromovendedor(e)}
								onChangeBank={(e) => handleChangeBank(e)}
								onChangeCardType={(e) => handleChangeCardType(e)}
								onChangeDigitos={(e) => handleChangeDigitos(e)}
								onChangeCosmetologa={(e) => handleChangeCosmetologa(e)}
								onChangeTiempo={(e) => handleChangeTiempo(e)}
								onCloseVerPagos={handleCloseVerPagos}
								openModalPagos={openModalPagos}
								openModalImprimirCita={openModalImprimirCita}
								datosImpresion={datosImpresion}
								onCloseImprimirConsulta={handleCloseImprimirConsulta}
								sucursal={sucursal}
								onChangeItemPrecio={handleChangeItemPrecio}
								setOpenAlert={setOpenAlert}
								setMessage={setMessage}
								setSeverity={setSeverity}
								setFilterDate={setFilterDate}
								dermatologoDirectoId={dermatologoDirectoId}
								onGuardarModalPagos={handleGuardarModalPagos}
								openModalTraspaso={openModalTraspaso}
								onCloseTraspasos={handleCloseTraspasos}
								selectedAreas={selectedAreas}
								{...props} />
						}
					</Formik> :
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

export default AgendarAparatologia;