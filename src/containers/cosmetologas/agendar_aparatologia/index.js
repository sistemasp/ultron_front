import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from '@material-ui/core/styles';
import {
	findScheduleByDateAndSucursalAndService,
	showAllTipoCitas,
	createConsecutivo,
	showAllMedios,
	showAllFrecuencias,
	showAllMetodoPago,
} from "../../../services";
import {
	findTreatmentByServicio,
} from "../../../services/tratamientos";
import {
	findAreasByTreatmentServicio,
} from "../../../services/areas";
import { Backdrop, CircularProgress, Snackbar } from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';
import { Formik } from 'formik';
import EditIcon from '@material-ui/icons/Edit';
import * as Yup from "yup";
import { toFormatterCurrency, addZero, generateFolio, dateToString } from "../../../utils/utils";
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import PrintIcon from '@material-ui/icons/Print';
import { AgendarAparatologiaContainer } from "./agendar_aparatologia";
import { createAparatologia, findAparatologiaByDateAndSucursal, updateAparatologia } from "../../../services/aparatolgia";
import EventAvailableIcon from '@material-ui/icons/EventAvailable';

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

	const {
		info,
		empleado,
		setPacienteAgendado,
		sucursal,
	} = props;

	const paciente = info.paciente ? info.paciente : info;

	const dermatologoRolId = process.env.REACT_APP_DERMATOLOGO_ROL_ID;
	const promovendedorRolId = process.env.REACT_APP_PROMOVENDEDOR_ROL_ID;
	const cosmetologaRolId = process.env.REACT_APP_COSMETOLOGA_ROL_ID;
	const pendienteStatusId = process.env.REACT_APP_PENDIENTE_STATUS_ID;
	const atendidoStatusId = process.env.REACT_APP_ATENDIDO_STATUS_ID;
	const sucursalManuelAcunaId = process.env.REACT_APP_SUCURSAL_MANUEL_ACUNA_ID;
	const sucursalOcciId = process.env.REACT_APP_SUCURSAL_OCCI_ID;
	const sucursalFedeId = process.env.REACT_APP_SUCURSAL_FEDE_ID;
	const dermatologoDirectoId = process.env.REACT_APP_DERMATOLOGO_DIRECTO_ID;
	const directoTipoCitaId = process.env.REACT_APP_TIPO_CITA_DIRECTO_ID;
	const servicioAparatologiaId = process.env.REACT_APP_APARATOLOGIA_SERVICIO_ID;
	const cosmetologaSinAsignarId = process.env.REACT_APP_COSMETOLOGA_SIN_ASIGNAR_ID;
	const promovendedorSinPromovendedorId = process.env.REACT_APP_PROMOVENDEDOR_SIN_PROMOVENDEDOR_ID;
	const frecuenciaPrimeraVezId = process.env.REACT_APP_FRECUENCIA_PRIMERA_VEZ_ID;
	const efectivoMetodoPagoId = process.env.REACT_APP_FORMA_PAGO_EFECTIVO;

	const [openAlert, setOpenAlert] = useState(false);
	const [message, setMessage] = useState('');
	const [severity, setSeverity] = useState('success');
	const [servicios, setServicios] = useState([]);
	const [formasPago, setFormasPago] = useState([]);
	const [tratamientos, setTratamientos] = useState([]);
	const [horarios, setHorarios] = useState([]);
	const [dermatologos, setDermatologos] = useState([]);
	const [promovendedores, setPromovendedores] = useState([]);
	const [cosmetologas, setCosmetologas] = useState([]);
	const [tipoCitas, setTipoCitas] = useState([]);
	const [medios, setMedios] = useState([]);
	const [frecuencias, setFrecuencias] = useState([]);
	const [productos, setProductos] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [disableDate, setDisableDate] = useState(true);
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
		frecuencia: frecuenciaPrimeraVezId,
		forma_pago: efectivoMetodoPagoId,
	});
	const [aparatologias, setAparatologia] = useState([]);
	const [areas, setAreas] = useState([]);
	const [openModal, setOpenModal] = useState(false);
	const [openModalProxima, setOpenModalProxima] = useState(false);
	const [cita, setCita] = useState();
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
		{ title: 'FOLIO', field: 'folio' },
		{ title: 'HORA', field: 'hora' },
		{ title: 'PACIENTE', field: 'paciente_nombre' },
		{ title: 'TELÉFONO', field: 'paciente.telefono' },
		{ title: 'TRATAMIENTOS (ÁREAS)', field: 'show_tratamientos' },
		{ title: 'QUIÉN AGENDA', field: 'quien_agenda.nombre' },
		{ title: 'MEDIO', field: 'medio.nombre' },
		{ title: 'QUIÉN CONFIRMA LLAMADA', field: 'quien_confirma_llamada.nombre' },
		{ title: 'QUIÉN CONFIRMA ASISTENCIA', field: 'quien_confirma_asistencia.nombre' },
		{ title: 'PROMOVENDEDOR (A)', field: 'promovendedor_nombre' },
		{ title: 'DERMATÓLOGO (A)', field: 'dermatologo_nombre' },
		{ title: 'TIPO CITA', field: 'tipo_cita.nombre' },
		{ title: 'COSMETÓLOGA', field: 'cosmetologa_nombre' },
		{ title: 'ESTADO', field: 'status.nombre' },
		{ title: 'PRECIO', field: 'precio_moneda' },
		{ title: 'TOTAL', field: 'total_moneda' },
		{ title: 'OBSERVACIONES', field: 'observaciones' },
	];

	const options = {
		rowStyle: rowData => {
			return {
				color: rowData.status.color,
				backgroundColor: rowData.pagado ? process.env.REACT_APP_PAGADO_COLOR : ''
			};
		},
		headerStyle: {
			backgroundColor: process.env.REACT_APP_TOP_BAR_COLOR,
			color: '#FFF',
			fontWeight: 'bolder',
			fontSize: '18px'
		},
		paging: false,
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
		const response = await findAparatologiaByDateAndSucursal(filterDate.getDate(), filterDate.getMonth(), filterDate.getFullYear(), sucursal);
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
				item.show_tratamientos = item.tratamientos.map(tratamiento => {
					const show_areas = tratamiento.areasSeleccionadas.map(area => {
						return `${area.nombre}`;
					});
					return `►${tratamiento.nombre}(${show_areas}) `;
				});
			});
			setAparatologia(response.data);
		}
	}

	const handleCloseAlert = () => {
		setOpenAlert(false);
	};

	const handleCloseModal = () => {
		setOpenModal(false);
		setTratamientos([]);
		setOpenModalProxima(false);
	};


	const actions = [
	/*
		//new Date(anio, mes - 1, dia) < filterDate.fecha_hora  ? 
		{
			icon: EditIcon,
			tooltip: 'Editar cita',
			onClick: handleOnClickEditarCita
		}, //: ''
		
	*/];

	useEffect(() => {

		const loadAparatologias = async () => {
			const response = await findAparatologiaByDateAndSucursal(date.getDate(), date.getMonth(), date.getFullYear(), sucursal);
			if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				await response.data.forEach(item => {
					item.folio = generateFolio(item);
					const fecha = new Date(item.fecha_hora);
					item.hora = `${addZero(fecha.getHours())}:${addZero(fecha.getMinutes())}`;
					item.precio_moneda = toFormatterCurrency(item.precio);
					item.total_moneda = toFormatterCurrency(item.total);
					item.paciente_nombre = `${item.paciente.nombres} ${item.paciente.apellidos}`;
					item.promovendedor_nombre = item.promovendedor ? item.promovendedor.nombre : 'SIN ASIGNAR';
					item.cosmetologa_nombre = item.cosmetologa ? item.cosmetologa.nombre : 'SIN ASIGNAR';
					item.dermatologo_nombre = item.dermatologo ? item.dermatologo.nombre : 'DIRECTO';
					item.show_tratamientos = item.tratamientos.map(tratamiento => {
						const show_areas = tratamiento.areasSeleccionadas.map(area => {
							return `${area.nombre}`;
						});
						return `►${tratamiento.nombre}(${show_areas}) `;
					});
				});
				setAparatologia(response.data);
			}
			setIsLoading(false);
		}

		setIsLoading(true);
		loadAparatologias();
	}, [sucursal]);

	return (
		<Fragment>
			{
				!isLoading ?
					<AgendarAparatologiaContainer
						onChangeFilterDate={(e) => handleChangeFilterDate(e)}
						filterDate={filterDate.fecha_show}
						titulo={`APARATOLOGIAS (${dateToString(filterDate.fecha_show)})`}
						columns={columns}
						options={options}
						aparatologias={aparatologias}
						actions={actions}
						cita={cita}
						openModal={openModal}
						empleado={empleado}
						onClickCancel={handleCloseModal}
						loadAparatologias={loadAparatologias}
						openModalPagos={openModalPagos}
						openModalImprimirCita={openModalImprimirCita}
						datosImpresion={datosImpresion}
						sucursal={sucursal}
						setOpenAlert={setOpenAlert}
						setMessage={setMessage}
						setSeverity={setSeverity}
						setFilterDate={setFilterDate}
						dermatologoDirectoId={dermatologoDirectoId} /> :
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