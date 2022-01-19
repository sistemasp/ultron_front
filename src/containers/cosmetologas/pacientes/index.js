import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Backdrop, CircularProgress, Select, FormControl, InputLabel, MenuItem } from '@material-ui/core';
import { PacientesContainer } from './pacientes';
import { 
	updatePatient,
	createPatient,
	findPatientByPhoneNumber
} from '../../../services/pacientes';
import EditIcon from '@material-ui/icons/Edit';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';
import TodayIcon from '@material-ui/icons/Today';
import HistoryIcon from '@material-ui/icons/History';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { findCabinaBySucursalId } from "../../../services";
import myStyles from "../../../css";

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Pacientes = (props) => {

	const classes = myStyles();

	const [open, setOpen] = useState(false);
	const [openHistoric, setOpenHistoric] = useState(false);
	const [openAlert, setOpenAlert] = useState(false);
	const [paciente, setPaciente] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const [message, setMessage] = useState('');
	const [severity, setSeverity] = useState('success');

	const {
		empleado,
		onClickAgendar,
		onClickAgendarConsulta,
		onClickAgendarFaciales,
		onClickAgendarLaser,
		onClickAgendarAparatologia,
		onClickAgendarDermapen,
		colorBase,
	} = props;

	const columns = [
		{ title: 'NOMBRES', field: 'nombres' },
		{ title: 'APELLIDOS', field: 'apellidos' },
		{ title: 'TELÉFONO', field: 'telefono' },
		{ title: 'EMAIL', field: 'email' },
		{ title: 'SEXO', field: 'sexo.nombre' },
		{ title: 'FECHA DE NACIMIENTO', field: 'fecha_nacimiento' },
	];

	const options = {
		headerStyle: {
			backgroundColor: colorBase,
			color: '#FFF',
			fontWeight: 'bolder',
			fontSize: '18px',
			textAlign: 'center',
		},
		cellStyle: {
			fontWeight: 'bolder',
			fontSize: '16px',
			padding: '5px',
			textAlign: 'center',
		},
		exportAllData: true,
		exportButton: false,
		exportDelimiter: ';',
	}

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setPaciente({});
		setOpen(false);
		setOpenHistoric(false);
	};

	const handleCloseAlert = () => {
		setOpenAlert(false);
	};

	const handleOnClickGuardar = async (e, val) => {
		setIsLoading(true);

		if (!val.familiar) {
			const existPatient = paciente._id ? '' : await findPatientByPhoneNumber(val.telefono, empleado.access_token);

			if (`${existPatient.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				if (existPatient.data.length > 0) {
					setSeverity('warning');
					setOpenAlert(true);
					setMessage('YA EXISTE UN REGISTRO CON EL MISMO NUMERO DE TELÉFONO');
					setIsLoading(false);
					handleClose();
					return;
				}
			}
		}

		const response = paciente._id ? await updatePatient(paciente._id, val,  empleado.access_token) : await createPatient(val, empleado.access_token);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK
			|| `${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
			setSeverity('success');
			setOpenAlert(true);
			setMessage(paciente._id ? 'PACIENTE ACTUALIZADO' : 'PACIENTE CREADO');
		}

		handleClose();

		setIsLoading(false);
	}

	const handleOnClickGuardarAgendar = async (e, val) => {
		setIsLoading(true);
		const existPatient = paciente._id ? '' : await findPatientByPhoneNumber(val.telefono, empleado.access_token);
		setOpenAlert(true);

		if (`${existPatient.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			if (existPatient.data.length > 0) {
				setSeverity('warning');
				setMessage('YA EXISTE UN REGISTRO CON EL MISMO NUMERO DE TELÉFONO');
				setIsLoading(false);
				handleClose();
				return;
			}
		}

		const response = paciente._id ? await updatePatient(paciente._id, val, empleado.access_token) : await createPatient(val, empleado.access_token);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK
			|| `${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
			setSeverity('success');
			onClickAgendar(e, val);
			setMessage(paciente._id ? 'PACIENTE ACTUALIZADO' : 'PACIENTE CREADO');
		}

		handleClose();
		setIsLoading(false);
	}

	const handleOnClickEditar = (event, rowData) => {
		setPaciente(rowData);
		setOpen(true);
	}

	const handleClickHistorico = (event, rowData) => {
		setPaciente(rowData);
		setOpenHistoric(true);
	}

	const actions = [
		{
			icon: HistoryIcon,
			tooltip: 'HISTÓRICO',
			onClick: handleClickHistorico
		}
	];

	const onChangeActions = (e, rowData) => {
		const action = e.target.value;
		switch (action) {
			case 'HISTÓRICO':
				handleClickHistorico(e, rowData);
				break;
		}
	}

	const components = {
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
									return <MenuItem
										key={index}
										value={item.tooltip}
									>{item.tooltip}</MenuItem>
								})
							}
						</Select>
					</FormControl>
				</Fragment>
				: ''
		}
	};

	return (
		<Fragment>
			{
				!isLoading ?
					<PacientesContainer
						empleado={empleado}
						columns={columns}
						titulo='PACIENTES'
						actions={actions}
						options={options}
						open={open}
						openHistoric={openHistoric}
						paciente={paciente}
						telefono={paciente.telefono}
						onClickGuardar={handleOnClickGuardar}
						onClickGuardarAgendar={handleOnClickGuardarAgendar}
						handleOpen={handleOpen}
						handleClose={handleClose}
						colorBase={colorBase}
						components={components} /> :
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

export default Pacientes;