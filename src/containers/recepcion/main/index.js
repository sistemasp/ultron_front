import React, { useState, Fragment, useEffect } from "react";
import { MainContainer } from "./main";
import { Snackbar } from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';
import { findTurnoActualBySucursal } from "../../../services/corte";

const Alert = (props) => {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const MenuMainRecepcion = (props) => {

	const [pacienteAgendado, setPacienteAgendado] = useState({});
	const [value, setValue] = useState(0);
	const [openModalPassword, setOpenModalPassword] = useState(false);
	const [openAlert, setOpenAlert] = useState(false);
	const [message, setMessage] = useState('');
	const [severity, setSeverity] = useState('success');
	const [turno, setTurno] = useState({});

	const {
		empleado,
		sucursal,
	} = props.location.state;

	const { permisos } = empleado.rol;

	const {
		history,
	} = props;

	const handleChangeTab = (event, newValue, close) => {
		setValue(newValue);
		close();
	};

	const handleAgendar = (event, rowData) => {
		setPacienteAgendado(rowData);
		setValue(Number(process.env.REACT_APP_PAGE_AGENDAR_CONSULTA));
	}

	const handleLogout = () => {
		history.push('/', { empleado: {}, sucursal: {} });
	}

	const handleClickCambioPassword = () => {
		setOpenModalPassword(true);
	}

	const handleOpen = () => {
		setOpenModalPassword(true);
	}

	const handleClose = () => {
		setOpenModalPassword(false);
	}

	const handleCloseAlert = () => {
		setOpenAlert(false);
	};

	const getTurno = async () => {
		const response = await findTurnoActualBySucursal(sucursal._id);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			const corte = response.data;
			setTurno(corte.turno);
		}
	}

	useEffect(() => {
		getTurno();
	}, []);

	let fragment = <Fragment>
		<MainContainer
			pacienteAgendado={pacienteAgendado}
			setPacienteAgendado={setPacienteAgendado}
			onChangeTab={handleChangeTab}
			onClickAgendar={handleAgendar}
			empleado={empleado}
			sucursal={sucursal}
			openModalPassword={openModalPassword}
			onClickLogout={handleLogout}
			onClickCambioPassword={handleClickCambioPassword}
			onOpen={handleOpen}
			onClose={handleClose}
			value={value}
			setMessage={setMessage}
			setSeverity={setSeverity}
			setOpenAlert={setOpenAlert}
			turno={turno}
			history={history} />
	</Fragment>


	return (
		<Fragment>
			{fragment}
			<Snackbar open={openAlert} autoHideDuration={5000} onClose={handleCloseAlert}>
				<Alert onClose={handleCloseAlert} severity={severity}>
					{message}
				</Alert>
			</Snackbar>
		</Fragment>
	);
}

export default MenuMainRecepcion;