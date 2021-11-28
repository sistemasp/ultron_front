import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from '@material-ui/core/styles';
import {
	findScheduleByDateAndSucursalAndService,
	showAllMaterials,
	showAllFrecuencias,
	showAllMetodoPago,
	showAllMedios,
} from "../../../services";
import {
	createCuracion,
	findCuracionByDateAndSucursal,
	updateCuracion
} from "../../../services/curaciones";
import { Backdrop, CircularProgress, FormControl, InputLabel, MenuItem, Select, Snackbar, TablePagination } from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';
import { Formik } from 'formik';
import EditIcon from '@material-ui/icons/Edit';
import * as Yup from "yup";
import { toFormatterCurrency, addZero, generateFolio, dateToString } from "../../../utils/utils";
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import PrintIcon from '@material-ui/icons/Print';
import { AgendarCuracionContainer } from "./agendar_curacion";
import { findProductoByServicio } from "../../../services/productos";
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
	fecha: Yup.string("Ingresa la fecha de nacimiento")
		.required("Los nombres del pacientes son requeridos"),
	hora: Yup.string("Ingresa la domicilio")
		.required("Los nombres del pacientes son requeridos")
});

const AgendarCuracion = (props) => {
	const classes = useStyles();

	const {
		empleado,
		consultaAgendada,
		sucursal,
		colorBase,
		turno,
	} = props;

	const token = empleado.access_token;

	const asistioStatusId = process.env.REACT_APP_ASISTIO_STATUS_ID;

	const paciente = consultaAgendada.paciente ? consultaAgendada.paciente : consultaAgendada;

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
	const sucursalRubenDarioId = process.env.REACT_APP_SUCURSAL_RUBEN_DARIO_ID;
	const dermatologoDirectoId = process.env.REACT_APP_DERMATOLOGO_DIRECTO_ID;
	const tipoCitaRealizadoId = process.env.REACT_APP_TIPO_CITA_REALIZADO_ID;
	const curacionServicioId = process.env.REACT_APP_CURACION_SERVICIO_ID;
	const frecuenciaPrimeraVezId = process.env.REACT_APP_FRECUENCIA_PRIMERA_VEZ_ID;
	const frecuenciaReconsultaId = process.env.REACT_APP_FRECUENCIA_RECONSULTA_ID;
	const productoCuracionId = process.env.REACT_APP_PRODUCTO_CURACION_ID;
	const efectivoFormaPagoId = process.env.REACT_APP_FORMA_PAGO_EFECTIVO;
	const sesionAnticipadaFormaPagoId = process.env.REACT_APP_FORMA_PAGO_SESION_ANTICIPADA;
	const fisicoMedioId = process.env.REACT_APP_MEDIO_FISICO_ID;

	const [openAlert, setOpenAlert] = useState(false);
	const [openModalTraspaso, setOpenModalTraspaso] = useState(false);
	const [message, setMessage] = useState('');
	const [horarios, setHorarios] = useState([]);
	const [dermatologos, setDermatologos] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [disableDate, setDisableDate] = useState(false);
	const [formasPago, setFormasPago] = useState([]);
	const [frecuencias, setFrecuencias] = useState([]);
	const [productos, setProductos] = useState([]);
	const [values, setValues] = useState({
		servicio: curacionServicioId,
		consultaId: consultaAgendada._id,
		fecha_hora: new Date(),
		total_aplicacion: 0,
		precio: 0,
		total: 0,
		observaciones: '',
		materiales: [],
		producto: productoCuracionId,
		tipo_cita: tipoCitaRealizadoId,
		porcentaje_descuento_clinica: 0,
		descuento_clinica: 0,
		descuento_dermatologo: 0,
		frecuencia: frecuenciaPrimeraVezId,
		dermatologo: dermatologoDirectoId,
		forma_pago: efectivoFormaPagoId,
		medio: fisicoMedioId,
		hora: 0,
		minutos: 0,
	});
	const [curaciones, setCuraciones] = useState([]);
	const [openModal, setOpenModal] = useState(false);
	const [openModalProxima, setOpenModalProxima] = useState(false);
	const [curacion, setCuracion] = useState();
	const [openModalPagos, setOpenModalPagos] = useState(false);
	const [openModalImprimirCita, setOpenModalImprimirCita] = useState(false);
	const [datosImpresion, setDatosImpresion] = useState();
	const [materiales, setMateriales] = useState([]);
	const [medios, setMedios] = useState([]);

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

	const handleChangeFecha = async (date) => {
		setIsLoading(true);
		setValues({
			...values,
			fecha_hora: date,
		});
		await handleChangeFilterDate(date);
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

	const handleChangeFilterDate = async (date) => {
		setIsLoading(true);
		const dia = addZero(date.getDate());
		const mes = addZero(date.getMonth() + 1);
		const anio = date.getFullYear();
		setFilterDate({
			fecha_show: date,
			fecha: `${dia}/${mes}/${anio}`
		});
		await loadCuraciones(date);
		setIsLoading(false);
	};

	const loadCuraciones = async (filterDate) => {
		const response = await findCuracionByDateAndSucursal(filterDate.getDate(), filterDate.getMonth(), filterDate.getFullYear(), sucursal, token);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			response.data.forEach(item => {
				item.folio = generateFolio(item);
				const fecha = new Date(item.fecha_hora);
				item.hora = `${addZero(fecha.getHours())}:${addZero(fecha.getMinutes())}`;
				item.precio_moneda = toFormatterCurrency(item.precio);
				item.total_moneda = toFormatterCurrency(item.total);
				item.paciente_nombre = `${item.paciente.nombres} ${item.paciente.apellidos}`;
				item.promovendedor_nombre = 'SIN PROMOVENDEDOR';
				item.cosmetologa_nombre = item.cosmetologa ? item.cosmetologa.nombre : 'SIN ASIGNAR';
				item.dermatologo_nombre = item.dermatologo ? item.dermatologo.nombre : 'DIRECTO';
				item.show_tratamientos = item.producto.nombre;
				item.forma_pago_show = `${item.forma_pago.nombre}${item.factura ? ' (FACTURA)' : ''}`;
			});
			setCuraciones(response.data);
		}
	}

	const handleClickAgendar = async (data) => {
		setIsLoading(true);
		data.total = data.precio;
		data.quien_agenda = empleado._id;
		data.sucursal = sucursal;
		data.status = pendienteStatusId;
		data.paciente = paciente._id;
		data.status = pendienteStatusId;
		data.hora_llegada = '--:--';
		data.hora_atencion = '--:--';
		data.hora_salida = '--:--';
		if (sucursal._id !== sucursalManuelAcunaId && sucursal._id !== sucursalRubenDarioId) {
			const dateNow = new Date();
			data.hora_llegada = `${addZero(dateNow.getHours())}:${addZero(dateNow.getMinutes())}`;
			dateNow.setMinutes(0);
			dateNow.setSeconds(0);
			data.fecha_hora = dateNow;
			data.status = asistioStatusId;
			data.hora_aplicacion = new Date();
			// data.quien_confirma_asistencia = empleado._id;
		}
		const response = await createCuracion(data, token);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
			setOpenAlert(true);
			setMessage('EL CURACIÓN SE AGREGO CORRECTAMENTE');
			setValues({
				materiales: [],
				dermatologo: '',
				promovendedor: '',
				cosmetologa: '',
				paciente: `${paciente._id}`,
				total_aplicacion: '',
				precio: '',
				total: '',
				tipo_cita: {},
			});
			loadCuraciones(data.fecha_hora);
			setFilterDate({
				fecha_show: data.fecha_hora,
				fecha: dateToString(data.fecha_hora),
			});
		}

		setIsLoading(false);
	};

	const handleChangeTiempo = (e) => {
		setValues({ ...values, tiempo: e.target.value });
	}

	const handleChangeDermatologos = (e) => {
		setValues({ ...values, dermatologo: e.target.value });
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

	const handleCloseTraspasos = (event, rowData) => {
		setOpenModalTraspaso(false);
	}

	const handleOnClickEditarCita = async (event, rowData) => {
		setIsLoading(true);
		setCuracion(rowData);
		setOpenModal(true);
		setIsLoading(false);
	}

	const handleOnClickNuevaCita = async (event, rowData) => {
		setIsLoading(true);
		setCuracion(rowData);
		setOpenModalProxima(true);
		setIsLoading(false);
	}

	const handleClickVerPagos = (event, rowData) => {
		setCuracion(rowData);
		setOpenModalPagos(true);
	}

	const handleCloseVerPagos = (event, rowData) => {
		setOpenModalPagos(false);
	}

	const handleCloseImprimirConsulta = (event, rowData) => {
		setOpenModalImprimirCita(false);
	}

	const handlePrint = async (event, rowData) => {
		setDatosImpresion(rowData);
		setOpenModalImprimirCita(true);
	}

	const handleClickTraspaso = (event, rowData) => {
		setCuracion(rowData);
		setOpenModalTraspaso(true);
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
			onClick: handleOnClickEditarCita
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
			case 'PAGOS':
				handleClickVerPagos(e, rowData);
				break;
			case 'NUEVA CITA':
				handleOnClickNuevaCita(e, rowData);
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
				rowsPerPageOptions={[5, 10, 20, 30, curaciones.length]}
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
				await updateCuracion(servicio._id, servicio, token);
				await loadCuraciones(new Date(servicio.fecha_hora));
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
					await updateCuracion(servicio._id, servicio, token);
					await loadCuraciones(new Date(servicio.fecha_hora));
				}
			}
		} else {
			await updateCuracion(servicio._id, servicio, token);
			await loadCuraciones(new Date(servicio.fecha_hora));
		}

		setOpenModalPagos(false);
	}

	const handleChangeMateriales = async (items) => {
		setIsLoading(true);
		setValues({
			...values,
			materiales: items
		});
		setIsLoading(false);
	}

	const handleChangeItemPrecio = (e, index) => {
		const newMateriales = values.materiales;
		newMateriales[index].precio = e.target.value;
		let total_aplicacion = Number(values.precio);

		newMateriales.map((item) => {
			total_aplicacion -= Number(item.precio);
		});

		setValues({
			...values,
			materiales: newMateriales,
			total_aplicacion: total_aplicacion,
		});
	}

	const handleChangeTotal = e => {
		let total_aplicacion = Number(e.target.value);
		values.materiales.map(item => {
			total_aplicacion -= Number(item.precio);
		});
		setValues({
			...values,
			precio: e.target.value,
			total_aplicacion: total_aplicacion,
		});
	};

	const handleChangeProductos = (e) => {
		setValues({ ...values, producto: e.target.value });
	}

	const handleChangeFrecuencia = (e) => {
		const frecuencia = e.target.value;
		setValues({
			...values,
			frecuencia: frecuencia,
			producto: frecuencia === frecuenciaPrimeraVezId ? productoCuracionId : values.producto,
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

	const loadMedios = async () => {
		const response = await showAllMedios();
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			setMedios(response.data);
		}
	}

	const loadDermatologos = async () => {
		const response = await findEmployeesByRolIdAvailable(dermatologoRolId, token);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			setDermatologos(response.data);
		}
	}

	const loadMateriales = async () => {
		const response = await showAllMaterials();
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			setMateriales(response.data);
		}
	}

	const loadFrecuencias = async () => {
		const response = await showAllFrecuencias();
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			setFrecuencias(response.data);
		}
	}

	const loadProductos = async () => {
		const response = await findProductoByServicio(curacionServicioId);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			setProductos(response.data);
		}
	}

	const loadAll = async () => {
		setIsLoading(true);
		await loadCuraciones(new Date());
		await loadFrecuencias();
		await loadProductos();
		await loadDermatologos();
		await loadMateriales();
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
							props => <AgendarCuracionContainer
								horarios={horarios}
								onChangeFecha={(e) => handleChangeFecha(e)}
								onChangeFilterDate={(e) => handleChangeFilterDate(e)}
								onChangeHora={(e) => handleChangeHora(e)}
								onChangeMinutos={(e) => handleChangeMinutos(e)}
								onChangeMateriales={(e) => handleChangeMateriales(e)}
								onChangeItemPrecio={handleChangeItemPrecio}
								onChangeObservaciones={(e) => handleChangeObservaciones(e)}
								filterDate={filterDate.fecha_show}
								paciente={paciente}
								disableDate={disableDate}
								onClickAgendar={handleClickAgendar}
								onChangeTiempo={(e) => handleChangeTiempo(e)}
								onChangePaymentMethod={(e) => handleChangePaymentMethod(e)}
								titulo={`CURACIÓN (${dateToString(filterDate.fecha_show)}) (${curaciones.length})`}
								onChangeTotal={handleChangeTotal}
								columns={columns}
								options={options}
								curaciones={curaciones}
								actions={actions}
								components={components}
								curacion={curacion}
								openModal={openModal}
								empleado={empleado}
								onClickCancel={handleCloseModal}
								loadCuraciones={loadCuraciones}
								dermatologos={dermatologos}
								medios={medios}
								formasPago={formasPago}
								colorBase={colorBase}
								onChangeMedio={(e) => handleChangeMedio(e)}
								onChangeDermatologos={(e) => handleChangeDermatologos(e)}
								onCloseVerPagos={handleCloseVerPagos}
								openModalPagos={openModalPagos}
								openModalProxima={openModalProxima}
								openModalImprimirCita={openModalImprimirCita}
								openModalTraspaso={openModalTraspaso}
								datosImpresion={datosImpresion}
								onCloseImprimirConsulta={handleCloseImprimirConsulta}
								onCloseTraspasos={handleCloseTraspasos}
								sucursal={sucursal}
								setOpenAlert={setOpenAlert}
								setMessage={setMessage}
								setFilterDate={setFilterDate}
								onGuardarModalPagos={handleGuardarModalPagos}
								materiales={materiales}
								onChangeFrecuencia={(e) => handleChangeFrecuencia(e)}
								frecuencias={frecuencias}
								onChangeProductos={(e) => handleChangeProductos(e)}
								productos={productos}
								frecuenciaReconsultaId={frecuenciaReconsultaId}
								{...props} />
						}
					</Formik> :
					<Backdrop className={classes.backdrop} open={isLoading} >
						<CircularProgress color="inherit" />
					</Backdrop>
			}
			<Snackbar open={openAlert} autoHideDuration={5000} onClose={handleCloseAlert}>
				<Alert onClose={handleCloseAlert} severity="success">
					{message}
				</Alert>
			</Snackbar>
		</Fragment>
	);
}

export default AgendarCuracion;