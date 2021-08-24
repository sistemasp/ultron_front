import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from '@material-ui/core/styles';
import {
	findScheduleByDateAndSucursalAndService,
	showAllTipoCitas,
	showAllMedios,
	showAllFrecuencias,
	showAllMetodoPago,
} from "../../../services";
import {
	findTreatmentByServicio,
} from "../../../services/tratamientos";
import {
	createFacial,
	findFacialByDateAndSucursal,
	updateFacial
} from "../../../services/faciales";
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
import { AgendarFacialContainer } from "./agendar_facial";
import EventAvailableIcon from '@material-ui/icons/EventAvailable';
import { findEmployeesByRolIdAvailable } from "../../../services/empleados";
import { createFactura } from "../../../services/facturas";
import { 
	findConsecutivoBySucursal,
	createConsecutivo,
} from "../../../services/consecutivos";
import { updateSesionAnticipada } from "../../../services/sesiones_anticipadas";

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

const AgendarFacial = (props) => {
	const classes = useStyles();

	const {
		info,
		empleado,
		setPacienteAgendado,
		sucursal,
		colorBase,
	} = props;

	const token = empleado.access_token;

	const paciente = info.paciente ? info.paciente : info;

	const dermatologoRolId = process.env.REACT_APP_DERMATOLOGO_ROL_ID;
	const promovendedorRolId = process.env.REACT_APP_PROMOVENDEDOR_ROL_ID;
	const cosmetologaRolId = process.env.REACT_APP_COSMETOLOGA_ROL_ID;
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
	const dermatologoDirectoId = process.env.REACT_APP_DERMATOLOGO_DIRECTO_ID;
	const tipoCitaNoAplicaId = process.env.REACT_APP_TIPO_CITA_NO_APLICA_ID;
	const directoTipoCitaId = process.env.REACT_APP_TIPO_CITA_DIRECTO_ID;
	const tipoCitaDerivadoId = process.env.REACT_APP_TIPO_CITA_DERIVADO_ID;
	const servicioFacialId = process.env.REACT_APP_FACIAL_SERVICIO_ID;
	const sucursalRubenDarioId = process.env.REACT_APP_SUCURSAL_RUBEN_DARIO_ID;
	const cosmetologaSinAsignarId = process.env.REACT_APP_COSMETOLOGA_SIN_ASIGNAR_ID;
	const promovendedorSinPromovendedorId = process.env.REACT_APP_PROMOVENDEDOR_SIN_PROMOVENDEDOR_ID;
	const frecuenciaPrimeraVezId = process.env.REACT_APP_FRECUENCIA_PRIMERA_VEZ_ID;
	const efectivoMetodoPagoId = process.env.REACT_APP_FORMA_PAGO_EFECTIVO;
	const sesionAnticipadaFormaPagoId = process.env.REACT_APP_FORMA_PAGO_SESION_ANTICIPADA;
	const fisicoMedioId = process.env.REACT_APP_MEDIO_FISICO_ID;

	const [openAlert, setOpenAlert] = useState(false);
	const [openModalTraspaso, setOpenModalTraspaso] = useState(false);
	const [message, setMessage] = useState('');
	const [severity, setSeverity] = useState('success');
	const [tratamientos, setTratamientos] = useState([]);
	const [horarios, setHorarios] = useState([]);
	const [dermatologos, setDermatologos] = useState([]);
	const [formasPago, setFormasPago] = useState([]);
	const [promovendedores, setPromovendedores] = useState([]);
	const [cosmetologas, setCosmetologas] = useState([]);
	const [tipoCitas, setTipoCitas] = useState([]);
	const [medios, setMedios] = useState([]);
	const [frecuencias, setFrecuencias] = useState([]);
	const [productos, setProductos] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [disableDate, setDisableDate] = useState(true);
	const [selectedAreas, setSelectedAreas] = useState(false);
	const [values, setValues] = useState({
		servicio: servicioFacialId,
		tratamientos: [],
		areas: [],
		paciente: `${paciente._id}`,
		precio: 0,
		tipo_cita: directoTipoCitaId,
		tiempo: '',
		observaciones: '',
		dermatologo: dermatologoDirectoId,
		consulta: info.dermatologo ? info._id : undefined,
		porcentaje_descuento_clinica: 0,
		descuento_clinica: 0,
		descuento_dermatologo: 0,
		cosmetologa: cosmetologaSinAsignarId,
		promovendedor: promovendedorSinPromovendedorId,
		frecuencia: frecuenciaPrimeraVezId,
		forma_pago: efectivoMetodoPagoId,
		medio: fisicoMedioId,
	});
	const [faciales, setFaciales] = useState([]);
	const [areas, setAreas] = useState([]);
	const [openModal, setOpenModal] = useState(false);
	const [openModalProxima, setOpenModalProxima] = useState(false);
	const [facial, setFacial] = useState();
	const [openModalPagos, setOpenModalPagos] = useState(false);
	const [openModalImprimirCita, setOpenModalImprimirCita] = useState(false);
	const [datosImpresion, setDatosImpresion] = useState();

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
		{ title: 'FORMA DE PAGO', field: 'forma_pago.nombre' },
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
		const response = await findTreatmentByServicio(servicioFacialId);
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

	const handleChangeTratamientos = (e) => {
		setSelectedAreas(false);
		e.map(async (tratamiento) => {
			setIsLoading(true);
			const response = await findAreasByTreatmentServicio(tratamiento.servicio, tratamiento._id);
			if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				tratamiento.areas = response.data;
				setIsLoading(false);
				setValues({
					...values,
					fecha_hora: '',
					precio: 0,
					tratamientos: e,
				});
			}
		});
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
		delete values.fecha_hora;
		setValues({
			...values,
			fecha_hora: '',
			precio: precio
		});
		setHorarios([]);
		setDisableDate(false);
		setIsLoading(false);
	}

	const handleChangeFecha = (date) => {
		setIsLoading(true);
		delete values.hora;
		setValues({
			...values,
			fecha_hora: date,
		});
		loadHorarios(date);
		setIsLoading(false);
	};

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
		await loadFaciales(date);
		setIsLoading(false);
	};

	const loadFaciales = async (filterDate) => {
		const response = await findFacialByDateAndSucursal(filterDate.getDate(), filterDate.getMonth(), filterDate.getFullYear(), sucursal, token);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			response.data.forEach(item => {
				item.folio = generateFolio(item);
				const fecha = new Date(item.fecha_hora);
				item.hora = `${addZero(fecha.getHours())}:${addZero(fecha.getMinutes())}`;
				item.precio_moneda = toFormatterCurrency(item.precio);
				item.total_moneda = toFormatterCurrency(item.total);
				item.paciente_nombre = `${item.paciente.nombres} ${item.paciente.apellidos}`;
				item.promovendedor_nombre = item.promovendedor ? item.promovendedor.nombre : 'SIN ASIGNAR';
				item.cosmetologa_nombre = item.cosmetologa ? item.cosmetologa.nombre : 'SIN ASIGNAR';
				item.dermatologo_nombre = item.dermatologo ? item.dermatologo.nombre : 'DIRECTO';

				item.show_tratamientos = item.tratamientos ? item.tratamientos.map(tratamiento => {
					const show_areas = tratamiento.areasSeleccionadas ? tratamiento.areasSeleccionadas.map(area => {
						return `${area.nombre}`;
					}) : '';
					return `►${tratamiento.nombre}(${show_areas}) `;
				}) : '';
			});
			setFaciales(response.data);
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

	const handleClickAgendar = async (data) => {
		setIsLoading(true);
		data.tratamientos.forEach(tratamiento => {
			tratamiento.areas = undefined;
		});
		data.total = data.precio;
		data.quien_agenda = empleado._id;
		data.sucursal = sucursal;
		data.status = pendienteStatusId;
		data.hora_llegada = '--:--';
		data.hora_atencion = '--:--';
		data.hora_salida = '--:--';
		data.tipo_cita = data.dermatologo._id === dermatologoDirectoId ? directoTipoCitaId : data.tipo_cita;
		// data.tiempo = getTimeToTratamiento(data.tratamientos);

		const response = await createFacial(data, token);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
			setOpenAlert(true);
			setSeverity('success');
			setMessage('EL FACIAL SE AGREGO CORRECTAMENTE');
			setValues({
				servicio: '',
				tratamientos: [],
				dermatologo: '',
				promovendedor: '',
				cosmetologa: '',
				paciente: `${paciente._id}`,
				precio: '',
				tipo_cita: {},
			});
			setDisableDate(true);
			setPacienteAgendado({});
			loadFaciales(data.fecha_hora);
			setFilterDate({
				fecha_show: data.fecha_hora,
				fecha: dateToString(data.fecha_hora),
			});
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
		});
	}

	const handleChangeTiempo = (e) => {
		setValues({ ...values, tiempo: e.target.value });
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

	const handleCloseAlert = () => {
		setOpenAlert(false);
	};

	const handleCloseModal = () => {
		setOpenModal(false);
		setOpenModalProxima(false);
	};

	const handleOnClickEditarCita = async (event, rowData) => {
		setIsLoading(true);
		setFacial(rowData);
		await loadHorariosByServicio(new Date(rowData.fecha_hora), rowData.servicio._id);
		setOpenModal(true);
		setIsLoading(false);
	}

	const handleOnClickNuevaCita = async (event, rowData) => {
		setIsLoading(true);
		setFacial(rowData);
		await loadHorariosByServicio(new Date(rowData.fecha_hora), rowData.servicio._id);
		setOpenModalProxima(true);
		setIsLoading(false);
	}

	const handleClickVerPagos = (event, rowData) => {
		setFacial(rowData);
		setOpenModalPagos(true);
	}

	const handleCloseVerPagos = (event, rowData) => {
		setOpenModalPagos(false);
	}

	const handleCloseTraspasos = (event, rowData) => {
		setOpenModalTraspaso(false);
	}

	const handleCloseImprimirConsulta = (event, rowData) => {
		setOpenModalImprimirCita(false);
	}

	const handlePrint = async (event, rowData) => {
		setDatosImpresion(rowData);
		setOpenModalImprimirCita(true);
	}

	const handleClickTraspaso = (event, rowData) => {
		setFacial(rowData);
		setOpenModalTraspaso(true);
	}

	const actions = [
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
		}, //: ''
		{
			icon: AttachMoneyIcon,
			tooltip: 'PAGOS',
			onClick: handleClickVerPagos
		},
		{
			icon: EventAvailableIcon,
			tooltip: 'NUEVA CITA',
			onClick: handleOnClickNuevaCita
		},
		// {
		// 	icon: AttachMoneyIcon,
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
				rowsPerPageOptions={[5, 10, 20, 30, faciales.length]}
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
										case 'EDITAR':
											menuItem = props.data.status._id !== canceladoCPStatusId && props.data.status._id !== canceladoSPStatusId
												?
												<MenuItem
													key={index}
													value={item.tooltip}
												>{item.tooltip}</MenuItem>
												: '';
											break;
										case 'PAGOS':
											menuItem = props.data.status._id !== pendienteStatusId && props.data.status._id !== confirmadoStatusId ?
												<MenuItem
													key={index}
													value={item.tooltip}
												>{item.tooltip}</MenuItem>
												: '';
											break;
										case 'TRASPASO':
											menuItem = props.data.status._id !== atendidoStatusId ?
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
				servicio.consecutivo = resConsecutivo.length;

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

		if (servicio.factura) {
			if (servicio.factura._id) {
				await updateFacial(servicio._id, servicio, token);
				await loadFaciales(new Date(servicio.fecha_hora));
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
					await updateFacial(servicio._id, servicio, token);
					await loadFaciales(new Date(servicio.fecha_hora));
				}
			}
		} else {
			await updateFacial(servicio._id, servicio, token);
			await loadFaciales(new Date(servicio.fecha_hora));
		}

		setOpenModalPagos(false);
	}

	const handleChangeFrecuencia = (e) => {
		setValues({
			...values,
			frecuencia: e.target.value,
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

	const loadPromovendedores = async () => {
		const response = await findEmployeesByRolIdAvailable(promovendedorRolId, token);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			setPromovendedores(response.data);
		}
	}

	const loadCosmetologas = async () => {
		const response = await findEmployeesByRolIdAvailable(cosmetologaRolId, token);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			setCosmetologas(response.data);
		}
	}

	const loadDermatologos = async () => {
		const response = await findEmployeesByRolIdAvailable(dermatologoRolId, token);
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

	const loadProductos = async () => {
		/*const response = await findProductoByServicio(consultaServicioId);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			setProductos(response.data);
		}*/
	}

	const loadAll = async () => {
		setIsLoading(true);
		await loadTratamientos();
		await loadFaciales(new Date());
		await loadPromovendedores();
		await loadCosmetologas();
		await loadDermatologos();
		await loadTipoCitas();
		await loadFrecuencias();
		await loadFormasPago();
		await loadMedios();
		setIsLoading(false);
	}

	useEffect(() => {
		loadAll();
	}, [sucursal]);

	return (
		<Fragment>
			{
				!isLoading ?
					<Formik
						enableReinitialize
						initialValues={values}
						validationSchema={validationSchema} >
						{
							props => <AgendarFacialContainer
								tratamientos={tratamientos}
								areas={areas}
								horarios={horarios}
								formasPago={formasPago}
								onChangeTratamientos={(e) => handleChangeTratamientos(e)}
								onChangeAreas={handleChangeAreas}
								onChangeFecha={(e) => handleChangeFecha(e)}
								onChangeFilterDate={(e) => handleChangeFilterDate(e)}
								onChangeHora={(e) => handleChangeHora(e)}
								onChangePaymentMethod={(e) => handleChangePaymentMethod(e)}
								onChangeObservaciones={(e) => handleChangeObservaciones(e)}
								filterDate={filterDate.fecha_show}
								paciente={paciente}
								disableDate={disableDate}
								promovendedores={promovendedores}
								cosmetologas={cosmetologas}
								onClickAgendar={handleClickAgendar}
								onChangeTiempo={(e) => handleChangeTiempo(e)}
								titulo={`FACIALES (${dateToString(filterDate.fecha_show)})`}
								columns={columns}
								options={options}
								citas={faciales}
								actions={actions}
								components={components}
								facial={facial}
								frecuencias={frecuencias}
								productos={productos}
								onChangeFrecuencia={(e) => handleChangeFrecuencia(e)}
								openModal={openModal}
								empleado={empleado}
								onClickCancel={handleCloseModal}
								loadFaciales={loadFaciales}
								dermatologos={dermatologos}
								tipoCitas={tipoCitas}
								medios={medios}
								colorBase={colorBase}
								onChangeTipoCita={(e) => handleChangeTipoCita(e)}
								onChangeMedio={(e) => handleChangeMedio(e)}
								onChangeDoctors={(e) => handleChangeDoctors(e)}
								onChangePromovendedor={(e) => handleChangePromovendedor(e)}
								onChangeCosmetologa={(e) => handleChangeCosmetologa(e)}
								onCloseVerPagos={handleCloseVerPagos}
								openModalPagos={openModalPagos}
								openModalProxima={openModalProxima}
								openModalImprimirCita={openModalImprimirCita}
								datosImpresion={datosImpresion}
								openModalTraspaso={openModalTraspaso}
								onCloseImprimirConsulta={handleCloseImprimirConsulta}
								onCloseTraspasos={handleCloseTraspasos}
								sucursal={sucursal}
								onChangeItemPrecio={handleChangeItemPrecio}
								setOpenAlert={setOpenAlert}
								setMessage={setMessage}
								setSeverity={setSeverity}
								setFilterDate={setFilterDate}
								dermatologoDirectoId={dermatologoDirectoId}
								onGuardarModalPagos={handleGuardarModalPagos}
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

export default AgendarFacial;