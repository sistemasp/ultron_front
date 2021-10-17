import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Backdrop, CircularProgress, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { ListaEsperaContainer } from './lista_espera';
import {
	findCabinaBySucursalId,
	updateCabina,
	breakFreeCabinaByIdPaciente,
	findSalaCuracionBySucursalId,
	updateSalaCuracion,
	breakFreeSalaCuracionByIdPaciente,
} from '../../../services';
import {
	waitingListConsulta,
	updateConsult,
	findConsultById
} from '../../../services/consultas';
import {
	waitingListCuracion,
	findCuracionById,
	updateCuracion,
} from '../../../services/curaciones';
import {
	waitingListEstetica,
	findEsteticaById,
	updateEstetica,
} from '../../../services/esteticas';
import InputIcon from '@material-ui/icons/Input';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import DirectionsWalkIcon from '@material-ui/icons/DirectionsWalk';
import ReplayIcon from '@material-ui/icons/Replay';
import { addZero, generateFolio } from "../../../utils/utils";
import {
	findFacialById,
	waitingFacialList,
	updateFacial,
} from "../../../services/faciales";
import {
	findLaserById,
	updateLaser,
	waitingLaserList,
} from "../../../services/laser";
import {
	findAparatologiaById,
	updateAparatologia,
	waitingAparatologiaList,
} from "../../../services/aparatolgia";
import {
	findDermapenById,
	updateDermapen,
	waitingDermapenList
} from "../../../services/dermapens";
import {
	breakFreeSurgeryByIdPaciente,
	findSurgeryBySucursalIdWaitingList,
	updateSurgery
} from "../../../services/consultorios";

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles(theme => ({
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: '#fff',
	},
	root: {
		width: '100%',
		'& > * + *': {
			marginTop: theme.spacing(2),
		},
	},
	paper: {
		position: 'absolute',
		width: 400,
		backgroundColor: theme.palette.background.paper,
		border: '2px solid #000',
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
	},
	formControl: {
		width: '100%',
		margin: '5px',
	},
}));

const ListaEspera = (props) => {

	const classes = useStyles();

	const sucursalOcciId = process.env.REACT_APP_SUCURSAL_OCCI_ID;
	const sucursalFedeId = process.env.REACT_APP_SUCURSAL_FEDE_ID;
	const sucursalManuelAcunaId = process.env.REACT_APP_SUCURSAL_MANUEL_ACUNA_ID;
	const sucursalRubenDarioId = process.env.REACT_APP_SUCURSAL_RUBEN_DARIO_ID;
	const productoRevisionId = process.env.REACT_APP_PRODUCTO_REVISION_ID;
	const servicioConsultaId = process.env.REACT_APP_CONSULTA_SERVICIO_ID;

	const [openAlert, setOpenAlert] = useState(false);
	const [consultorios, setConsultorios] = useState([]);
	const [cabinas, setCabinas] = useState([]);
	const [salaCuraciones, setSalaCuraciones] = useState([]);
	const [listaEsperaCuraciones, setListaEsperaCuraciones] = useState([]);
	const [listaEsperaConsultas, setListaEsperaConsultas] = useState([]);
	const [listaEsperaTratamientos, setListaEsperaTratamientos] = useState([]);
	const [listaEsperaEstetica, setListaEsperaEstetica] = useState([]);
	const [listaEsperaFaciales, setListaEsperaFaciales] = useState([]);
	const [listaEsperaDermapens, setListaEsperaDermapens] = useState([]);
	const [listaEsperaLasers, setListaEsperaLasers] = useState([]);
	const [listaEsperaAparatologias, setListaEsperaAparatologias] = useState([]);
	const [consultorio, setConsultorio] = useState({});
	const [isLoading, setIsLoading] = useState(true);
	const [message, setMessage] = useState('');
	const [severity, setSeverity] = useState('success');
	const [openModalConsultorioAsignar, setOpenModalConsultorioAsignar] = useState(false);
	const [openModalCabinaAsignar, setOpenModalCabinaAsignar] = useState(false);
	const [openModalSalaCuracionAsignar, setOpenModalSalaCuracionAsignar] = useState(false);
	const [tipo_servicio, setTipoServicio] = useState('');
	const [servicio, setServicio] = useState('');
	const [cambio, setCambio] = useState(false);
	const [paciente, setPaciente] = useState({});

	const {
		sucursal,
		empleado,
		colorBase,
	} = props;

	const columnsConsultorios = [
		{ title: 'CONSULTORIO', field: 'nombre' },
		{ title: 'PACIENTE', field: 'paciente_nombre' },
		{ title: 'DERMATÓLOGO (A)', field: 'dermatologo_nombre' },
	];

	const columnsCabinas = [
		{ title: 'CABINA', field: 'nombre' },
		{ title: 'PACIENTE', field: 'paciente_nombre' },
		{ title: 'COSMETÓLOGA', field: 'cosmetologa_nombre' },
		{ title: 'DERMATÓLOGO (A)', field: 'dermatologo_nombre' },
	];

	const columnsSalaCuraciones = [
		{ title: 'SALA', field: 'nombre' },
		{ title: 'PACIENTE', field: 'paciente_nombre' },
		{ title: 'DERMATÓLOGO (A)', field: 'dermatologo_nombre' },
	];

	const columnsEspera = [
		{ title: 'PACIENTE', field: 'paciente_nombre' },
		{ title: 'SERVICIO', field: 'servicio.nombre' },
		{ title: 'HORA LLEGADA', field: 'hora_llegada' },
		{ title: 'CONSECUTIVO', field: 'consecutivo' },
		{ title: 'DERMATÓLOGO (A)', field: 'dermatologo_nombre' },
	];

	const columnsEsperaConsultas = [
		{ title: 'PACIENTE', field: 'paciente_nombre' },
		{ title: 'HORA LLEGADA', field: 'hora_llegada' },
		{ title: 'PRODUCTO', field: 'producto.nombre' },
		{ title: 'DERMATÓLOGO (A)', field: 'dermatologo_nombre' },
		{ title: 'CONSECUTIVO', field: 'consecutivo' },
	];

	const optionsConsultorio = {
		rowStyle: rowData => {
			return {
				fontWeight: 'bolder',
				color: rowData.disponible ? process.env.REACT_APP_LIBRE_COLOR : process.env.REACT_APP_OCUPADO_COLOR
			};
		},
		headerStyle: {
			backgroundColor: colorBase,
			color: '#FFF',
			fontWeight: 'bolder',
			fontSize: '18px'
		},
		exportAllData: true,
		exportButton: false,
		exportDelimiter: ';',
		paging: false,
	}

	const optionsEspera = {
		rowStyle: rowData => {
			return {
				fontWeight: 'bolder',
				color: rowData.servicio.color
			};
		},
		headerStyle: {
			backgroundColor: colorBase,
			color: '#FFF',
			fontWeight: 'bolder',
			fontSize: '18px'
		},
		exportAllData: true,
		exportButton: false,
		exportDelimiter: ';',
		paging: false,
	}

	const asistioStatusId = process.env.REACT_APP_ASISTIO_STATUS_ID;
	const atendidoStatusId = process.env.REACT_APP_ATENDIDO_STATUS_ID;
	const consultaServicioId = process.env.REACT_APP_CONSULTA_SERVICIO_ID;
	const enProcedimientoStatusId = process.env.REACT_APP_EN_PROCEDIMIENTO_STATUS_ID;
	const enConsultorioStatusId = process.env.REACT_APP_EN_CONSULTORIO_STATUS_ID;
	const curacionServicioId = process.env.REACT_APP_CURACION_SERVICIO_ID;
	const facialServicioId = process.env.REACT_APP_FACIAL_SERVICIO_ID;
	const dermapenServicioId = process.env.REACT_APP_DERMAPEN_SERVICIO_ID;
	const laserServicioId = process.env.REACT_APP_LASER_SERVICIO_ID;
	const aparatologiaServicioId = process.env.REACT_APP_APARATOLOGIA_SERVICIO_ID;

	const loadConsultorios = async () => {
		const response = await findSurgeryBySucursalIdWaitingList(sucursal, empleado.access_token);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			response.data.forEach(item => {
				item.folio = generateFolio(item);
				item.paciente_nombre = item.paciente ? `${item.paciente.nombres} ${item.paciente.apellidos}` : 'LIBRE';
				item.dermatologo_nombre = item.dermatologo ? item.dermatologo.nombre : 'SIN DERMATÓLOGO';
			});
			setConsultorios(response.data);
		}
	}

	const loadListaEsperaConsultas = async () => {
		const response = await waitingListConsulta(sucursal, asistioStatusId, empleado.access_token);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			const filterData = response.data.filter(item => {
				return (sucursal === sucursalManuelAcunaId || sucursal === sucursalRubenDarioId) ? true : item.pagado;
			});
			filterData.forEach(item => {
				item.folio = generateFolio(item);
				item.paciente_nombre = item.paciente ? `${item.paciente.nombres} ${item.paciente.apellidos}` : 'ALGUN ERROR ESTA PASANDO';
				item.dermatologo_nombre = item.dermatologo ? item.dermatologo.nombre : 'DIRECTO';
				item.servicio.color = item.producto._id === productoRevisionId ? '#43CD30' : item.servicio.color;
			});
			setListaEsperaConsultas(filterData);
		}
	}

	const loadListaEsperaFaciales = async () => {
		const response = await waitingFacialList(sucursal, asistioStatusId, empleado.access_token);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			const filterData = response.data.filter(item => {
				return (sucursal === sucursalManuelAcunaId || sucursal === sucursalRubenDarioId) ? true : item.pagado;
			});
			filterData.forEach(item => {
				item.folio = generateFolio(item);
				item.paciente_nombre = item.paciente ? `${item.paciente.nombres} ${item.paciente.apellidos}` : 'ALGUN ERROR ESTA PASANDO';
				item.cosmetologa_nombre = item.cosmetologa ? item.cosmetologa.nombre : 'SIN ASIGNAR';
				item.dermatologo_nombre = item.dermatologo ? item.dermatologo.nombre : 'DIRECTO';
			});
			setListaEsperaFaciales(filterData);
		}
	}

	const loadListaEsperaDermapens = async () => {
		const response = await waitingDermapenList(sucursal, asistioStatusId, empleado.access_token);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			const filterData = response.data.filter(item => {
				return (sucursal === sucursalManuelAcunaId || sucursal === sucursalRubenDarioId) ? true : item.pagado;
			});
			filterData.forEach(item => {
				item.folio = generateFolio(item);
				item.paciente_nombre = item.paciente ? `${item.paciente.nombres} ${item.paciente.apellidos}` : 'ALGUN ERROR ESTA PASANDO';
				item.dermatologo_nombre = item.dermatologo ? item.dermatologo.nombre : 'DIRECTO';
			});
			setListaEsperaDermapens(filterData);
		}
	}

	const loadListaEsperaAparatologias = async () => {
		const response = await waitingAparatologiaList(sucursal, asistioStatusId, empleado.access_token);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			const filterData = response.data.filter(item => {
				return (sucursal === sucursalManuelAcunaId || sucursal === sucursalRubenDarioId) ? true : item.pagado;
			});
			filterData.forEach(item => {
				item.folio = generateFolio(item);
				item.paciente_nombre = item.paciente ? `${item.paciente.nombres} ${item.paciente.apellidos}` : 'ALGUN ERROR ESTA PASANDO';
				item.cosmetologa_nombre = item.cosmetologa ? item.cosmetologa.nombre : 'SIN ASIGNAR';
				item.dermatologo_nombre = item.dermatologo ? item.dermatologo.nombre : 'DIRECTO';
			});
			setListaEsperaAparatologias(filterData);
		}
	}

	const loadSalaCuraciones = async () => {
		const response = await findSalaCuracionBySucursalId(sucursal, empleado.access_token);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			response.data.forEach(item => {
				item.folio = generateFolio(item);
				item.paciente_nombre = item.paciente ? `${item.paciente.nombres} ${item.paciente.apellidos}` : 'LIBRE';
				item.dermatologo_nombre = item.dermatologo ? item.dermatologo.nombre : 'SIN DERMATÓLOGO';
			});
			setSalaCuraciones(response.data);
		}
	}

	const loadListaEsperaCuraciones = async () => {
		const response = await waitingListCuracion(sucursal, asistioStatusId, empleado.access_token);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			const filterData = response.data.filter(item => {
				return (sucursal === sucursalManuelAcunaId || sucursal === sucursalRubenDarioId) ? true : item.pagado;
			});
			filterData.forEach(item => {
				item.folio = generateFolio(item);
				item.paciente_nombre = item.paciente ? `${item.paciente.nombres} ${item.paciente.apellidos}` : 'LIBRE';
				item.dermatologo_nombre = item.dermatologo ? item.dermatologo.nombre : 'SIN DERMATÓLOGO';
			});
			setListaEsperaCuraciones(filterData);
		}
	}

	const loadListaEsperaEstetica = async () => {
		const response = await waitingListEstetica(sucursal, asistioStatusId, empleado.access_token);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			const filterData = response.data.filter(item => {
				return (sucursal === sucursalManuelAcunaId || sucursal === sucursalRubenDarioId) ? true : item.pagado;
			});
			filterData.forEach(item => {
				item.folio = generateFolio(item);
				item.paciente_nombre = item.paciente ? `${item.paciente.nombres} ${item.paciente.apellidos}` : 'ALGUN ERROR ESTA PASANDO';
				item.dermatologo_nombre = item.dermatologo ? item.dermatologo.nombre : 'DIRECTO';
			});
			setListaEsperaEstetica(filterData);
			setIsLoading(false);
		}
	}

	const handleOnClickConsultorioAsignarPaciente = (event, rowData) => {
		setTipoServicio(rowData.servicio._id);
		setServicio(rowData._id);
		setPaciente(rowData.paciente);
		setCambio(false);
		if (rowData.servicio._id === servicioConsultaId) {
			setOpenModalConsultorioAsignar(true);
		} else {
			setOpenModalSalaCuracionAsignar(true);
		}
	}

	const handleOnClickCabinaAsignarPaciente = (event, rowData) => {
		setTipoServicio(rowData.servicio._id);
		setServicio(rowData._id);
		setPaciente(rowData.paciente);
		setCambio(false);
		setOpenModalCabinaAsignar(true);
	}

	const handleOnClickSalaCuracionAsignarPaciente = (event, rowData) => {
		setTipoServicio(rowData.servicio._id);
		setServicio(rowData._id);
		setPaciente(rowData.paciente);
		setCambio(false);
	}

	const handleOnConsultorioCambiarPaciente = async (event, rowData) => {
		setIsLoading(true);
		rowData.disponible = true;

		const response = await updateSurgery(rowData._id, rowData, empleado.access_token);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			setPaciente(rowData.paciente);
			setServicio(rowData.servicio);
			setTipoServicio(rowData.tipo_servicio);
			setCambio(true);
			setOpenModalConsultorioAsignar(true);
			await breakFreeSurgeryByIdPaciente(rowData._id, empleado.access_token);
		};
		setIsLoading(false);
	}

	const handleOnCabinaCambiarPaciente = async (event, rowData) => {
		setIsLoading(true);
		const response = await breakFreeCabinaByIdPaciente(rowData._id, empleado.access_token);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			rowData.disponible = true;
			setPaciente(rowData.paciente);
			setServicio(rowData.servicio);
			setTipoServicio(rowData.tipo_servicio);
			setCambio(true);
			setOpenModalCabinaAsignar(true);
			//await updateCabina(rowData._id, rowData);
		}
		setIsLoading(false);
	}

	const handleOnSalaCuracionCambiarPaciente = async (event, rowData) => {
		setIsLoading(true);
		const response = await breakFreeSalaCuracionByIdPaciente(rowData._id, empleado.access_token);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			//rowData.disponible = true;
			setPaciente(rowData.paciente);
			setServicio(rowData.servicio);
			setTipoServicio(rowData.tipo_servicio);
			setCambio(true);
			setOpenModalSalaCuracionAsignar(true);
			//await updateSalaCuracion(rowData._id, rowData);
		}
		setIsLoading(false);
	}

	const handleOnClickLiberarCabina = async (event, rowData) => {
		const dateNow = new Date();

		let responseCita;
		switch (rowData.tipo_servicio) {
			case facialServicioId:
				responseCita = await findFacialById(rowData.servicio, empleado.access_token);
				break;
			case dermapenServicioId:
				responseCita = await findDermapenById(rowData.servicio, empleado.access_token);
				break;
			case laserServicioId:
				responseCita = await findLaserById(rowData.servicio, empleado.access_token);
				break;
			case aparatologiaServicioId:
				responseCita = await findAparatologiaById(rowData.servicio, empleado.access_token);
				break;
		}

		if (responseCita && `${responseCita.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			const cita = responseCita.data;
			let updateCita = cita;
			updateCita.status = atendidoStatusId;
			updateCita.hora_salida = `${addZero(dateNow.getHours())}:${addZero(dateNow.getMinutes())}`;
			switch (rowData.tipo_servicio) {
				case facialServicioId:
					responseCita = await updateFacial(cita._id, updateCita, empleado.access_token);
					break;
				case dermapenServicioId:
					responseCita = await updateDermapen(cita._id, updateCita, empleado.access_token);
					break;
				case laserServicioId:
					responseCita = await updateLaser(cita._id, updateCita, empleado.access_token);
					break;
				case aparatologiaServicioId:
					responseCita = await updateAparatologia(cita._id, updateCita, empleado.access_token);
					break;
			}
			rowData.disponible = true;
			await updateCabina(rowData._id, rowData, empleado.access_token);
			const response = await breakFreeCabinaByIdPaciente(rowData._id, empleado.access_token);
			if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				setOpenAlert(true);
				setMessage('SALIO EL PACIENTE');
				await loadAll();
			}
		}
	}

	const handleOnClickLiberarConsultorio = async (event, rowData) => {
		const dateNow = new Date();
		const responseCita = await findConsultById(rowData.servicio, empleado.access_token);

		if (responseCita && `${responseCita.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			const cita = responseCita.data;
			let updateCita = cita;
			updateCita.status = atendidoStatusId;
			updateCita.hora_salida = `${addZero(dateNow.getHours())}:${addZero(dateNow.getMinutes())}`;

			await updateConsult(cita._id, updateCita, empleado.access_token);

			rowData.disponible = true;
			await updateSurgery(rowData._id, rowData);
			const response = await breakFreeSurgeryByIdPaciente(rowData._id, empleado.access_token);
			if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				setOpenAlert(true);
				setMessage('SALIO EL PACIENTE');
				await loadAll();
			}
		}
	}

	const handleOnClickRegresarListaEspera = async (event, rowData) => {
		const dateNow = new Date();
		const responseCita = await findConsultById(rowData.servicio, empleado.access_token);

		if (responseCita && `${responseCita.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			const cita = responseCita.data;
			let updateCita = cita;
			updateCita.status = asistioStatusId;
			updateCita.hora_atencion = '--:--';

			await updateConsult(cita._id, updateCita, empleado.access_token);

			rowData.disponible = true;
			await updateSurgery(rowData._id, rowData);
			const response = await breakFreeSurgeryByIdPaciente(rowData._id, empleado.access_token);
			if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				setOpenAlert(true);
				setMessage('EL PACIENTE REGRESO A LA LISTA DE ESPERA');
				await loadAll();
			}
		}
	}

	const handleOnClickLiberarSalaCuracion = async (event, rowData) => {
		const dateNow = new Date();
		const responseServicio = rowData.tipo_servicio === curacionServicioId ? await findCuracionById(rowData.servicio, empleado.access_token) : await findEsteticaById(rowData.servicio, empleado.access_token);
		//const responseServicio = await findCuracionById(rowData.servicio);
		if (`${responseServicio.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			const currentService = responseServicio.data;
			let updateData = currentService;
			updateData.status = atendidoStatusId;
			updateData.hora_salida = `${addZero(dateNow.getHours())}:${addZero(dateNow.getMinutes())}`;
			rowData.tipo_servicio === curacionServicioId ? await updateCuracion(currentService._id, updateData, empleado.access_token) : await updateEstetica(currentService._id, updateData, empleado.access_token);
			rowData.disponible = true;
			await updateSalaCuracion(rowData._id, rowData, empleado.access_token);
			const response = await breakFreeSalaCuracionByIdPaciente(rowData._id, empleado.access_token);
			if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				setOpenAlert(true);
				setMessage('SALIO EL PACIENTE');
				await loadAll();
			}
		}
	}

	const actionsEsperaConsultorio = [
		//new Date(anio, mes - 1, dia) < filterDate.fecha_show  ? 
		{
			icon: InputIcon,
			tooltip: 'ASIGNAR A CONSULTORIO',
			onClick: handleOnClickConsultorioAsignarPaciente
		} //: ''
	];

	const actionsEsperaCabina = [
		//new Date(anio, mes - 1, dia) < filterDate.fecha_show  ? 
		{
			icon: InputIcon,
			tooltip: 'ASIGNAR A CABINA',
			onClick: handleOnClickCabinaAsignarPaciente
		} //: ''
	];

	const actionsEsperaSalaCuracion = [
		//new Date(anio, mes - 1, dia) < filterDate.fecha_show  ? 
		{
			icon: InputIcon,
			tooltip: 'ASIGNAR A SALA DE CURACION',
			onClick: handleOnClickSalaCuracionAsignarPaciente
		} //: ''
	];

	const actionsConsultorio = [
		//new Date(anio, mes - 1, dia) < filterDate.fecha_show  ? 
		rowData => {
			return (!rowData.disponible && rowData.consultaId) ? {
				icon: DirectionsWalkIcon,
				tooltip: 'SALIDA PACIENTE',
				onClick: handleOnClickLiberarConsultorio
			} : ''
		},
		rowData => (
			(!rowData.disponible && rowData.consultaId) ? {
				icon: InputIcon,
				tooltip: 'CAMBIAR DE CONSULTORIO',
				onClick: handleOnConsultorioCambiarPaciente
			} : ''
		),
		rowData => {
			return (!rowData.disponible && rowData.consultaId) ? {
				icon: ReplayIcon,
				tooltip: 'REGRESAR A LA LISTA DE ESPERA',
				onClick: handleOnClickRegresarListaEspera
			} : ''
		},
	];

	const onChangeActionsConsultorio = (e, rowData) => {
		const action = e.target.value;
		switch (action) {
			case 'SALIDA PACIENTE':
				handleOnClickLiberarConsultorio(e, rowData);
				break;
			case 'CAMBIAR DE CONSULTORIO':
				handleOnConsultorioCambiarPaciente(e, rowData);
				break;
		}
	}

	const componentsConsultorio = {
		Actions: props => {
			return <Fragment>
				<FormControl variant="outlined" className={classes.formControl}>
					<InputLabel id="simple-select-outlined"></InputLabel>
					<Select
						labelId="simple-select-outlined-actions"
						id="simple-select-outlined-actions"
						onChange={(e) => onChangeActionsConsultorio(e, props.data)}
						label="ACCIONES">
						{
							props.actions.map((item, index) => {
								return <MenuItem
									key={index}
									value={item.tooltip}
								>{item.tooltip}</MenuItem>
							})
						}
					</Select>
				</FormControl>
			</Fragment>
		}
	};

	const actionsCabina = [
		//new Date(anio, mes - 1, dia) < filterDate.fecha_show  ? 
		rowData => (
			!rowData.disponible ? {
				icon: DirectionsWalkIcon,
				tooltip: 'SALIDA PACIENTE',
				onClick: handleOnClickLiberarCabina
			} : ''),
		rowData => (
			!rowData.disponible ? {
				icon: InputIcon,
				tooltip: 'CAMBIAR DE CABINA',
				onClick: handleOnCabinaCambiarPaciente
			} : ''),
	];

	const actionsSalaCuracion = [
		//new Date(anio, mes - 1, dia) < filterDate.fecha_show  ? 
		rowData => (
			!rowData.disponible ? {
				icon: DirectionsWalkIcon,
				tooltip: 'SALIDA PACIENTE',
				onClick: handleOnClickLiberarSalaCuracion
			} : ''),
		rowData => (
			!rowData.disponible ? {
				icon: InputIcon,
				tooltip: 'CAMBIAR SALA DE CURACIÓN',
				onClick: handleOnSalaCuracionCambiarPaciente
			} : ''),
	];

	const handleClose = () => {
		setConsultorio({});
		setOpenModalConsultorioAsignar(false);
		setOpenModalCabinaAsignar(false);
		setOpenModalSalaCuracionAsignar(false);
	};

	const handleCloseAlert = () => {
		setOpenAlert(false);
	};

	const loadCabinas = async () => {
		const response = await findCabinaBySucursalId(sucursal);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			response.data.forEach(item => {
				item.paciente_nombre = item.paciente ? `${item.paciente.nombres} ${item.paciente.apellidos}` : '';
				item.cosmetologa_nombre = item.cosmetologa ? item.cosmetologa.nombre : 'SIN ASIGNAR';
				item.dermatologo_nombre = item.dermatologo ? item.dermatologo.nombre : 'DIRECTO';
			});
			setCabinas(response.data);
		}
	}

	const loadAll = async () => {
		setIsLoading(true);
		await loadConsultorios();
		await loadListaEsperaConsultas();
		await loadListaEsperaFaciales();
		await loadListaEsperaAparatologias();
		await loadListaEsperaDermapens();
		await loadCabinas();
		await loadSalaCuraciones();
		await loadListaEsperaEstetica();
		await loadListaEsperaCuraciones();
		setIsLoading(false);
	}

	const handleClickActualizar = (event, rowData) => {
		loadAll();
	}

	useEffect(() => {
		loadAll();
	}, []);

	return (
		<Fragment>
			{
				!isLoading ?
					<ListaEsperaContainer
						empleado={empleado}
						columnsConsultorios={columnsConsultorios}
						columnsEspera={columnsEspera}
						columnsCabinas={columnsCabinas}
						columnsSalaCuraciones={columnsSalaCuraciones}
						columnsEsperaConsultas={columnsEsperaConsultas}
						tituloConsultorios='CONSULTORIOS'
						tituloCabinas='CABINAS'
						tituloSalaCuracion='SALA CURACION'
						tituloEsperaConsultas={`CONSULTAS EN ESPERA (${listaEsperaConsultas.length + listaEsperaEstetica.length + listaEsperaCuraciones.length})`}
						tituloEsperaTratamientos={`TRATAMIENTOS EN ESPERA (${listaEsperaFaciales.length + listaEsperaLasers.length + listaEsperaAparatologias.length + listaEsperaDermapens.length})`}
						tituloEsperaSalaCuracion={`CURACION EN ESPERA (${listaEsperaEstetica.length + listaEsperaCuraciones.length})`}
						optionsEspera={optionsEspera}
						optionsConsultorio={optionsConsultorio}
						consultorio={consultorio}
						consultorios={consultorios}
						cabinas={cabinas}
						listaEsperaConsultas={listaEsperaConsultas}
						listaEsperaLasers={listaEsperaLasers}
						listaEsperaAparatologias={listaEsperaAparatologias}
						listaEsperaFaciales={listaEsperaFaciales}
						listaEsperaDermapens={listaEsperaDermapens}
						listaEsperaCuraciones={listaEsperaCuraciones}
						actionsEsperaConsultorio={actionsEsperaConsultorio}
						actionsEsperaCabina={actionsEsperaCabina}
						actionsConsultorio={actionsConsultorio}
						actionsCabina={actionsCabina}
						openModalConsultorioAsignar={openModalConsultorioAsignar}
						openModalCabinaAsignar={openModalCabinaAsignar}
						openModalSalaCuracionAsignar={openModalSalaCuracionAsignar}
						tipo_servicio={tipo_servicio}
						servicio={servicio}
						handleClose={handleClose}
						cambio={cambio}
						loadAll={loadAll}
						sucursal={sucursal}
						setOpenAlert={setOpenAlert}
						setMessage={setMessage}
						paciente={paciente}
						salaCuraciones={salaCuraciones}
						actionsSalaCuracion={actionsSalaCuracion}
						listaEsperaEstetica={listaEsperaEstetica}
						actionsEsperaSalaCuracion={actionsEsperaSalaCuracion}
						componentsConsultorio={componentsConsultorio}
						colorBase={colorBase}
						onClickActualizar={handleClickActualizar}
					/> :
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

export default ListaEspera;