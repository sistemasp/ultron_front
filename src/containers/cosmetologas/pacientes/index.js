import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Backdrop, CircularProgress, Select, FormControl, InputLabel, MenuItem } from '@material-ui/core';
import { PacientesContainer } from './pacientes';
import { updatePatient, createPatient, findPatientByPhoneNumber } from '../../../services';
import HistoryIcon from '@material-ui/icons/History';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles(theme => ({
	formControl: {
		width: '100%',
		margin: '5px',
	},
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
	}
}));

const Pacientes = (props) => {

	const classes = useStyles();

	const [openHistoric, setOpenHistoric] = useState(false);
	const [openAlert, setOpenAlert] = useState(false);
	const [paciente, setPaciente] = useState({});
	const [isLoading, setIsLoading] = useState(true);
	const [message, setMessage] = useState('');
	const [severity, setSeverity] = useState('success');

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
			backgroundColor: process.env.REACT_APP_TOP_BAR_COLOR,
			color: '#FFF',
			fontWeight: 'bolder',
			fontSize: '18px'
		},
		exportAllData: true,
		exportButton: false,
		exportDelimiter: ';',
		cellStyle: {
			fontWeight: 'bolder',
			fontSize: '16px',
			padding: '0px',
		},
	}

	const handleClose = () => {
		setPaciente({});
		setOpenHistoric(false);
	};

	const handleCloseAlert = () => {
		setOpenAlert(false);
	};

	const loadPacientes = async () => {
		/*const response = await getAllPatients();
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			setPacientes(response.data);
		}*/
		setIsLoading(false);
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
			return <Fragment>
				<FormControl variant="outlined" className={classes.formControl}>
					<InputLabel id="simple-select-outlined-hora"></InputLabel>
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
		}
	};

	useEffect(() => {
		const loadPacientes = async () => {
			/*const response = await getAllPatients();
			if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				setPacientes(response.data);
			}*/
			setIsLoading(false);
		}
		loadPacientes();
	}, []);

	return (
		<Fragment>
			{
				!isLoading ?
					<PacientesContainer
						columns={columns}
						titulo='PACIENTES'
						actions={actions}
						options={options}
						openHistoric={openHistoric}
						paciente={paciente}
						handleClose={handleClose}
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